import { Box, Typography, styled } from '@mui/material';

interface CrosswordCellProps {
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

const CellContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'isActive' && 
    prop !== 'isBlocked' && 
    prop !== 'isCorrect' && 
    prop !== 'isIncorrect' &&
    prop !== 'width' &&
    prop !== 'height',
})<{
  isActive?: boolean;
  isBlocked?: boolean;
  isIncorrect?: boolean;
  isCorrect?: boolean;
  width?: number;
  height?: number;
}>(({ theme, isActive, isBlocked, isCorrect, isIncorrect, width=40, height=40 }) => ({
  position: 'relative',
  width: `${width}px`,
  height: `${height}px`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: isCorrect
    ? `2px solid ${theme.palette.success.main}`
    : isIncorrect
      ? `2px solid ${theme.palette.error.main}`
      : isActive
        ? `1px solid ${theme.palette.primary.main}`
        : `1px solid ${theme.palette.divider}`,
  backgroundColor: isBlocked 
    ? theme.palette.grey[900]
    : theme.palette.background.paper,
  cursor: isBlocked ? 'default' : 'pointer',
  userSelect: 'none',
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
  },
}));

const CellNumber = styled(Typography)({
  position: 'absolute',
  top: 2,
  left: 2,
  fontSize: '0.7rem',
  fontWeight: 'bold',
});

const CellContent = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

const CrosswordCell: React.FC<CrosswordCellProps> = ({
  value,
  number,
  isActive = false,
  isBlocked = false,
  isCorrect = false,
  isIncorrect = false,
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
      width={width}
      height={height}
      onClick={isBlocked ? undefined : onClick}
      tabIndex={isBlocked ? -1 : 0}
      aria-label={`${number ? `Cell ${number}, ` : ''}${value ? `Letter ${value}` : 'Empty cell'}`}
    >
      {number && <CellNumber variant="caption">{number}</CellNumber>}
      <CellContent variant="body1">{!isBlocked ? value : ''}</CellContent>
    </CellContainer>
  );
};

export default CrosswordCell;