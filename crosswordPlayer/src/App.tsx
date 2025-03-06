import { Container, Box, Typography, Button, Menu, MenuItem } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';
import CrosswordClues from './components/Crossword/CrosswordClues';
import { useCrossword } from './hooks/useCrossword';
import useLanguageGenerator from './hooks/useLanguageGenerator';
import { useState } from 'react';

function App() {
  const { 
    handleCheckClick, 
    handleClueClick, 
    activeClue, 
    grid, 
    handleClick, 
    isActiveCell 
  } = useCrossword();

  const { fetchLanguages, languages } = useLanguageGenerator(); 

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Select Language");
  const open = Boolean(anchorEl);

  const handleLanguageClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await fetchLanguages();
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLanguageSelect = (projectName: string, languageCode: string) => {
    setSelectedLanguage(projectName);
    handleClose();
    console.log(`Selected project: ${projectName}, language code: ${languageCode}`);
  };

  return (
    <Container 
      sx={{ 
        width: '100vw',
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 2, sm: 4 },
        py: 2,
        pt: 8
      }}
    >
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
      <Box>
        <Button
          onClick={handleLanguageClick}
          variant="outlined"
        >
          {selectedLanguage}
        </Button>
        <Menu
          id="language-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.projectName}
              onClick={() => handleLanguageSelect(language.projectName, language.languageCode)}
            >
              {language.languageCode}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      { <CrosswordClues 
          onClueClick={handleClueClick}
          activeClue={activeClue}
      /> }
    </Container>
  )
}

export default App;