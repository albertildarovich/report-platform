import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export interface LoadingStateProps {
  /** Опциональный текст для отображения под спиннером */
  message?: string;
}

/**
 * Компонент для отображения состояния загрузки.
 * Используется при первоначальной загрузке данных.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexDirection: 'column', alignItems: 'center' }}>
      <CircularProgress />
      {message && (
        <Box sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Box>
      )}
    </Box>
  );
};