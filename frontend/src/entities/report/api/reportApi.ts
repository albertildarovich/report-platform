import { ReportsService } from '../../../shared/api/client/services/ReportsService';
import { OpenAPI } from '../../../shared/api/client/core/OpenAPI';
import type { PaginatedReportsResponse } from '../../../shared/api/client/models/PaginatedReportsResponse';
import type { Report } from '../../../shared/api/client/models/Report';
import type { ReportTemplate } from '../../../shared/api/client/models/ReportTemplate';
import { RunStatus } from '../../../shared/api/client/models/RunStatus';
import { ReportFormat } from '../../../shared/api/client/models/ReportFormat';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_HOST = API_BASE.replace(/\/api$/, '');

OpenAPI.BASE = API_BASE.replace(/\/api$/, '');

export type PaginatedReports = PaginatedReportsResponse;
export { RunStatus, ReportFormat };

export const reportApi = {
  async getAll(page = 1, limit = 10): Promise<PaginatedReportsResponse> {
    return await ReportsService.getApiReports(page, limit);
  },

  async getById(id: string): Promise<Report> {
    return await ReportsService.getApiReportsStatus(id);
  },

  async getStatus(id: string): Promise<Report> {
    return await ReportsService.getApiReportsStatus(id);
  },

  getDownloadUrl(id?: string): string {
    if (!id) {
      return `${API_BASE}/reports`;
    }
    return `${API_BASE}/reports/${id}/download`;
  },

  resolveDownloadUrl(resultUrl: string, id?: string): string {
    if (!resultUrl) {
      return this.getDownloadUrl(id);
    }
    if (resultUrl.startsWith('http://') || resultUrl.startsWith('https://')) {
      return resultUrl;
    }
    return `${API_HOST}${resultUrl}`;
  },
};