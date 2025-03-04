import { Box } from '@mui/material';
import CrosswordCell from './CrosswordCell';
//import CrosswordClues from './CrosswordClues';
import { useCrossword } from '../../hooks/useCrossword';

const CrosswordBoard = () => {
    const { 
        grid,
        handleCellClick,
        handleKeyDown,
        isActiveCell,
    } = useCrossword();

    if (!grid || grid.length == 0) {
        return <Box>Loading crossword...</Box>
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
        }}>
            <Box sx={(theme) => ({
                display: 'inline-block',
                border: `2px solid ${theme.palette.grey[900]}`,
            })}>
                {grid.map((row, rowIndex) => (
                    <Box key={rowIndex} sx={{
                        display: 'flex',
                    }}>
                        {row.map((cell, colIndex) => (
                            <CrosswordCell 
                                key={`cell-${rowIndex}-${colIndex}`}
                                value={cell.value}
                                number={cell.number}
                                isActive={isActiveCell(rowIndex, colIndex)}
                                isBlocked={cell.isBlocked}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                onKeyDown={(event) => handleKeyDown(event as React.KeyboardEvent<HTMLDivElement>)}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
            
            {/* <CrosswordClues 
                //onClueClick={handleClueClick}
                //activeClue={activeClue}
            /> */}
        </Box>
    );
};

export default CrosswordBoard;