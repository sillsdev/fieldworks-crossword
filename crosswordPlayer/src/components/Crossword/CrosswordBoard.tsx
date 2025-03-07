import { Box } from '@mui/material';
import CrosswordCell from './CrosswordCell';
import { useEffect, useState, useRef, useMemo } from 'react';

const CrosswordBoard = ({ grid, handleClick, isActiveCell }) => {
    const MIN_CELL_SIZE = 30; // Minimum usable cell size
    const MAX_CELL_SIZE = 50; // Maximum cell size for readability
    
    const [cellSize, setCellSize] = useState(MIN_CELL_SIZE); 
    const containerRef = useRef<HTMLDivElement>(null);
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
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

    return (
        <Box 
            sx={{
                width: '100%',
                maxWidth: '100%',
                maxHeight: '70vh', // Limit height to prevent takeover
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto', // Enable scrolling if needed
                padding: 1,
            }}
        >
            <Box
                ref={containerRef}
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${theme.palette.grey[900]}`,
                    width: boardWidth, // Use calculated width
                    height: boardHeight, // Use calculated height
                    margin: 'auto',
                    flexShrink: 0, // Prevent shrinking
                })}
            >
                {grid.map((row, rowIndex) => (
                    <Box 
                        key={rowIndex} 
                        sx={{
                            display: 'flex',
                            height: cellSize,
                            width: '100%',
                        }}
                    >
                        {row.map((cell, colIndex) => (
                            <CrosswordCell 
                                key={`cell-${rowIndex}-${colIndex}`}
                                value={cell.value}
                                number={cell.number}
                                isActive={isActiveCell(rowIndex, colIndex)}
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