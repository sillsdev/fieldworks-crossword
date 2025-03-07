import { useState, useCallback } from 'react';

const useLanguageGenerator = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingCrossword, setGeneratingCrossword] = useState<boolean>(false);
  const [crosswordError, setCrosswordError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); 
      
      const response = await fetch('http://localhost:3000/fetch-project-names', {
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
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVernacularLanguages = useCallback(async (projectName: string) => {
    try {
      setLoading(true);
      setError(null); 
      
      const response = await fetch(`http://localhost:3000/fetch-vernacular-languages?projectName=${encodeURIComponent(projectName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      const data = await response.json();

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalysisLanguages = useCallback(async (projectName: string) => {
    try {
      setLoading(true);
      setError(null); 
      
      const response = await fetch(`http://localhost:3000/fetch-analysis-languages?projectName=${encodeURIComponent(projectName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      const data = await response.json();

      if (!data || !Array.isArray(data)) {
        console.error("Invalid data format received:", data);
        throw new Error("Invalid data format received from server");
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
    }
    finally {
      setLoading(false);
    }
  }, []);

  const fetchPublications = useCallback(async (projectName: string) => {
    try {
      setLoading(true);
      setError(null); 
      
      const response = await fetch(`http://localhost:3000/fetch-publications?projectName=${encodeURIComponent(projectName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      const data = await response.json();

      if (!data || !Array.isArray(data)) {
        console.error("Invalid data format received:", data);
        throw new Error("Invalid data format received from server");
      }

      return data;
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
    }
    finally {
      setLoading(false);
    }
  }, []);


  const generateCrossword = useCallback(async (projectName: string, projectCode: string, analysisLanguage: string, publication: string) => {
    try {
        setGeneratingCrossword(true);
        setCrosswordError(null);

        console.log("Generating crossword");
        const response = await fetch(
            `http://localhost:3000/generate-crossword?projectName=${encodeURIComponent(projectName)}&languageCode=${encodeURIComponent(projectCode)}&analysisLanguage=${encodeURIComponent(analysisLanguage)}&publication=${encodeURIComponent(publication)}`, {
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
        fetchProjects, 
        generatingCrossword, 
        crosswordError, 
        generateCrossword,
        fetchVernacularLanguages,
        fetchAnalysisLanguages,
        fetchPublications
    };
};

export default useLanguageGenerator;