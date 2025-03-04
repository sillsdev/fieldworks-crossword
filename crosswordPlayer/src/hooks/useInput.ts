import { useState, useEffect } from 'react';

const useInput = (initialGrid: string[][]) => {
  const [grid, setGrid] = useState(initialGrid);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const key = event.key;

    if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      // Only allow one letter at a time
      const newGrid = [...grid];
      newGrid[row][col] = key.toUpperCase();
      setGrid(newGrid);
    } else if (key === 'ArrowUp' && row > 0) {
      setSelectedCell({ row: row - 1, col });
    } else if (key === 'ArrowDown' && row < grid.length - 1) {
      setSelectedCell({ row: row + 1, col });
    } else if (key === 'ArrowLeft' && col > 0) {
      setSelectedCell({ row, col: col - 1 });
    } else if (key === 'ArrowRight' && col < grid[0].length - 1) {
      setSelectedCell({ row, col: col + 1 });
    }
  };

  const handleClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, grid]);

  return {
    grid,
    selectedCell,
    handleClick,
  };
};

export default useInput;