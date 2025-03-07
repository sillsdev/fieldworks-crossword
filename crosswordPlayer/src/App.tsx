import { Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';
import CrosswordClues from './components/Crossword/CrosswordClues';
import { useCrossword } from './hooks/useCrossword';
import LanguageSelector from './components/LanguageSelector';
import { useState } from 'react';

function App() {
  const [crosswordData, setCrosswordData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { 
    handleCheckClick, 
    handleClueClick, 
    activeClue, 
    grid, 
    handleClick, 
    isActiveCell,
    formattedClues
  } = useCrossword(crosswordData);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCrosswordGenerated = (data: any) => {
    setCrosswordData(data);
    handleCloseModal(); // Close the modal after generating the crossword
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
      {/* Modal/Dialog for language selection */}
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
{}
      {/* 
      {!crosswordData && (
        <Box sx={{ mb: 4, width: '100%' }}>
          <LanguageSelector onCrosswordGenerated={handleCrosswordGenerated} />
        </Box>
      )}
        */
    }

      <Box sx={{ 
        width: '100%',
        maxWidth: 900,
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
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'center', 
            alignItems: { xs: 'center', md: 'flex-start' }, 
            mt: { xs: 2, sm: 4 },
            gap: 3
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CrosswordBoard
              grid={grid}
              handleClick={handleClick}
              isActiveCell={isActiveCell}
             />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
                variant="outlined"
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
          <Box 
            sx={{ 
              width: { xs: '100%', md: '40%' }, 
              maxHeight: { xs: '300px', md: '500px' },
              overflow: 'auto',
              textAlign: 'left',
              mt: { xs: 3, md: 0 }
            }}
          >
            <CrosswordClues 
              clues={formattedClues}
              onClueClick={handleClueClick}
              activeClue={activeClue}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;