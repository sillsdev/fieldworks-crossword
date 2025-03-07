import { Box } from '@mui/material';
import CrosswordCell from './CrosswordCell';
import { useEffect, useState, useRef } from 'react';
import { CrosswordBoardProps } from '../../types/types';

const CrosswordBoard: React.FC<CrosswordBoardProps> = ({ grid, handleClick, isActiveCell, handleInput }) => {
    const [cellSize, setCellSize] = useState(40); 
    const containerRef = useRef<HTMLDivElement>(null);
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    },[isActiveCell]);
    
    // Calculate grid dimensions only when row/column count changes
    const gridDimensions = useMemo(() => {
        return {
            rows: grid?.length || 0,
            cols: grid?.[0]?.length || 0
        };
    }, [grid?.length, grid?.[0]?.length]);

    useEffect(() => {
        if (!grid || grid.length === 0) return;
        
        const calculateCellSize = () => {
            if (!containerRef.current) return MIN_CELL_SIZE;
            
            // Get parent container width (the outer Box)
            const parentWidth = containerRef.current.parentElement?.clientWidth || 500;
            const parentHeight = containerRef.current.parentElement?.clientHeight || 500;
            
            const numRows = grid.length;
            const numCols = grid[0].length;
            
            // Calculate how big each cell can be based on parent dimensions
            const maxCellWidth = parentWidth / numCols;
            const maxCellHeight = parentHeight / numRows; 
            
            // Use the smaller dimension to ensure cells are square
            const newSize = Math.min(Math.floor(maxCellWidth), Math.floor(maxCellHeight));
            
            // Keep size within reasonable bounds
            return Math.min(MAX_CELL_SIZE, Math.max(MIN_CELL_SIZE, newSize));
        };
        
        setCellSize(calculateCellSize());
        
        const handleResize = () => {
            setCellSize(calculateCellSize());
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [gridDimensions]);

    useEffect(() => {
        // First identify correct cells
        const hasCorrectFeedback = grid?.some(row => 
            row.some(cell => cell.isCorrect)
        );
        
        // For incorrect cells, STRICTLY exclude any that are also marked as correct
        const hasIncorrectFeedback = grid?.some(row => 
            row.some(cell => cell.isIncorrect && !cell.isCorrect)
        );
        
        // Always update correct feedback first
        setShowCorrectFeedback(hasCorrectFeedback);
        
        // Then handle incorrect feedback
        if (hasIncorrectFeedback) {
            setShowIncorrectFeedback(true);
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = setTimeout(() => {
                setShowIncorrectFeedback(false);
            }, 3000);
        } else {
            setShowIncorrectFeedback(false);
        }
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [grid]);

    // Calculate the actual board size based on cell size (for rendering only)
    const boardWidth = grid && grid[0] ? grid[0].length * cellSize : 300;
    const boardHeight = grid ? grid.length * cellSize : 300;

    // This function determines if a cell is part of the active word
    const isPartOfActiveWord = (rowIndex: number, colIndex: number): boolean => {
        if (!activeCell || !activeDirection) return false;
        
        // If this is the active cell, it's definitely not *just* part of the word
        if (activeCell.row === rowIndex && activeCell.col === colIndex) return false;
        
        const cell = grid[rowIndex][colIndex];
        if (!cell || cell.isBlocked) return false;
        
        if (activeDirection === 'across') {
            // For across words, cells must be in the same row as the active cell
            if (rowIndex !== activeCell.row) return false;
            
            // Find the bounds of the word
            let startCol = activeCell.col;
            let endCol = activeCell.col;
            
            // Find the leftmost cell in this word
            while (startCol > 0 && !grid[rowIndex][startCol - 1].isBlocked) {
                startCol--;
            }
            
            // Find the rightmost cell in this word
            while (endCol < grid[0].length - 1 && !grid[rowIndex][endCol + 1].isBlocked) {
                endCol++;
            }
            
            // Return true if the cell is within the bounds of the word
            return colIndex >= startCol && colIndex <= endCol;
        } else {
            // For down words, cells must be in the same column as the active cell
            if (colIndex !== activeCell.col) return false;
            
            // Find the bounds of the word
            let startRow = activeCell.row;
            let endRow = activeCell.row;
            
            // Find the topmost cell in this word
            while (startRow > 0 && !grid[startRow - 1][colIndex].isBlocked) {
                startRow--;
            }
            
            // Find the bottommost cell in this word
            while (endRow < grid.length - 1 && !grid[endRow + 1][colIndex].isBlocked) {
                endRow++;
            }
            
            // Return true if the cell is within the bounds of the word
            return rowIndex >= startRow && rowIndex <= endRow;
        }
    };

    return (
        <Box 
            sx={{
                width: '100%',
                maxWidth: '100%',
                maxHeight: '70vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflowY: 'auto',
                padding: 1,
                // Add some styling for better scrolling experience
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                },
            }}
        >
            <input
                ref={inputRef}
                type="text"
                style={{ 
                    position: 'absolute', 
                    opacity: 0, 
                    pointerEvents: 'none' 
                }}
                onCompositionEnd={(e) => {
                    const finalChar = e.data.slice(-1);
                    handleInput(finalChar);
                    e.currentTarget.value = '';
                }}
                onChange={(e) => {
                    if (e.target.value) {
                        const char = e.target.value.slice(-1);
                        handleInput(char);
                        e.target.value = '';
                    }
                }}
                autoFocus
            />
            <Box
                ref={containerRef}
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${theme.palette.grey[900]}`,
                    width: boardWidth,
                    height: boardHeight,
                    margin: 'auto',
                    flexShrink: 0,
                })}
            >
                {grid.map((row, rowIndex: number) => (
                    <Box 
                        key={rowIndex} 
                        sx={{
                            display: 'flex',
                            height: cellSize,
                            width: '100%',
                        }}
                    >
                        {row.map((cell, colIndex: number) => (
                            <CrosswordCell 
                                key={`cell-${rowIndex}-${colIndex}`}
                                value={cell.value}
                                number={cell.number}
                                isActive={isActiveCell(rowIndex, colIndex)}
                                isPartOfActiveWord={isPartOfActiveWord(rowIndex, colIndex)}
                                isCorrect={showCorrectFeedback && cell.isCorrect}
                                isIncorrect={showIncorrectFeedback && cell.isIncorrect && !cell.isCorrect}
                                isBlocked={cell.isBlocked}
                                onClick={cell.isBlocked ? undefined : () => handleClick(rowIndex, colIndex)}
                                width={cellSize}
                                height={cellSize}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CrosswordBoard;