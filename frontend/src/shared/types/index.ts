export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  format: 'PDF' | 'XLSX';
  type?: string;
  createdAt: string;
  updatedAt: string;
  reports: Report[];
}

export interface Report {
  id: string;
  reportTemplateId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  resultUrl?: string;
  createdAt: string;
  updatedAt: string;
  reportTemplate?: ReportTemplate;
}