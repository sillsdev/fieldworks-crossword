import { Box } from '@mui/material';
import CrosswordCell from './CrosswordCell';
import { useCrossword } from '../../hooks/useCrossword';
import useInput from '../../hooks/useInput';

const CrosswordBoard = () => {
    const { 
        grid,
        handleCellClick,
        isActiveCell,
    } = useCrossword();

    const { grid, selectedCell, handleClick } = useInput(crosswordGrid.map(row => row.map(cell => cell.value)));

    if (!grid || grid.length === 0) {
        return <Box>Loading crossword...</Box>
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto', 
        }}>
            <Box sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                border: `2px solid ${theme.palette.grey[900]}`,
                width: '100%',
                maxWidth: '500px',
                margin: 'auto',
            })}>
                {grid.map((row, rowIndex) => (
                    <Box 
                        key={rowIndex} 
                        sx={{
                            display: 'flex',
                            width: '100%',
                        }}
                    >
                        {row.map((cell, colIndex) => (
                            <CrosswordCell 
                                key={`cell-${rowIndex}-${colIndex}`}
                                value={cell}
                                number={crosswordGrid[rowIndex][colIndex].number}
                                isActive={isActiveCell(rowIndex, colIndex)}
                                isBlocked={crosswordGrid[rowIndex][colIndex].isBlocked}
                                onClick={() => handleClick(rowIndex, colIndex)}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CrosswordBoard;