import { Box, Typography, List, ListItem } from '@mui/material';
import useClueInteraction from '../../hooks/useClueInteraction';
import { CrosswordCluesProps } from '../../types/types';

const Clue = ({ 
  type, 
  clue, 
  isActive, 
  isCorrect, 
  onClueClick 
}: { 
  type: 'across' | 'down';
  clue: { number: number; clue: string };
  isActive: boolean;
  isCorrect: boolean; 
  onClueClick?: (type: 'across' | 'down', number: number) => void;
}) => {
  const { handleClick, getStyles } = useClueInteraction({ isActive, onClueClick, type, number: clue.number });
  
  return (
    <ListItem 
      key={`${type}-${clue.number}`}
      sx={{
        ...getStyles,
        textDecoration: isCorrect ? 'line-through' : 'none', 
        backgroundColor: isCorrect ? '#c8e6c9' : 'inherit', 
        color: isCorrect ? '#004400' : 'inherit', 
        borderRadius: '4px', // Add border radius
        cursor: 'pointer', // Add cursor pointer
        '&:hover': {
          backgroundColor: isActive ? '#e3f2fd' : '#f0f0f0', 
        },
      }}
      onClick={handleClick}
    >
      <Typography>
        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{clue.number}.</span>
        {clue.clue}
      </Typography>
    </ListItem>
  );
};

const CrosswordClues: React.FC<CrosswordCluesProps> = ({
  clues,
  onClueClick,
  activeClue = null,
  correctWords 
}) => {
  return (
    <Box sx={(theme) => ({
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      maxWidth: 300,
      marginLeft: theme.spacing(2),
    })}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Clues</Typography>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">Across</Typography>
        <List sx={{ padding: 0 }}>
          {clues.across.map((clue) => (
            <Clue 
              key={`across-${clue.number}`}
              type="across"
              clue={clue}
              isActive={activeClue?.type === 'across' && activeClue?.number === clue.number}
              isCorrect={correctWords.includes(`across-${clue.number}`)} 
              onClueClick={onClueClick}
            />
          ))}
        </List>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">Down</Typography>
        <List sx={{ padding: 0 }}>
          {clues.down.map((clue) => (
            <Clue 
              key={`down-${clue.number}`}
              type="down"
              clue={clue}
              isActive={activeClue?.type === 'down' && activeClue?.number === clue.number}
              isCorrect={correctWords.includes(`down-${clue.number}`)} 
              onClueClick={onClueClick}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default CrosswordClues;