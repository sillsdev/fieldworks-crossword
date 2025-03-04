import { Container, Box, Typography } from '@mui/material';
import CrosswordBoard from './components/Crossword/CrosswordBoard';

function App() {
  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crossword Puzzle
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CrosswordBoard />
        </Box>
      </Box>
    </Container>
  )
}

export default App