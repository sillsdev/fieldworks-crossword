import { Box } from '@mui/material';
import CrosswordCell from './CrosswordCell';
import { useCrossword } from '../../hooks/useCrossword';

const CrosswordBoard = () => {
    const { 
        grid,
        isActiveCell,
        handleClick
    } = useCrossword();

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
                                value={cell.value}
                                number={cell.number}
                                isActive={isActiveCell(rowIndex, colIndex)}
                                isBlocked={cell.isBlocked}
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