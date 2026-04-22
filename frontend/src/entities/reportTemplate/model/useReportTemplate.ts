import { useState, useEffect, useCallback } from 'react';
import { reportTemplateApi } from '../api/reportTemplateApi';
import { ReportTemplate } from '../../../shared/types';

export const useReportTemplate = (id?: string) => {
  const [report, setReport] = useState<ReportTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (reportId: string) => {
    setLoading(true);
    try {
      const data = await reportTemplateApi.getById(reportId);
      setReport(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch report template:', err);
      setError('Failed to load report template');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id, fetchReport]);

  return { report, loading, error, refetch: fetchReport };
};