import axios from 'axios';
import { Report } from '../../../shared/types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface PaginatedReports {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const reportApi = {
  async getAll(page = 1, limit = 10): Promise<PaginatedReports> {
    const response = await axios.get(`${API_BASE}/reports`, {
      params: { page, limit },
    });
    return response.data;
  },

  async getById(id: string): Promise<Report> {
    const response = await axios.get(`${API_BASE}/reports/${id}`);
    return response.data;
  },

  async getStatus(id: string): Promise<Report> {
    const response = await axios.get(`${API_BASE}/reports/${id}/status`);
    return response.data;
  },
};