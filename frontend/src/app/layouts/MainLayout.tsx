import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { Header } from '../../widgets/Header';
import { Footer } from '../../widgets/Footer';
import { ReportTemplateSelectModal, useReportGeneration } from '../../features/reportList';

export const MainLayout: React.FC = () => {
  const {
    open,
    handleOpen,
    handleClose,
    reports,
    loading,
    error,
    generatingId,
    handleGenerate,
    snackbar,
    handleSnackbarClose,
  } = useReportGeneration();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header onNewReportClick={handleOpen} />
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
      <Footer />

      <ReportTemplateSelectModal
        open={open}
        onClose={handleClose}
        reports={reports}
        loading={loading}
        error={error}
        generatingId={generatingId}
        onGenerate={handleGenerate}
      />
    </Box>
  );
};