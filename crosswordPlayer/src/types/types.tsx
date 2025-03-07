export interface LanguageData {
    languageCode: {
        languageName: string;
        analysisLanguages: string[];
    };
    projectName: string;
    analysisLanguage?: string;
}

export interface LanguageSelectorProps {
    onCrosswordGenerated: (crosswordData: any) => void;
}

export interface CrosswordCellProps {
    value: string;
    number?: number;
    isActive?: boolean;
    isBlocked?: boolean;
    isCorrect?: boolean;
    isIncorrect?: boolean;
    onClick?: (event: React.MouseEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    width?: number;
    height?: number;
}

export interface CrosswordCluesProps {
    clues: {
      across: Array<{ number: number; clue: string }>;
      down: Array<{ number: number; clue: string }>;
    };
    onClueClick?: (type: 'across' | 'down', number: number) => void;
    activeClue?: { type: 'across' | 'down'; number: number } | null;
}

export interface UseClueInteractionProps {
    isActive: boolean;
    onClueClick?: (type: 'across' | 'down', number: number) => void;
    type: 'across' | 'down';
    number: number;
}

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

export interface CrosswordData {
    cols: number;
    rows: number;
    result: Array<{
        answer: string;
        clue: string;
        startx: number;
        starty: number;
        position: number;
        orientation: 'across' | 'down';
    }>;
}

export interface CrosswordBoardProps {
    grid: CellData[][];
    handleClick: (rowIndex: number, colIndex: number) => void;
    isActiveCell: (rowIndex: number, colIndex: number) => boolean;
    handleInput: (char: string) => void;
}