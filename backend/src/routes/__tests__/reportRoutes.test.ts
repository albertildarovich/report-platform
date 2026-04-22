import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import reportRoutes from '../reportRoutes';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    report: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    reportTemplate: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const app = express();
app.use(express.json());
app.use('/api/reports', reportRoutes);

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('Report Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reports', () => {
    it('should return paginated reports', async () => {
      const mockReports = [
        { id: '1', name: 'Report 1', createdAt: new Date(), reportTemplate: { id: 't1', name: 'Template 1' } },
        { id: '2', name: 'Report 2', createdAt: new Date(), reportTemplate: { id: 't2', name: 'Template 2' } },
      ];
      (prisma.report.findMany as jest.Mock).mockResolvedValue(mockReports);
      (prisma.report.count as jest.Mock).mockResolvedValue(20);

      const response = await request(app)
        .get('/api/reports')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.reports).toHaveLength(2);
      expect(response.body.pagination.total).toBe(20);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      expect(prisma.report.findMany).toHaveBeenCalledWith({
        include: { reportTemplate: true },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should handle missing query parameters', async () => {
      (prisma.report.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.report.count as jest.Mock).mockResolvedValue(0);

      const response = await request(app)
        .get('/api/reports')
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    it('should handle database errors', async () => {
      (prisma.report.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .get('/api/reports')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('GET /api/reports/:id/status', () => {
    it('should return report status', async () => {
      const mockReport = {
        id: '123',
        status: 'completed',
        reportTemplate: { id: 't1', name: 'Template 1' },
      };
      (prisma.report.findUnique as jest.Mock).mockResolvedValue(mockReport);

      const response = await request(app)
        .get('/api/reports/123/status')
        .expect(200);

      expect(response.body).toEqual(mockReport);
      expect(prisma.report.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        include: { reportTemplate: true },
      });
    });

    it('should return 404 if report not found', async () => {
      (prisma.report.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/reports/999/status')
        .expect(404);

      expect(response.body.error).toBe('Report not found');
    });
  });

  describe('POST /api/reports/generate', () => {
    it('should create a report generation job', async () => {
      const mockTemplate = { id: 't1', name: 'Template 1' };
      const mockReport = { id: 'new-id', status: 'pending' };
      (prisma.reportTemplate.findMany as jest.Mock).mockResolvedValue([mockTemplate]);
      (prisma.report.create as jest.Mock).mockResolvedValue(mockReport);

      const response = await request(app)
        .post('/api/reports/generate')
        .send({ templateId: 't1', parameters: {} })
        .expect(202);

      expect(response.body.reportId).toBe('new-id');
      expect(response.body.message).toBe('Report generation started');
    });

    it('should return 400 if template not found', async () => {
      (prisma.reportTemplate.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .post('/api/reports/generate')
        .send({ templateId: 'invalid', parameters: {} })
        .expect(400);

      expect(response.body.error).toBe('Template not found');
    });
  });
});