import { Box, Typography, styled } from '@mui/material';
import { CrosswordCellProps } from '../../types/types';

const CellContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'isActive' && 
    prop !== 'isBlocked' && 
    prop !== 'isCorrect' && 
    prop !== 'isIncorrect' &&
    prop !== 'isPartOfActiveWord' && 
    prop !== 'width' &&
    prop !== 'height',
})<{
  isActive?: boolean;
  isBlocked?: boolean;
  isIncorrect?: boolean;
  isCorrect?: boolean;
  isPartOfActiveWord?: boolean;
  width?: number;
  height?: number;
}>(({ theme, isActive, isBlocked, isCorrect, isIncorrect, isPartOfActiveWord, width=40, height=40 }) => ({
  position: 'relative',
  width: `${width}px`,
  height: `${height}px`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: isBlocked
    ? `2px solid ${theme.palette.grey[900]}`
    : isCorrect
      ? `2px solid #2e7d32`
      : isIncorrect
        ? `2px solid #c62828`
        : isActive
          ? `2px solid ${theme.palette.primary.main}`
          : isPartOfActiveWord 
            ? `2px solid ${theme.palette.primary.light}`
            : `2px solid ${theme.palette.divider}`,
  backgroundColor: isCorrect
    ? '#c8e6c9'
    : isIncorrect
      ? '#ffcdd2'
      : isBlocked 
        ? theme.palette.grey[900]
        : isActive
          ? '#bbdefb'  // More prominent light blue background for active cells
          : isPartOfActiveWord
            ? '#f0f7ff'
            : theme.palette.background.paper,
  cursor: isBlocked ? 'default' : 'pointer',
  userSelect: 'none',
  '&:focus': {
    outline: isBlocked ? 'none' : `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
  },
}));

const CellNumber = styled(Typography)<{ isCorrect?: boolean; isIncorrect?: boolean }>(({ isCorrect, isIncorrect }) => ({
  position: 'absolute',
  top: 2,
  left: 2,
  fontSize: '0.7rem',
  fontWeight: 'bold',
  color: isCorrect ? '#2e7d32' : isIncorrect ? '#c62828' : 'inherit',
}));

const CellContent = styled(Typography)<{ 
  isCorrect?: boolean; 
  isIncorrect?: boolean;
  isActive?: boolean;
  isPartOfActiveWord?: boolean;
}>(({ isCorrect, isIncorrect, isActive, isPartOfActiveWord }) => ({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: isCorrect 
    ? '#004400'
    : isIncorrect 
      ? '#660000'
      : isActive
        ? 'darkblue'  // Dark blue for active cells
        : isPartOfActiveWord
          ? 'darkblue'
          : 'inherit',
}));

const CrosswordCell: React.FC<CrosswordCellProps> = ({
  value,
  number,
  isActive = false,
  isBlocked = false,
  isCorrect = false,
  isIncorrect = false,
  isPartOfActiveWord = false,
  onClick,
  onKeyDown,
  width=40,
  height=40,
}) => {
  return (
    <CellContainer
      isActive={isActive}
      isBlocked={isBlocked}
      isCorrect={isCorrect}
      isIncorrect={isIncorrect}
      isPartOfActiveWord={isPartOfActiveWord}
      width={width}
      height={height}
      onClick={isBlocked ? undefined : onClick}
      onKeyDown={isBlocked ? undefined : onKeyDown}
      tabIndex={isBlocked ? -1 : 0}
      aria-label={`${number ? `Cell ${number}, ` : ''}${value ? `Letter ${value}` : 'Empty cell'}`}
    >
      {number && <CellNumber variant="caption" isCorrect={isCorrect} isIncorrect={isIncorrect}>{number}</CellNumber>}
      <CellContent 
        variant="body1" 
        isCorrect={isCorrect} 
        isIncorrect={isIncorrect}
        isActive={isActive}
        isPartOfActiveWord={isPartOfActiveWord}
      >
        {!isBlocked ? value : ''}
      </CellContent>
    </CellContainer>
  );
};

export default CrosswordCell;
