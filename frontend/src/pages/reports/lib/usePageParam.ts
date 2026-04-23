import { useSearchParams } from 'react-router-dom';

/**
 * Хук для работы с параметром страницы в URL.
 * Предоставляет текущую страницу и функцию для её обновления.
 */
export const usePageParam = (defaultPage = 1) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : defaultPage;

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  return { page, setPage };
};