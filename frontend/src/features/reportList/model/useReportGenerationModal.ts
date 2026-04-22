import { useState } from 'react';
import { useReportTemplates } from './useReportTemplates';
import { useGenerateReport } from './useGenerateReport';

export const useReportGenerationModal = () => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { reports, loading, error } = useReportTemplates();
  const { generate, generatingId } = useGenerateReport((runId) => {
    setSnackbar({
      open: true,
      message: `Report generation started! Run ID: ${runId}`,
      severity: 'success',
    });
    handleClose();
    // Optionally refresh the page after a delay to show new run
    setTimeout(() => window.location.reload(), 2000);
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGenerate = async (reportId: string) => {
    try {
      await generate(reportId);
    } catch (err) {
      console.error('Failed to generate report:', err);
      setSnackbar({
        open: true,
        message: `Failed to start generation: ${err instanceof Error ? err.message : 'Unknown error'}`,
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    // modal state
    open,
    handleOpen,
    handleClose,
    // template data
    reports,
    loading,
    error,
    // generation
    generatingId,
    handleGenerate,
    // snackbar
    snackbar,
    handleSnackbarClose,
  };
};