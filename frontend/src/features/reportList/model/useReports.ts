import { useState, useEffect, useCallback } from 'react';
import { reportApi, PaginatedReports } from '../../../entities/report';
import { Report } from '../../../shared/types';

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
    try {
      setLoading(true);
      const data: PaginatedReports = await reportApi.getAll(page, limit);
      setReports(data.reports);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
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
    if (newLimit === limit) return; // не меняем, если лимит тот же
    setLimit(newLimit);
    setPage(1); // reset to first page when limit changes
  }, [limit]);

  return {
    reports,
    loading,
    error,
    pagination: { page, limit, total, totalPages },
    goToPage,
    changeLimit,
    refetch: () => fetchReports(page, limit),
  };
};