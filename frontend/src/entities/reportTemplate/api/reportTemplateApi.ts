import axios from 'axios';
import { ReportTemplate } from '../../../shared/types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const reportTemplateApi = {
  async getAll(): Promise<ReportTemplate[]> {
    const response = await axios.get(`${API_BASE}/report-templates`);
    return response.data;
  },

  async getById(id: string): Promise<ReportTemplate> {
    const response = await axios.get(`${API_BASE}/report-templates/${id}`);
    return response.data;
  },

  async generate(id: string): Promise<{ runId: string }> {
    const response = await axios.post(`${API_BASE}/report-templates/${id}/generate`);
    return response.data;
  },
};