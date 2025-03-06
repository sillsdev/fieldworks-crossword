import { Container, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';
import CrosswordClues from './components/Crossword/CrosswordClues';
import { useCrossword } from './hooks/useCrossword';
import useLanguageGenerator from './hooks/useLanguageGenerator';
import { useState, useEffect } from 'react';

interface LanguageData {
  languageCode: string;
  projectName: string;
}

function App() {
  const { 
    handleCheckClick, 
    handleClueClick, 
    activeClue, 
    grid, 
    handleClick, 
    isActiveCell 
  } = useCrossword();

  const { fetchLanguages, loading, error } = useLanguageGenerator(); 

  const [menuLanguages, setMenuLanguages] = useState<LanguageData[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  // Fetch languages on component mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const fetchedLanguages = await fetchLanguages();
        console.log("Languages fetched:", fetchedLanguages);
        if (fetchedLanguages) {
          setMenuLanguages(fetchedLanguages);
        }
      } catch (err) {
        console.error("Error fetching languages:", err);
      }
    };
    
    loadLanguages();
  }, [fetchLanguages]);
  
  const handleLanguageChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const selected = menuLanguages.find(lang => `${lang.projectName}-${lang.languageCode}` === value);
    
    if (selected) {
      setSelectedLanguage(value);
      console.log(`Selected project: ${selected.projectName}, language code: ${selected.languageCode}`);
    }
  };

  return (
    <Container 
      sx={{ 
        width: '100vw',
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        px: { xs: 2, sm: 4 },
        py: 2,
        pt: 4
      }}
    >
      {/* Language selector */}
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

      {/* Crossword puzzle */}
      <Box sx={{ 
        width: '100%',
        maxWidth: 600,
        textAlign: 'center',
        padding: { xs: 2, sm: 4 },
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          Crossword Puzzle
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mt: { xs: 2, sm: 4 } 
          }}
        >
          <CrosswordBoard
            grid={grid}
            handleClick={handleClick}
            isActiveCell={isActiveCell}
           />
          <Button 
            onClick={handleCheckClick}
            variant="contained"
            sx={{ 
              mt: 2, 
              width: 'fit-content',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
            }}
          >
            Check
          </Button>
        </Box>
      </Box>
      
      {/* Crossword clues */}
      <Box sx={{ width: '100%', maxWidth: 600, mt: 3 }}>
        <CrosswordClues 
          onClueClick={handleClueClick}
          activeClue={activeClue}
        />
      </Box>
    </Container>
  );
}

export default App;