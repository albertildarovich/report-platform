import { useState, useEffect, useCallback } from 'react';
import { reportApi } from '../api/reportApi';
import { Report } from '../../../shared/types';

export const useReport = (id?: string) => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (reportId: string) => {
    setLoading(true);
    try {
      const data = await reportApi.getById(reportId);
      setReport(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError('Failed to load report');
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