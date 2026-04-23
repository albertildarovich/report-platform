import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReports } from '../../../features/reportList';
import { useAutoLimit } from '../../../shared/hooks/useAutoLimit';

export interface UseReportsPageReturn {
  reports: any[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  handlePaginationChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  refetch: () => void;
}

export const useReportsPage = (): UseReportsPageReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { limit: autoLimit } = useAutoLimit();

  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

  const {
    reports,
    loading,
    error,
    pagination,
    goToPage,
    changeLimit,
    refetch,
  } = useReports({ page: initialPage, limit: autoLimit, pollInterval: 5000 });

  const updateURL = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    updateURL(pagination.page);
  }, [pagination.page, updateURL]);

  const prevAutoLimitRef = useRef(autoLimit);
  useEffect(() => {
    console.log('useReportsPage: autoLimit changed from', prevAutoLimitRef.current, 'to', autoLimit);
    if (prevAutoLimitRef.current !== autoLimit) {
      console.log('useReportsPage: calling changeLimit with', autoLimit);
      changeLimit(autoLimit);
      prevAutoLimitRef.current = autoLimit;
    }
  }, [autoLimit, changeLimit]);

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, page: number) => {
    goToPage(page);
  };

  return {
    reports,
    loading,
    error,
    pagination,
    handlePaginationChange,
    refetch,
  };
};