export async function generateNewCrossword(project: string, language: string, analysisLanguage: string) {
    try {
        const response = await fetch(
            `http://localhost:3000/generate-crossword?projectName=${encodeURIComponent(project)}&languageCode=${encodeURIComponent(language)}&analysisLanguage=${encodeURIComponent(analysisLanguage)}`, {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors'
        });
      
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
        } catch (error) {
            console.error("Error generating crossword:", error);
            throw error;
        }
  }