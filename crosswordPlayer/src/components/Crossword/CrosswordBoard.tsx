import { Box } from '@mui/material';
import CrosswordCell from './CrosswordCell';
import { useEffect, useState, useRef, useMemo } from 'react';

const CrosswordBoard = ({ grid, handleClick, isActiveCell }) => {
    const [cellSize, setCellSize] = useState(40); 
    const containerRef = useRef<HTMLDivElement>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Calculate grid dimensions only when row/column count changes
    const gridDimensions = useMemo(() => {
        return {
            rows: grid?.length || 0,
            cols: grid?.[0]?.length || 0
        };
    }, [grid?.length, grid?.[0]?.length]);
    
    useEffect(() => {
        if (!grid || grid.length === 0 || !containerRef.current) return;
        
        const calculateCellSize = () => {
            const containerWidth = containerRef.current?.clientWidth || 500;
            
            const numRows = grid.length;
            const numCols = grid[0].length;
            
            const maxCellWidth = (containerWidth - 20) / numCols;
            const maxCellHeight = (containerWidth - 20) / numRows; 
            
            const newSize = Math.min(Math.floor(maxCellWidth), Math.floor(maxCellHeight));
            
            return Math.max(30, Math.min(60, newSize));
        };
        
        setCellSize(calculateCellSize());
        
        const handleResize = () => {
            setCellSize(calculateCellSize());
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [gridDimensions]);

    useEffect(() => {
        const hasFeedback = grid?.some(row => 
            row.some(cell => cell.isCorrect || cell.isIncorrect)
        );
        
        if (hasFeedback) {
            setShowFeedback(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = setTimeout(() => {
                setShowFeedback(false);
            }, 3000);
        }
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [grid]);
    
    
    const minBoardWidth = grid && grid[0] ? grid[0].length * cellSize : 100;
    const minBoardHeight = grid ? grid.length * cellSize : 100;

    return (
        <Box 
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                ref={containerRef}
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${theme.palette.grey[900]}`,
                    width: '100%',
                    maxWidth: '500px',
                    minWidth: minBoardWidth,
                    minHeight: minBoardHeight,
                    maxHeight: '500px',
                    margin: 'auto',
                })}
            >
                {grid.map((row, rowIndex) => (
                    <Box 
                        key={rowIndex} 
                        sx={{
                            display: 'flex',
                            flex: 1,
                            width: '100%',
                        }}
                    >
                        {row.map((cell, colIndex) => (
                            <CrosswordCell 
                                key={`cell-${rowIndex}-${colIndex}`}
                                value={cell.value}
                                number={cell.number}
                                isActive={isActiveCell(rowIndex, colIndex)}
                                isCorrect={showFeedback && cell.isCorrect}
                                isIncorrect={showFeedback && cell.isIncorrect}
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