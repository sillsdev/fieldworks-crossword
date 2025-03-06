import { useState, useCallback, useEffect, useMemo } from 'react';
import { CrosswordData, CellData, ActiveCellPosition, Direction, Word } from '../types/types';

export const useCrossword = (crosswordData: CrosswordData | null = null) => {
    const [formattedClues, setFormattedClues] = useState<{
        across: Array<{ number: number; clue: string }>;
        down: Array<{ number: number; clue: string }>;
      }>({ across: [], down: [] });
    const [grid, setGrid] = useState<CellData[][]>([]);
    const [activeCell, setActiveCell] = useState<ActiveCellPosition | null>(null);
    const [activeDirection, setActiveDirection] = useState<Direction>('across');
    const [words, setWords] = useState<Word[]>([]);
    const [activeClue, setActiveClue] = useState<{ type: 'across' | 'down'; number: number } | null>(null);

    const cluePositions = useMemo(() => {
        const positions: Record<string, { row: number; col: number }> = {};
        
        if (crosswordData?.result) {
            crosswordData.result.forEach(clue => {
                const row = clue.starty - 1;
                const col = clue.startx - 1;
                
                positions[`${clue.orientation}-${clue.position}`] = { row, col };
            });
        }
        
        return positions;
    }, [crosswordData]);
    
    useEffect(() => {
        if (crosswordData) {
            const acrossClues: Array<{ number: number; clue: string }> = [];
            const downClues: Array<{ number: number; clue: string }> = [];

            const newGrid: CellData[][] = [];
            const wordsList: Word[] = [];

            for (let i = 0; i < crosswordData.rows; i++) {
                const row: CellData[] = [];
                for (let j = 0; j < crosswordData.cols; j++) {
                    row.push({ value: '', isBlocked: true });
                }
                newGrid.push(row);
            }

            crosswordData.result.forEach(wordData => {
                console.log(wordData);
                const { answer, startx, starty, position, orientation, clue } = wordData;
                const clueObject = { number: position, clue };

                if (orientation === 'across') {
                    acrossClues.push(clueObject);
                } else if (orientation === 'down') {
                    downClues.push(clueObject);
                }
            
                // Sort arrays by clue number
                acrossClues.sort((a, b) => a.number - b.number);
                downClues.sort((a, b) => a.number - b.number);
                
                setFormattedClues({ across: acrossClues, down: downClues });

                const x = startx - 1;
                const y = starty - 1;
                const wordId = `${orientation}-${position}`;

                const word: Word = {
                    id: wordId,
                    answer: answer.toUpperCase(),
                    clue, 
                    position,
                    orientation: orientation as Direction,
                    startRow: y,
                    startCol: x,
                    cells: []
                };

                for (let i = 0; i < answer.length; i++) {
                    if (orientation === 'across') {
                        if (x + i < crosswordData.cols && y < crosswordData.rows) {
                            const cellRow = y;
                            const cellCol = x + i;
                            
                            // Add this cell to word's cells
                            word.cells.push({ row: cellRow, col: cellCol });
                            
                            // Update the grid cell
                            if (!newGrid[cellRow][cellCol].wordId) {
                                newGrid[cellRow][cellCol].wordId = [];
                            }
                            newGrid[cellRow][cellCol].wordId?.push(wordId);
                            newGrid[cellRow][cellCol] = {
                                ...newGrid[cellRow][cellCol],
                                value: answer[i], 
                                isBlocked: false,
                                number: i === 0 ? position : newGrid[cellRow][cellCol].number
                            };
                        }
                    } else { // down
                        if (x < crosswordData.cols && y + i < crosswordData.rows) {
                            const cellRow = y + i;
                            const cellCol = x;
                            
                            // Add this cell to word's cells
                            word.cells.push({ row: cellRow, col: cellCol });
                            
                            // Update the grid cell
                            if (!newGrid[cellRow][cellCol].wordId) {
                                newGrid[cellRow][cellCol].wordId = [];
                            }
                            newGrid[cellRow][cellCol].wordId?.push(wordId);
                            newGrid[cellRow][cellCol] = {
                                ...newGrid[cellRow][cellCol],
                                value: answer[i], 
                                isBlocked: false,
                                number: i === 0 ? position : newGrid[cellRow][cellCol].number
                            };
                        }
                    }
                }
                wordsList.push(word);
            })
            setWords(wordsList);
            setGrid(newGrid);
        }
    }, [crosswordData]);

    const handleClueClick = useCallback((type: 'across' | 'down', number: number) => {
        setActiveClue({ type, number });
        
        setActiveDirection(type);
        
        const key = `${type}-${number}`;
        const position = cluePositions[key];
        
        if (position) {
          setActiveCell(position);
        }
    }, [cluePositions]);

    const handleCheckClick = useCallback(() => {
        const newGrid = [...grid];
        const result = {
            correct: 0,
            incorrect: 0,
            incomplete: 0,
            total: words.length
        };

        words.forEach(word => {
            let userWord = '';
            let isComplete = true;

            word.cells.forEach(({ row, col }) => {
                if (row < grid.length && col < grid[0].length) {
                    const cellVal = grid[row][col].value;
                    if (!cellVal) {
                        isComplete = false;
                    }
                    userWord += cellVal;
                }
            });

            if (isComplete) {
                const isCorrect = userWord.toUpperCase() === word.answer;
                if (isCorrect) {
                    result.correct++;

                    word.cells.forEach(({ row, col }) => {
                        newGrid[row][col] = {
                            ...newGrid[row][col],
                            isCorrect: true,
                            isIncorrect: false
                        };
                    });
                } else {
                    result.incorrect++;
                    
                    word.cells.forEach(({ row, col }) => {
                        newGrid[row][col] = {
                            ...newGrid[row][col],
                            isCorrect: false,
                            isIncorrect: true
                        };
                    });
                }
            } else {
                result.incomplete++;
            }
        });
        setGrid(newGrid);
        return result;
    }, [grid]);

    const isActiveCell = (rowIndex: number, colIndex: number): boolean => {
        if (!activeCell) return false;
        if (activeCell.col === colIndex && activeCell.row === rowIndex) {
            return true;
        }
        return false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!activeCell) return;

        const { row, col } = activeCell;
        const key = event.key;

        if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
            // Only allow one letter at a time
            const newGrid = [...grid];
            newGrid[row][col].value = key.toUpperCase();
            setGrid(newGrid);
        } else if (key === 'ArrowUp' && row > 0) {
            setActiveCell({ row: row - 1, col });
        } else if (key === 'ArrowDown' && row < grid.length - 1) {
            setActiveCell({ row: row + 1, col });
        } else if (key === 'ArrowLeft' && col > 0) {
            setActiveCell({ row, col: col - 1 });
        } else if (key === 'ArrowRight' && col < grid[0].length - 1) {
            setActiveCell({ row, col: col + 1 });
        }
    };

    const handleClick = (row: number, col: number) => {
        setActiveCell({ row, col });
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

    return {
        grid,
        isActiveCell, 
        words,
        handleCheckClick,
        handleClueClick,
        activeClue,
        handleKeyDown,
        handleClick,
        formattedClues
    };
}