import { useState, useEffect, useCallback } from 'react';

// Примерная высота одной строки таблицы в пикселях (включая отступы, границы)
const DEFAULT_ROW_HEIGHT = 62;
// Высота заголовка таблицы и других элементов над таблицей (примерно)
const HEADER_HEIGHT = 80; // AppBar + дополнительные отступы
const FOOTER_HEIGHT = 64; // Footer с padding
const PAGINATION_HEIGHT = 84;
const TABLE_HEADER_HEIGHT = 150; // Заголовок таблицы + паддинги карточки + заголовок таблицы
const PADDINGS = 24 * 5; // Container padding + дополнительные отступы
// Минимальное количество строк, если расчет даст меньше
const MIN_ROWS = 1;
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
      const headerTotal = HEADER_HEIGHT + FOOTER_HEIGHT + PAGINATION_HEIGHT + TABLE_HEADER_HEIGHT + PADDINGS;
      availableHeight = window.innerHeight - headerTotal;
      
      console.log('useAutoLimit: window.innerHeight=', window.innerHeight,
                  'headerTotal=', headerTotal,
                  'availableHeight=', availableHeight);
    }

    // Вычисляем, сколько строк поместится
    const calculatedRows = Math.floor(availableHeight / DEFAULT_ROW_HEIGHT);
    // Ограничиваем минимальным и максимальным значением
    const clamped = Math.max(MIN_ROWS, Math.min(calculatedRows, MAX_ROWS));
    
    console.log('useAutoLimit: calculatedRows=', calculatedRows,
                'clamped=', clamped);
    
    setLimit(clamped);
  }, [tableContainerRef]);

  useEffect(() => {
    // Первоначальный расчет с задержкой, чтобы DOM успел отрендериться
    const timer = setTimeout(() => {
      calculateLimit();
    }, 100);

    // Слушаем изменение размера окна
    window.addEventListener('resize', calculateLimit);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLimit);
    };
  }, [calculateLimit]);

  return { limit, recalculate: calculateLimit };
};