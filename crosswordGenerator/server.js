const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

const { generateLayout } = require('./layout-generator.js');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/fetch-project-names", async (req, res) => {
    console.log("Fetching data from external API...");
    const apiUrl = 'http://localhost:49279/api/localProjects';
    
    try {
        const apiResponse = await axios.get(apiUrl);
        const projects = await Promise.all(apiResponse.data.map(async (element) => {
            if (element.fwdata === true) {
                // get project name for each fwdata project
                return element.name;
            }
            return null;
        }));
        res.json(projects.filter(lang => lang !== null));
    } catch (error) {
        console.error("Error fetching languages:", error.message);
    }
});

app.get("/fetch-vernacular-languages", async (req, res) => {
    console.log("Fetching data from external API...");
    const apiUrl = 'http://localhost:49279/api/localProjects';
    
    try {
        const apiResponse = await axios.get(apiUrl);
        const languages = await Promise.all(apiResponse.data.map(async (element) => {
            if (element.fwdata === true) {
                // get language code for each fwdata project
                const languageInfo = await fetchLanguages(element.name);
                return languageInfo.vernacularLanguages;
            }
            return null;
        }));
        res.json(languages.filter(lang => lang !== null));
    } catch (error) {
        console.error("Error fetching languages:", error.message);
    }
});

app.get("/fetch-analysis-languages", async (req, res) => {
    console.log("Fetching data from external API...");
    const apiUrl = 'http://localhost:49279/api/localProjects';
    
    try {
        const apiResponse = await axios.get(apiUrl);
        const languages = await Promise.all(apiResponse.data.map(async (element) => {
            if (element.fwdata === true) {
                // get language code for each fwdata project
                const languageInfo = await fetchLanguages(element.name);
                return languageInfo.analysisLanguages;
            }
            return null;
        }));
        res.json(languages.filter(lang => lang !== null));
    } catch (error) {
        console.error("Error fetching languages:", error.message);
    }
});


// fetch language code for each project
async function fetchLanguages(projectName) {
    const languageUrl = `http://localhost:49279/api/mini-lcm/FwData/${projectName}/writingSystems`;
    
    try {
        const languageResponse = await axios.get(languageUrl);
        const analysisLanguages = languageResponse.data.analysis.map(analysisEntry => analysisEntry.name);
        const vernacularLanguages = languageResponse.data.vernacular.map(vernacularEntry => vernacularEntry.name);
        let response = {
            vernacularLanguages: vernacularLanguages,
            analysisLanguages: analysisLanguages
        }
        return response;
    } catch (error) {
        console.error("Error fetching language data:", error.message);
    }
}

app.get("/generate-crossword", async (req, res) => {
    console.log("Generating Crossword...");
    const { projectName, languageCode, analysisLanguage } = req.query;
    // IF projectname or languageCode is not present throw an error
    if (!projectName || !languageCode) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Missing required query parameters."
        });
    }
    const apiUrl = `http://localhost:49279/api/mini-lcm/FwData/${projectName}/entries?count=-1`;
    
    try {
        const apiResponse = await axios.get(apiUrl);
        // filter words
        const filteredData = apiResponse.data.filter(entry => {
            let word = entry.citationForm[languageCode] || entry.lexemeForm[languageCode];
            return validateWord(word);
        });
        let my10Words = chooseRandomWords(filteredData, 10);
        // make chosen words into an object
        const input = my10Words.map(entry => {
            // Define clue for each entry
            let clue = (entry.senses[0].definition.hasOwnProperty(analysisLanguage) ? entry.senses[0].definition[analysisLanguage] : Object.values(entry.senses[0].definition)[0]) 
                || (entry.senses[0].gloss.hasOwnProperty(analysisLanguage) ? entry.senses[0].gloss[analysisLanguage] : Object.values(entry.senses[0].gloss)[0]);
            return {
                clue: clue,
                answer: (entry.citationForm[languageCode] || entry.lexemeForm[languageCode]).normalize("NFC")
            };
        });
        var layout = generateLayout(input);
        res.json(layout);
    } catch (error) {
        console.error("Error fetching data:", error.message);
        // Return an appropriate error response
        if (error.type === "NotFound") {
            return res.status(404).json({
                error: "Not Found",
                message: "The requested resource was not found."
            });
        } else {
            return res.status(500).json({
                error: "Internal Server Error",
                message: error.message || "An unexpected error occurred on the server."
            });
        }
    }
});

function chooseRandomWords(dictionaryWords, numWords) {
    const randomWords = [];
    const usedIndices = new Set();
    while (randomWords.length < numWords) {
        const randomIndex = Math.floor(Math.random() * dictionaryWords.length);
        // make sure the index hasn't been picked already
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            randomWords.push(dictionaryWords[randomIndex]);
        }
    }
    return randomWords;
}

// make sure word does not contain spaces or numbers
// makes sure it is between 4 and 10 characters long
// this can be added to if we determine more validation is needed
function validateWord(word) {
    word = word.normalize("NFC");
    return word.length <= 10 && word.length >= 4 && !/[\s\d]/.test(word);
}