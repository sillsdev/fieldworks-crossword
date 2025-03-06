const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

const { generateLayout } = require('./layout-generator.js');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
app.get("/fetch-languages", async (req, res) => {
    console.log("Fetching data from external API...");
    const apiUrl = 'http://localhost:49279/api/localProjects';
    
    try {
        const apiResponse = await axios.get(apiUrl);
        const languages = await Promise.all(apiResponse.data.map(async (element) => {
            if (element.fwdata === true) {
                // get language code for each fwdata project
                const language = await fetchLanguage(element.name);
                const languageData = {
                    languageCode: language,
                    projectName: element.name
                }
                return languageData;
            }
            return null;
        }));
        res.json(languages.filter(lang => lang !== null));
    } catch (error) {
        console.error("Error fetching languages:", error.message);
    }
});

// fetch language code for each project
async function fetchLanguage(projectName) {
    const languageUrl = `http://localhost:49279/api/mini-lcm/FwData/${projectName}/writingSystems`;
    
    try {
        const languageResponse = await axios.get(languageUrl);
        return languageResponse.data.vernacular[0].name;
    } catch (error) {
        console.error("Error fetching language data:", error.message);
    }
}

app.get("/generate-crossword", async (req, res) => {
    console.log("Fetching words...");
    const { projectName } = req.query;
    const apiUrl = `http://localhost:49279/api/mini-lcm/FwData/${projectName}/entries?count=-1`;
    
    try {
        const apiResponse = await axios.get(apiUrl);
        // filter words
        const filteredData = apiResponse.data.filter(entry => {
            let word = entry.citationForm.seh || entry.lexemeForm.seh;
            return validateWord(word);
        });
        let my10Words = chooseRandomWords(filteredData, 10);
        // make chosen words into an object
        const input = my10Words.map(entry => ({
            clue: (entry.senses[0].definition.en || entry.senses[0].gloss.en),
            answer: (entry.citationForm.seh || entry.lexemeForm.seh)
        }));
        var layout = generateLayout(input);
        console.log("Printing layout", layout);
    } catch (error) {
        console.error("Error fetching data:", error.message);
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
    return word.length <= 10 && word.length >= 4 && !/[\s\d]/.test(word);
}