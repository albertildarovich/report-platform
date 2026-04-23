import React from 'react';
import { Box } from '@mui/material';
import { ReportListTable } from '../../features/reportList';
import { useReportsPage } from './model';
import { LoadingState, ErrorState, PaginationCard } from './ui';

const ReportsPage: React.FC = () => {
  const {
    reports,
    loading,
    error,
    pagination,
    handlePaginationChange,
    refetch,
  } = useReportsPage();

  if (loading && reports.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 164px)' }}>
      <Box sx={{ flex: 1 }}>
        <ReportListTable reports={reports} />
      </Box>
      
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <PaginationCard
          page={pagination.page}
          total={pagination.total}
          limit={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={handlePaginationChange}
        />
      </Box>
    </Box>
  );
};

export default ReportsPage;