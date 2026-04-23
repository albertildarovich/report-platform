import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

// Get all reports (formerly runs) with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    logger.debug(`Pagination: page=${page}, limit=${limit}, skip=${skip}`);

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        include: { reportTemplate: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.report.count(),
    ]);

    logger.debug(`Fetched ${reports.length} reports, total=${total}`);

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get report status
router.get('/:id/status', async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: { reportTemplate: true },
    });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    logger.error('Failed to fetch report status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download result (stub)
router.get('/:id/download', async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: { reportTemplate: true },
    });
    if (!report || report.status !== 'COMPLETED') {
      return res.status(404).json({ error: 'Result not available' });
    }

    // In a real implementation, we would stream the file from storage
    // For prototype, we return a mock file with correct format metadata.
    const isPdf = report.reportTemplate?.format === 'PDF';
    const extension = isPdf ? 'pdf' : 'xlsx';
    const contentType = isPdf
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const mockContent = isPdf ? 'Mock PDF report content' : 'Mock XLSX report content';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="report-${report.id}.${extension}"`);
    res.send(Buffer.from(mockContent));
  } catch (error) {
    logger.error('Failed to download result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;