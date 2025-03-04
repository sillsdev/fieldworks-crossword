import { useState, KeyboardEvent, useCallback, useEffect } from 'react';
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
    handleCellClick: (rowIndex: number, colIndex: number) => void;
    handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
    isActiveCell: (rowIndex: number, colIndex: number) => boolean;
    words: Word[];
    onCheckClick: () => void;
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

    const [grid, setGrid] = useState<CellData[][]>(createEmptyGrid());
    const [activeCell, setActiveCell] = useState<ActiveCellPosition | null>(null);
    const [activeDirection, setActiveDirection] = useState<Direction>('across');
    const [words, setWords] = useState<Word[]>([]);
    const [activeWordId, setActiveWordId] = useState<string | null>(null);
    
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
                            value: answer[i], 
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
    }, [createEmptyGrid, width, height]);

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (grid[rowIndex][colIndex].isBlocked) return;
    
        if (activeCell?.row === rowIndex && activeCell?.col === colIndex) {
            setActiveDirection(prev => prev === 'across' ? 'down' : 'across');
        } else {
            setActiveCell({ row: rowIndex, col: colIndex });
        }
    };

    const onCheckClick = () => {
        const results = handleCheckClick();
        alert(`Results: ${results.correct} correct, ${results.incorrect} incorrect, ${results.incomplete} incomplete out of ${results.total} total words`);
    };

    const handleCheckClick = () => {
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
                const isCorrect = userWord.toUpperCase() === word.answer.toUpperCase();
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
    };

    // Will need to work on the moving later 
    const moveToNextCell = () => {
        if (!activeCell) return;
        
        const { row, col } = activeCell;
        if (activeDirection === 'across') {
          // Move right
          if (col < grid[0].length - 1) {
            const nextCol = col + 1;
            if (!grid[row][nextCol].isBlocked) {
              setActiveCell({ row, col: nextCol });
            }
          }
        } else {
          // Move down
          if (row < grid.length - 1) {
            const nextRow = row + 1;
            if (!grid[nextRow][col].isBlocked) {
              setActiveCell({ row: nextRow, col });
            }
          }
        }
    };

    const moveToPrevCell = () => {
        if (!activeCell) return;
        
        const { row, col } = activeCell;
        if (activeDirection === 'across') {
          // Move left
          if (col > 0) {
            const prevCol = col - 1;
            if (!grid[row][prevCol].isBlocked) {
              setActiveCell({ row, col: prevCol });
            }
          }
        } else {
          // Move up
          if (row > 0) {
            const prevRow = row - 1;
            if (!grid[prevRow][col].isBlocked) {
              setActiveCell({ row: prevRow, col });
            }
          }
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowRight') {
            console.log("RIGHT");
            moveToNextCell();
        } else if (event.key === 'ArrowLeft') {
            moveToPrevCell();
        }
    };

    const isActiveCell = (rowIndex: number, colIndex: number): boolean => {
        if (!activeCell) return false;
        if (activeCell.col === colIndex && activeCell.row === rowIndex) {
            return true;
        }
        return false;
    };

    return {
        grid,
        handleCellClick,
        handleKeyDown,
        isActiveCell, 
        words,
        onCheckClick
    };
};