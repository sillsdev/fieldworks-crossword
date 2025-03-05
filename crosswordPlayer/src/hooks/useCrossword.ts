import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import testData from '../test.json';

export interface CellData {
    value: string;
    number?: number;
    isBlocked: boolean;
    isCorrect?: boolean;
    isIncorrect?: boolean;
    wordId?: string[];
}

export interface ActiveCellPosition {
    row: number;
    col: number;
}

export type Direction = 'across' | 'down';

interface UseCrosswordReturn {
    grid: CellData[][];
    isActiveCell: (rowIndex: number, colIndex: number) => boolean;
    words: Word[];
    handleCheckClick: () => { correct: number; incorrect: number; incomplete: number; total: number };
    handleClueClick: (type: 'across' | 'down', number: number) => void;
    activeClue: { type: 'across' | 'down'; number: number } | null;
    handleKeyDown: (event: KeyboardEvent) => void;
    handleClick: (row: number, col: number) => void;
}

export interface Word {
    id: string;
    answer: string;
    clue: string;
    position: number;
    orientation: Direction;
    startRow: number;
    startCol: number;
    cells: { row: number, col: number}[];
}

export function useCrossword(): UseCrosswordReturn {
    const calcDimensions = () => {
        let maxX = 0;
        let maxY = 0;

        testData.forEach(clue => {
            const answerLength = clue.answer.length;
      
            if (clue.orientation === 'across') {
              const endX = clue.startx + answerLength - 1;
              maxX = Math.max(maxX, endX);
              maxY = Math.max(maxY, clue.starty);
            } else {
              const endY = clue.starty + answerLength - 1;
              maxX = Math.max(maxX, clue.startx);
              maxY = Math.max(maxY, endY);
            }
          });

        return { width: maxX, height: maxY };
    };

    const { width, height } = calcDimensions();

    const createEmptyGrid = useCallback((): CellData[][] => {
        const emptyGrid: CellData[][] = [];
        for (let i = 0; i < height; i++) {
            const row: CellData[] = [];
            for (let j = 0; j < width; j++) {
                row.push({ value: '', isBlocked: true });
            }
            emptyGrid.push(row);
        }
        return emptyGrid;
    }, [height, width]);

    const [grid, setGrid] = useState<CellData[][]>([]);
    const gridRef = useRef(grid);
    const [activeCell, setActiveCell] = useState<ActiveCellPosition | null>(null);
    const [activeDirection, setActiveDirection] = useState<Direction>('across');
    const [words, setWords] = useState<Word[]>([]);
    const [activeClue, setActiveClue] = useState<{ type: 'across' | 'down'; number: number } | null>(null);
    
    const cluePositions = useMemo(() => {
        const positions: Record<string, { row: number; col: number }> = {};
        
        testData.forEach(clue => {
          const row = clue.starty - 1;
          const col = clue.startx - 1;
          
          positions[`${clue.orientation}-${clue.position}`] = { row, col };
        });
        
        return positions;
    }, []);
    
    useEffect(() => {
        const newGrid = createEmptyGrid();
        const wordsList: Word[] = [];

        testData.forEach(wordData => {
            const { answer, startx, starty, position, orientation, clue } = wordData;

            const x = startx - 1;
            const y = starty - 1;
            const wordId = `${orientation} - ${position}`;

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
                    if (x + i < width && y < height) {
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
                            value: '', 
                            isBlocked: false,
                            number: i === 0 ? position : newGrid[cellRow][cellCol].number
                        };
                    }
                } else { // down
                    if (x < width && y + i < height) {
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
                            value: '', 
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
        console.log("from useeffect", newGrid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log("second useeffect", grid[0]);
        gridRef.current = grid;
    }, [grid]);

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
        console.log("newGrid", newGrid);
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
            console.log(newGrid);
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
        handleClick
    };
}