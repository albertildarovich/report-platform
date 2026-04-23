import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

export interface ErrorStateProps {
  /** Текст ошибки для отображения */
  error: string;
  /** Заголовок ошибки (опционально) */
  title?: string;
  /** Callback для повторной попытки (опционально) */
  onRetry?: () => void;
}

/**
 * Компонент для отображения состояния ошибки.
 * Показывает сообщение об ошибке и, при наличии, кнопку повтора.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ error, title, onRetry }) => {
  return (
    <Alert 
      severity="error" 
      sx={{ m: 2 }}
      action={
        onRetry && (
          <button 
            onClick={onRetry}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#d32f2f', 
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.875rem'
            }}
          >
            Повторить
          </button>
        )
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {error}
    </Alert>
  );
};