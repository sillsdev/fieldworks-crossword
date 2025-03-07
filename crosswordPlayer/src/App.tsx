import { Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';
import CrosswordClues from './components/Crossword/CrosswordClues';
import { useCrossword } from './hooks/useCrossword';
import LanguageSelector from './components/LanguageSelector';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const App = () => {
  const [crosswordData, setCrosswordData] = useState<any>(null);
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Set initial state to true

  const { 
    handleCheckClick, 
    handleClueClick, 
    activeClue, 
    grid, 
    handleClick, 
    isActiveCell,
    formattedClues,
    activeCell, 
    activeDirection, 
    correctWords 
  } = useCrossword(crosswordData);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCrosswordGenerated = (data: any) => {
    setCrosswordData(data);
    handleCloseModal(); 
  };

  return (
    <Container 
      sx={{ 
        width: '100vw',
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 2, sm: 4 },
        py: 2,
        pt: 16,
      }}
    >
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Generate New Puzzle</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <LanguageSelector onCrosswordGenerated={handleCrosswordGenerated} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ 
        width: '100%',
        //maxWidth: 900,
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
            onClick={handleOpenModal}
            variant="contained"
            sx={{ 
              width: 'fit-content',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
            }}
          >
            Generate New Puzzle
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;