import { useCallback } from 'react';
import { Theme } from '@mui/material/styles';

interface UseClueInteractionProps {
  isActive: boolean;
  onClueClick?: (type: 'across' | 'down', number: number) => void;
  type: 'across' | 'down';
  number: number;
}

const useClueInteraction = ({ isActive, onClueClick, type, number }: UseClueInteractionProps) => {
  const handleClick = useCallback(() => {
    onClueClick?.(type, number);
  }, [onClueClick, type, number]);

  const getStyles = useCallback(
    (theme: Theme) => ({
      padding: theme.spacing(0.5, 1),
      cursor: 'pointer',
      backgroundColor: isActive ? theme.palette.primary.light : 'transparent',
      '&:hover': {
        backgroundColor: isActive ? theme.palette.primary.light : theme.palette.action.hover,
      },
      borderRadius: theme.shape.borderRadius,
    }),
    [isActive]
  );

  return { handleClick, getStyles };
};

export default useClueInteraction;