import { renderHook, act } from '@testing-library/react';
import { useAutoLimit } from '../useAutoLimit';

describe('useAutoLimit', () => {
  const originalInnerHeight = window.innerHeight;
  const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');

  beforeAll(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 800,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      writable: true,
      value: 600,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: originalInnerHeight,
    });
    if (originalClientHeight) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
    }
  });

  test('calculates limit based on window height when no ref provided', () => {
    // window.innerHeight = 800, TABLE_HEADER_HEIGHT = 200 => availableHeight = 600
    // DEFAULT_ROW_HEIGHT = 60 => calculatedRows = 10, clamped between MIN_ROWS=5 and MAX_ROWS=50 => 10
    const { result } = renderHook(() => useAutoLimit());
    expect(result.current.limit).toBe(10);
  });

  test('calculates limit based on container ref when provided', () => {
    const mockRef = {
      current: {
        clientHeight: 300,
      },
    } as React.RefObject<HTMLElement>;
    // clientHeight = 300, DEFAULT_ROW_HEIGHT = 60 => calculatedRows = 5
    const { result } = renderHook(() => useAutoLimit(mockRef));
    expect(result.current.limit).toBe(5);
  });

  test('respects MIN_ROWS and MAX_ROWS', () => {
    // Very small container
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      writable: true,
      value: 100,
    });
    const mockRef = {
      current: {
        clientHeight: 100,
      },
    } as React.RefObject<HTMLElement>;
    const { result } = renderHook(() => useAutoLimit(mockRef));
    // 100 / 60 = 1.66 -> floor = 1, but MIN_ROWS = 5 => limit = 5
    expect(result.current.limit).toBe(5);

    // Very large container
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      writable: true,
      value: 5000,
    });
    const mockRef2 = {
      current: {
        clientHeight: 5000,
      },
    } as React.RefObject<HTMLElement>;
    const { result: result2 } = renderHook(() => useAutoLimit(mockRef2));
    // 5000 / 60 = 83.33 -> floor = 83, but MAX_ROWS = 50 => limit = 50
    expect(result2.current.limit).toBe(50);
  });

  test('recalculates on window resize', () => {
    const { result } = renderHook(() => useAutoLimit());
    expect(result.current.limit).toBe(10);

    act(() => {
      window.innerHeight = 1200;
      window.dispatchEvent(new Event('resize'));
    });

    // availableHeight = 1200 - 200 = 1000, rows = 16 (floor 1000/60)
    expect(result.current.limit).toBe(16);
  });

  test('recalculate function triggers update', () => {
    const mockRef = {
      current: {
        clientHeight: 300,
      },
    } as React.RefObject<HTMLElement>;
    const { result } = renderHook(() => useAutoLimit(mockRef));
    expect(result.current.limit).toBe(5);

    act(() => {
      // Change clientHeight
      Object.defineProperty(mockRef.current, 'clientHeight', {
        value: 600,
      });
      result.current.recalculate();
    });

    expect(result.current.limit).toBe(10);
  });
});