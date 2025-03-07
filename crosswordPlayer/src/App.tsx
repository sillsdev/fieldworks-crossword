import { Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';
import CrosswordClues from './components/Crossword/CrosswordClues';
import { useCrossword } from './hooks/useCrossword';
import LanguageSelector from './components/LanguageSelector';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { generateNewCrossword } from './utils/newCrossword';

const App = () => {
  const [crosswordData, setCrosswordData] = useState<any>(null);
  const theme = useTheme();
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');

  const { 
    handleCheckClick, 
    handleClueClick, 
    activeClue, 
    grid, 
    handleClick, 
    isActiveCell,
    formattedClues,
    handleInput,
    activeCell,
    activeDirection, 
    correctWords
  } = useCrossword(crosswordData);

  const handleOpenLanguageSelector = () => {
    setIsLanguageSelectorOpen(true);
  };

  const handleCloseLanguageSelector = () => {
    setIsLanguageSelectorOpen(false);
  };

  const handleCrosswordGenerated = (data: any) => {
    setCrosswordData(data);
    setIsLanguageSelectorOpen(false);
  };

  const handleGenerateNewPuzzle = async () => {
    if (selectedProject && selectedLanguage && selectedAnalysis) {
      try {
        const newCrosswordData = await generateNewCrossword(
          selectedProject,
          selectedLanguage,
          selectedAnalysis
        );
        if (newCrosswordData) {
          setCrosswordData(newCrosswordData);
        }
      } catch (err) {
        console.error("Error generating new crossword:", err);
      }
    } else {
      handleOpenLanguageSelector();
    }
  };

  return (
    <Container 
      sx={{ 
        width: '95vw',
        height: '95vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 2, sm: 4 },
        py: 2,
      }}
    >
      <Dialog 
        open={isLanguageSelectorOpen} 
        onClose={handleCloseLanguageSelector}
        fullWidth
        maxWidth="sm"
        BackdropProps={{
          style: {
            backgroundColor: `${theme.palette.grey[900]}`,
          },
        }}
      >
        <DialogTitle>Select Language</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <LanguageSelector 
              onCrosswordGenerated={handleCrosswordGenerated} 
              selectedProject={selectedProject}
              selectedLanguage={selectedLanguage}
              selectedAnalysis={selectedAnalysis}
              setSelectedProject={setSelectedProject}
              setSelectedLanguage={setSelectedLanguage}
              setSelectedAnalysis={setSelectedAnalysis}
            />          
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLanguageSelector}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ 
        width: '100%',
        textAlign: 'center',
        padding: { xs: 2, sm: 4 },
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'center', 
            alignItems: { xs: 'center', md: 'flex-start' }, 
            mt: { xs: 2, sm: 4 },
            gap: 3,
            width: '100%'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: { xs: '100%', md: '60%' }
          }}>
            <CrosswordBoard
              grid={grid}
              handleClick={handleClick}
              isActiveCell={isActiveCell}
              handleInput={handleInput}
              activeCell={activeCell} 
              activeDirection={activeDirection} 
            />
          </Box>
          <Box 
            sx={{ 
              width: { xs: '100%', md: '40%' }, 
              height: { md: 'auto' },
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              textAlign: 'left',
              mt: { xs: 3, md: 0 },
              alignSelf: { md: 'stretch' },
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.05)',
              },
              scrollBehavior: 'smooth',
            }}
          >
            <CrosswordClues 
              clues={formattedClues}
              onClueClick={handleClueClick}
              activeClue={activeClue}
              correctWords={correctWords} 
            />
          </Box>
        </Box>
        
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          gap: 2,
          justifyContent: 'center' 
        }}>
          <Button 
            onClick={handleCheckClick}
            variant="contained"
            sx={{ 
              width: 'fit-content',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
            }}
          >
            Check
          </Button>
          <Button 
            onClick={handleGenerateNewPuzzle}
            variant="contained"
            sx={{ 
              width: 'fit-content',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
            }}
          >
            Generate New Puzzle
          </Button>
          <Button 
            onClick={handleOpenLanguageSelector}
            variant="contained"
            sx={{ 
              width: 'fit-content',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
            }}
          >
            Language Selector
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;