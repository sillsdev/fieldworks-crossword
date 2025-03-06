import { Container, Box, Typography, Button, Grid } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';
import CrosswordClues from './components/Crossword/CrosswordClues';
import { useCrossword } from './hooks/useCrossword';
import LanguageSelector from './components/LanguageSelector';
import { useState } from 'react';

function App() {
  const [crosswordData, setCrosswordData] = useState<any>(null);

  const { 
    handleCheckClick, 
    handleClueClick, 
    activeClue, 
    grid, 
    handleClick, 
    isActiveCell,
    formattedClues
  } = useCrossword(crosswordData);

  const handleCrosswordGenerated = (data: any) => {
    setCrosswordData(data);
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
        pt: 8,
        boxSizing: 'border-box'
      }}
    >
      <LanguageSelector onCrosswordGenerated={handleCrosswordGenerated} />
      <Box sx={{ 
        width: '100%',
        maxWidth: 1200,
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
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CrosswordBoard
              grid={grid}
              handleClick={handleClick}
              isActiveCell={isActiveCell}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CrosswordClues 
              onClueClick={handleClueClick}
              activeClue={activeClue}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
        </Box>
      </Box>
      <Box sx={{ width: '100%', maxWidth: 600, mt: 3 }}>
        <CrosswordClues 
          clues={formattedClues}
          onClueClick={handleClueClick}
          activeClue={activeClue}
        />
      </Box>
    </Container>
  );
}

export default App;