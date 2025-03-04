const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const { generateLayout } = require('./layout-generator.js');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
app.get("/fetch-data", async (req, res) => {
    console.log("Fetching data from external API...");
    const apiUrl = 'http://localhost:49279/api/localProjects';
    
    try {
        const apiResponse = await axios.get(apiUrl);
        // Print the data from the API
        console.log(apiResponse.data[0].apiEndpoint);
        console.log('Data from API:', apiResponse.data);
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
});

app.get("/fetch-words", async (req, res) => {
    console.log("Fetching words...");
    const apiUrl = 'http://localhost:49279/api/mini-lcm/FwData/sena-3/entries?count=-1';
    
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