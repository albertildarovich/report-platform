import { ReportTemplatesService } from '../../../shared/api/client/services/ReportTemplatesService';
import { OpenAPI } from '../../../shared/api/client/core/OpenAPI';
import type { ReportTemplate } from '../../../shared/api/client/models/ReportTemplate';
import type { StartGenerationResponse } from '../../../shared/api/client/models/StartGenerationResponse';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

OpenAPI.BASE = API_BASE.replace(/\/api$/, '');

export const reportTemplateApi = {
  async getAll(): Promise<ReportTemplate[]> {
    return await ReportTemplatesService.getApiReportTemplates();
  },

  async getById(id: string): Promise<ReportTemplate> {
    return await ReportTemplatesService.getApiReportTemplates1(id);
  },

  async generate(id: string): Promise<StartGenerationResponse> {
    return await ReportTemplatesService.postApiReportTemplatesGenerate(id);
  },
};