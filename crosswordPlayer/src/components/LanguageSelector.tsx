import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import useLanguageGenerator from '../hooks/useLanguageGenerator';

interface LanguageData {
    languageCode: string;
    projectName: string;
}

interface LanguageSelectorProps {
    onCrosswordGenerated: (crosswordData: any) => void;
}

const LanguageSelector = ({ onCrosswordGenerated }: LanguageSelectorProps) => {
    const { fetchLanguages, loading, error, generateCrossword } = useLanguageGenerator(); 
    const [menuLanguages, setMenuLanguages] = useState<LanguageData[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");

    useEffect(() => {
        const loadLanguages = async () => {
          try {
            const fetchedLanguages = await fetchLanguages();
            if (fetchedLanguages) {
              setMenuLanguages(fetchedLanguages);
            }
          } catch (err) {
            console.error("Error fetching languages:", err);
          }
        };
        
        loadLanguages();
    }, [fetchLanguages]);

    const handleLanguageChange = async (event: SelectChangeEvent) => {
        const value = event.target.value;
        const selected = menuLanguages.find(lang => `${lang.projectName}-${lang.languageCode}` === value);
        
        if (selected) {
          setSelectedLanguage(value);
          try {
            const crosswordData = await generateCrossword(selected.projectName, selected.languageCode);
            if (crosswordData) {
                onCrosswordGenerated(crosswordData);
            }
          } catch (err) {
            console.error("Error generating crossword:", err);
          }
        }
    };

    return (
      <Box sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="language-select-label">Select Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={selectedLanguage}
          label="Select Language"
          onChange={handleLanguageChange}
          disabled={loading}
        >
          {loading ? (
            <MenuItem disabled>Loading languages...</MenuItem>
          ) : error ? (
            <MenuItem disabled>Error: {error}</MenuItem>
          ) : menuLanguages.length === 0 ? (
            <MenuItem disabled>No languages available</MenuItem>
          ) : (
            menuLanguages.map((language) => (
              <MenuItem
                key={`${language.projectName}-${language.languageCode}`}
                value={`${language.projectName}-${language.languageCode}`}
              >
                {language.projectName} ({language.languageCode})
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
    )
};

export default LanguageSelector;

