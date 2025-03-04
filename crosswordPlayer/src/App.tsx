import { Container, Box, Typography, Button } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';
import { useCrossword } from './hooks/useCrossword';

function App() {
  const { onCheckClick } = useCrossword();
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
          <CrosswordBoard />
          <Button 
            onClick={onCheckClick}
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
    </Container>
  )
}

export default App;