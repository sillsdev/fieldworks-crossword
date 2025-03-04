import { Container, Box, Typography, Button } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';
import { useCrossword } from './hooks/useCrossword';

function App() {
  const { onCheckClick } = useCrossword();
  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crossword Puzzle
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", mt: 4 }}>
          <CrosswordBoard />
          <Button onClick={onCheckClick}>
            Check
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default App