import { Box } from '@mui/material';
import CrosswordCell from './CrosswordCell';
import { useEffect, useState, useRef } from 'react';
import { CrosswordBoardProps } from '../../types/types';

const CrosswordBoard: React.FC<CrosswordBoardProps> = ({ grid, handleClick, isActiveCell, handleInput }) => {
    const [cellSize, setCellSize] = useState(40); 
    const containerRef = useRef<HTMLDivElement>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    },[isActiveCell]);

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
    }, [grid]);

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
                    width: '100%',
                    maxWidth: '500px',
                    minWidth: minBoardWidth,
                    minHeight: minBoardHeight,
                    maxHeight: '500px',
                    margin: 'auto',
                })}
            >
                {grid.map((row, rowIndex: number) => (
                    <Box 
                        key={rowIndex} 
                        sx={{
                            display: 'flex',
                            flex: 1,
                            width: '100%',
                        }}
                    >
                        {row.map((cell, colIndex: number) => (
                            <CrosswordCell 
                                key={`cell-${rowIndex}-${colIndex}`}
                                value={cell.value}
                                number={cell.number}
                                isActive={isActiveCell(rowIndex, colIndex)}
                                isCorrect={showFeedback && cell.isCorrect}
                                isIncorrect={showFeedback && cell.isIncorrect}
                                isBlocked={cell.isBlocked}
                                onClick={() => handleClick(rowIndex, colIndex)}
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