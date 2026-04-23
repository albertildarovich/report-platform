import React from 'react';
import { Card, CardContent, Typography, Box, Pagination } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface PaginationCardProps {
  /** Текущая страница (one-based) */
  page: number;
  /** Общее количество элементов */
  total: number;
  /** Количество элементов на странице */
  limit: number;
  /** Общее количество страниц */
  totalPages: number;
  /** Callback при изменении страницы */
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

/**
 * Компонент карточки пагинации.
 * Отображает сводку и элементы управления пагинацией.
 */
export const PaginationCard: React.FC<PaginationCardProps> = ({
  page,
  total,
  limit,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();

  if (total === 0) {
    return null;
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <Card sx={{ p: 2, minHeight: '80px', display: 'flex', alignItems: 'center' }}>
      <CardContent sx={{ p: 0, flex: 1, '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('app.paginationSummary', {
              from,
              to,
              total,
            })}
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </CardContent>
    </Card>
  );
};