import { Box } from '@mui/material';
import CrosswordCell from './CrosswordCell';
import { useEffect, useState, useRef, useMemo } from 'react';
import { CrosswordBoardProps } from '../../types/types';

const CrosswordBoard = ({ 
    grid, 
    handleClick, 
    isActiveCell, 
    activeCell, 
    activeDirection,
    handleInput
}: CrosswordBoardProps) => {
    const MIN_CELL_SIZE = 35;
    const MAX_CELL_SIZE = 55; 
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
            
            const parentWidth = containerRef.current.parentElement?.clientWidth || 500;
            const parentHeight = containerRef.current.parentElement?.clientHeight || 500;
            
            const numRows = grid.length;
            const numCols = grid[0].length;
            
            const maxCellWidth = parentWidth / numCols;
            const maxCellHeight = parentHeight / numRows; 
            
            const newSize = Math.min(Math.floor(maxCellWidth), Math.floor(maxCellHeight));
            
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
        const hasCorrectFeedback = grid?.some(row => 
            row.some(cell => cell.isCorrect)
        );
        
        const hasIncorrectFeedback = grid?.some(row => 
            row.some(cell => cell.isIncorrect && !cell.isCorrect)
        );
        
        setShowCorrectFeedback(hasCorrectFeedback);
        
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

    const boardWidth = grid && grid[0] ? grid[0].length * cellSize : 300;
    const boardHeight = grid ? grid.length * cellSize : 300;

    const isPartOfActiveWord = (rowIndex: number, colIndex: number): boolean => {
        if (!activeCell || !activeDirection) return false;
        
        // If this is the active cell, it's definitely not *just* part of the word
        if (activeCell.row === rowIndex && activeCell.col === colIndex) return false;
        
        const cell = grid[rowIndex][colIndex];
        if (!cell || cell.isBlocked) return false;
        
        if (activeDirection === 'across') {
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
            
            return colIndex >= startCol && colIndex <= endCol;
        } else {
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