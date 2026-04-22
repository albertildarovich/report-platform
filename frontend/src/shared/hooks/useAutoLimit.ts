import { useState, useEffect, useCallback } from 'react';

// Примерная высота одной строки таблицы в пикселях (включая отступы, границы)
const DEFAULT_ROW_HEIGHT = 60;
// Высота заголовка таблицы и других элементов над таблицей (примерно)
const TABLE_HEADER_HEIGHT = 200;
// Минимальное количество строк, если расчет даст меньше
const MIN_ROWS = 5;
// Максимальное количество строк, чтобы не перегружать
const MAX_ROWS = 50;

/**
 * Хук для расчета оптимального количества строк таблицы, которые помещаются на экране
 * @param tableContainerRef - опциональный ref контейнера таблицы. Если не передан, используется высота окна.
 * @returns рассчитанный лимит (число) и функция для принудительного пересчета
 */
export const useAutoLimit = (tableContainerRef?: React.RefObject<HTMLElement>) => {
  const [limit, setLimit] = useState(MIN_ROWS);

  const calculateLimit = useCallback(() => {
    let availableHeight: number;

    if (tableContainerRef?.current) {
      // Если передан ref контейнера, используем его высоту
      availableHeight = tableContainerRef.current.clientHeight;
    } else {
      // Иначе используем высоту окна за вычетом примерной высоты заголовков и футера
      availableHeight = window.innerHeight - TABLE_HEADER_HEIGHT;
    }

    // Вычисляем, сколько строк поместится
    const calculatedRows = Math.floor(availableHeight / DEFAULT_ROW_HEIGHT);
    // Ограничиваем минимальным и максимальным значением
    const clamped = Math.max(MIN_ROWS, Math.min(calculatedRows, MAX_ROWS));
    setLimit(clamped);
  }, [tableContainerRef]);

  useEffect(() => {
    // Первоначальный расчет
    calculateLimit();

    // Слушаем изменение размера окна
    window.addEventListener('resize', calculateLimit);
    return () => window.removeEventListener('resize', calculateLimit);
  }, [calculateLimit]);

  return { limit, recalculate: calculateLimit };
};