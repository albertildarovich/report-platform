import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Report } from '../../../shared/api/client/models/Report';

interface ReportsContextValue {
  addReport: (report: Report) => void;
  registerAddReport: (fn: (report: Report) => void) => void;
}

const ReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReportsContext must be used within ReportsProvider');
  }
  return context;
};

interface ReportsProviderProps {
  children: React.ReactNode;
}

export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  const [addReportFn, setAddReportFn] = useState<((report: Report) => void) | null>(null);

  const addReport = useCallback((report: Report) => {
    if (addReportFn) {
      addReportFn(report);
    }
  }, [addReportFn]);

  const registerAddReport = useCallback((fn: (report: Report) => void) => {
    setAddReportFn(() => fn);
  }, []);

  const value: ReportsContextValue = {
    addReport,
    registerAddReport,
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};