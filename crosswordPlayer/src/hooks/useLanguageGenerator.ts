import { useState, useCallback } from 'react';

const useLanguageGenerator = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingCrossword, setGeneratingCrossword] = useState<boolean>(false);
  const [crosswordError, setCrosswordError] = useState<string | null>(null);

  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); 
      
      const response = await fetch('http://localhost:3000/fetch-languages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Data received:", data);
      
      if (!data || !Array.isArray(data)) {
        console.error("Invalid data format received:", data);
        throw new Error("Invalid data format received from server");
      }
      
      const validLanguages = data.filter(lang => lang !== null);
      return validLanguages;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCrossword = useCallback(async (projectName: string, projectCode: string) => {
    try {
        setGeneratingCrossword(true);
        setCrosswordError(null);

        console.log("Generating crossword");
        const response = await fetch(`http://localhost:3000/generate-crossword?projectName=${encodeURIComponent(projectName)}&projectCode=${encodeURIComponent(projectCode)}`, {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate crossword';
        setCrosswordError(errorMessage);
        console.error("Error generating crossword:", errorMessage);
        return null;
    } finally {
        setGeneratingCrossword(false);
    }
    }, []);


    return { 
        loading, 
        error, 
        fetchLanguages, 
        generatingCrossword, 
        crosswordError, 
        generateCrossword 
    };
};

export default useLanguageGenerator;