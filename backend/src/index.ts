import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { reportQueue } from './queues/reportQueue';
import reportTemplateRoutes from './routes/reportTemplateRoutes';
import reportRoutes from './routes/reportRoutes';
import logger from './utils/logger';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Bull Board UI for queue monitoring
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(reportQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

// API routes
app.use('/api/report-templates', reportTemplateRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Connected to database');

    app.listen(PORT, () => {
      logger.info(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});