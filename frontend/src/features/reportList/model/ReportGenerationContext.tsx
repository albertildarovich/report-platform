import React, { createContext, useContext, ReactNode } from 'react';
import { useReportGenerationModal } from './useReportGenerationModal';
import type { ReportTemplate } from '../../../shared/api/client/models/ReportTemplate';

interface ReportGenerationContextValue {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  reports: ReportTemplate[];
  loading: boolean;
  error: string | null;
  generatingId: string | null;
  handleGenerate: (reportId: string) => Promise<void>;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  };
  handleSnackbarClose: () => void;
}

const ReportGenerationContext = createContext<ReportGenerationContextValue | undefined>(undefined);

interface ReportGenerationProviderProps {
  children: ReactNode;
}

export const ReportGenerationProvider: React.FC<ReportGenerationProviderProps> = ({ children }) => {
  const modal = useReportGenerationModal();

  return (
    <ReportGenerationContext.Provider value={modal}>
      {children}
    </ReportGenerationContext.Provider>
  );
};

export const useReportGeneration = (): ReportGenerationContextValue => {
  const context = useContext(ReportGenerationContext);
  if (context === undefined) {
    throw new Error('useReportGeneration must be used within a ReportGenerationProvider');
  }
  return context;
};