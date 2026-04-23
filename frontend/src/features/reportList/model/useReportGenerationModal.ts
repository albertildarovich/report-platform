import { useState } from 'react';
import { useReportTemplates } from './useReportTemplates';
import { useGenerateReport } from './useGenerateReport';
import { useSnackbar } from '../../../app/providers/SnackbarProvider';
import { useReportsContext } from './ReportsContext';
import type { Report } from '../../../shared/api/client/models/Report';
import { RunStatus } from '../../../shared/api/client/models/RunStatus';

export const useReportGenerationModal = () => {
  const [open, setOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { addReport } = useReportsContext();

  const { reports, loading, error } = useReportTemplates();
  const { generate, generatingId } = useGenerateReport((runId) => {
    showSnackbar(`Report generation started! Run ID: ${runId}`, 'success');
    handleClose();
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGenerate = async (reportId: string) => {
    const template = reports.find(r => r.id === reportId);
    const tempReport: Report = {
      id: `temp-${Date.now()}`,
      reportTemplateId: reportId,
      status: RunStatus.PENDING,
      startedAt: new Date().toISOString(),
      completedAt: null,
      error: null,
      resultUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addReport(tempReport);

    try {
      await generate(reportId);
    } catch (err) {
      console.error('Failed to generate report:', err);
      showSnackbar(
        `Failed to start generation: ${err instanceof Error ? err.message : 'Unknown error'}`,
        'error'
      );
    }
  };

  const snackbar = { open: false, message: '', severity: 'success' as const };
  const handleSnackbarClose = () => {};

  return {
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
  };
};