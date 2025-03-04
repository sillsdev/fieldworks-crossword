import { useState, KeyboardEvent, useCallback } from 'react';

export interface CellData {
    value: string;
    number?: number;
    isBlocked: boolean;
    isRevealed?: boolean;
    isInput?: boolean;
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
}

export interface Word {
    id: string;
    answer: string;
    clue: string;
    position: number;
    orientaion: Direction;
    startRow: number;
    startCol: number;
    cells: { row: number, col: number}[];
}

export function useCrossword(): UseCrosswordReturn {
    const width = 15;
    const height = 15;

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
    // const [answerKey, setAnswerKey] = useState<Map<string, string>>(new Map());
    // const [words, setWords] = useState<Word[]>([]);
    // const [activeWordId, setActiveWordId] = useState<string | null>(null);
    
    const words: Word[] = [];

    const handleCellClick = (rowIndex: number, colIndex: number) => {
        if (grid[rowIndex][colIndex].isBlocked) return;
    
        if (activeCell?.row === rowIndex && activeCell?.col === colIndex) {
            setActiveDirection(prev => prev === 'across' ? 'down' : 'across');
        } else {
            setActiveCell({ row: rowIndex, col: colIndex });
        }
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
        words
    };
};