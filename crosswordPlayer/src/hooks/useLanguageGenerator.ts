import { useState } from 'react';

interface LanguageData {
  languageCode: string;
  projectName: string;
}

const useLanguageGenerator = () => {
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
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
      setLanguages(validLanguages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
    } finally {
      setLoading(false);
    }
  };


  return { languages, loading, error, fetchLanguages };
};

export default useLanguageGenerator;