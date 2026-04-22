import React, { useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { useReports, ReportListTable } from '../../features/reportList';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Получаем page и limit из URL
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
  const initialLimit = limitParam ? parseInt(limitParam, 10) : 10;

  const {
    reports,
    loading,
    error,
    pagination,
    goToPage,
    changeLimit,
    refetch,
  } = useReports({ page: initialPage, limit: initialLimit, pollInterval: 5000 });

  // Функция обновления URL
  const updateURL = useCallback((newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // При изменении page или limit в хуке обновляем URL
  useEffect(() => {
    updateURL(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, updateURL]);

  const handlePageChange = (event: unknown, newPage: number) => {
    goToPage(newPage + 1); // MUI zero-based -> our one-based
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    changeLimit(newLimit);
  };

  if (loading && reports.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t('app.reports')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('app.reportsDescription', 'List of all generated reports, updated automatically.')}
          </Typography>
        </CardContent>
      </Card>

      <ReportListTable reports={reports} />

      {reports.length > 0 && (
        <Card sx={{ mt: 3, p: 2 }}>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1} // MUI использует zero-based index
            rowsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage={t('app.rowsPerPage')}
            labelDisplayedRows={({ from, to, count }) =>
              t('app.paginationSummary', { from, to, total: count })
            }
          />
        </Card>
      )}
    </Box>
  );
};

export default ReportsPage;