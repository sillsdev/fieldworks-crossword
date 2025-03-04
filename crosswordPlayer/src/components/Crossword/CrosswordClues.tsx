// import { Box, Typography, List, ListItem } from '@mui/material';
// import useClueInteraction from '../../hooks/useClueInteraction';

// interface CrosswordCluesProps {
//   clues?: {
//     across: Array<{ number: number; clue: string }>;
//     down: Array<{ number: number; clue: string }>;
//   };
//   onClueClick?: (type: 'across' | 'down', number: number) => void;
//   activeClue?: { type: 'across' | 'down'; number: number } | null;
// }

// const CrosswordClues: React.FC<CrosswordCluesProps> = ({
//   clues = {
//     across: [
//       { number: 1, clue: "Capital of France" },
//       { number: 3, clue: "Frozen water" },
//       { number: 5, clue: "Opposite of night" },
//     ],
//     down: [
//       { number: 1, clue: "Planet we live on" },
//       { number: 2, clue: "Color of sky" },
//       { number: 4, clue: "Small flying insect" },
//     ]
//   },
//   onClueClick,
//   activeClue = null,
// }) => {
//   const renderClue = (type: 'across' | 'down', { number, clue }: { number: number; clue: string }) => {
//     const isActive = activeClue?.type === type && activeClue?.number === number;
//     const { handleClick, getStyles } = useClueInteraction({ isActive, onClueClick, type, number });

//     return (
//       <ListItem 
//         key={`${type}-${number}`}
//         sx={getStyles}
//         onClick={handleClick}
//       >
//         <Typography>
//           <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{number}.</span>
//           {clue}
//         </Typography>
//       </ListItem>
//     );
//   };

//   return (
//     <Box sx={(theme) => ({
//       display: 'flex',
//       flexDirection: 'column',
//       gap: theme.spacing(2),
//       maxWidth: 300,
//       marginLeft: theme.spacing(2),
//     })}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h6">Clues</Typography>
//       </Box>

//       <Box>
//         <Typography variant="subtitle1" gutterBottom fontWeight="bold">Across</Typography>
//         <List sx={{ padding: 0 }}>
//           {clues.across.map((clue) => renderClue('across', clue))}
//         </List>
//       </Box>

//       <Box>
//         <Typography variant="subtitle1" gutterBottom fontWeight="bold">Down</Typography>
//         <List sx={{ padding: 0 }}>
//           {clues.down.map((clue) => renderClue('down', clue))}
//         </List>
//       </Box>
//     </Box>
//   );
// };

// export default CrosswordClues;