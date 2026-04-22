import { useState, useEffect, useCallback } from 'react';
import { reportTemplateApi } from '../../../entities/reportTemplate';
import { ReportTemplate } from '../../../shared/types';

export const useReportTemplates = () => {
  const [reports, setReports] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportTemplateApi.getAll();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch report templates:', err);
      setError('Failed to load report templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports };
};