import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

// Get all report templates
router.get('/', async (req, res) => {
  try {
    const templates = await prisma.reportTemplate.findMany({
      include: {
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
    res.json(templates);
  } catch (error) {
    logger.error('Failed to fetch report templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single report template
router.get('/:id', async (req, res) => {
  try {
    const template = await prisma.reportTemplate.findUnique({
      where: { id: req.params.id },
      include: { reports: true },
    });
    if (!template) {
      return res.status(404).json({ error: 'Report template not found' });
    }
    res.json(template);
  } catch (error) {
    logger.error('Failed to fetch report template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trigger report generation
router.post('/:id/generate', async (req, res) => {
  try {
    const template = await prisma.reportTemplate.findUnique({
      where: { id: req.params.id },
    });
    if (!template) {
      return res.status(404).json({ error: 'Report template not found' });
    }

    const report = await prisma.report.create({
      data: {
        reportTemplateId: template.id,
        status: 'PENDING',
      },
    });

    // In a real implementation, we would publish to a message queue
    // For prototype, we simulate async processing
    // We'll just update status after a delay
    setTimeout(() => {
      // Simulate processing
      prisma.report.update({
        where: { id: report.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      }).catch(logger.error);
    }, 5000);

    res.status(202).json({
      message: 'Report generation started',
      runId: report.id,
      statusUrl: `/api/runs/${report.id}/status`,
    });
  } catch (error) {
    logger.error('Failed to start report generation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;