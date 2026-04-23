import { useState, useEffect, useCallback } from 'react';
import { reportApi, PaginatedReports } from '../../../entities/report';
import type { Report } from '../../../shared/api/client/models/Report';
import { useReportsContext } from './ReportsContext';

interface UseReportsOptions {
  page?: number;
  limit?: number;
  pollInterval?: number;
}

export const useReports = (options: UseReportsOptions = {}) => {
  const { page: initialPage = 1, limit: initialLimit = 10, pollInterval } = options;
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReports = useCallback(async (page: number, limit: number) => {
    console.log('useReports: fetchReports called with page=', page, 'limit=', limit);
    try {
      setLoading(true);
      const data: PaginatedReports = await reportApi.getAll(page, limit);
      console.log('useReports: received data with', data.reports?.length || 0, 'reports');
      setReports((data.reports || []) as Report[]);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(page, limit);
  }, [fetchReports, page, limit]);

  useEffect(() => {
    if (!pollInterval) return;
    const interval = setInterval(() => fetchReports(page, limit), pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval, fetchReports, page, limit]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const changeLimit = useCallback((newLimit: number) => {
    console.log('useReports: changeLimit called with', newLimit, 'current limit is', limit);
    if (newLimit === limit) {
      console.log('useReports: limit unchanged, skipping');
      return;
    }
    console.log('useReports: setting limit to', newLimit, 'and resetting page to 1');
    setLimit(newLimit);
    setPage(1);
  }, [limit]);

  const addReport = useCallback((newReport: any) => {
    console.log('useReports: optimistically adding new report', newReport);
    setReports(prev => [newReport, ...prev]);
    setTotal(prev => prev + 1);
    setTotalPages(prev => Math.ceil((total + 1) / limit));
  }, [total, limit]);

  const { registerAddReport } = useReportsContext();
  useEffect(() => {
    registerAddReport(addReport);
    return () => {
      registerAddReport(() => {});
    };
  }, [registerAddReport, addReport]);

  return {
    reports,
    loading,
    error,
    pagination: { page, limit, total, totalPages },
    goToPage,
    changeLimit,
    addReport,
    refetch: () => fetchReports(page, limit),
  };
};