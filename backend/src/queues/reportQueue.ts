import Queue from 'bull';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { processReport } from '../jobs/reportJob';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const reportQueue = new Queue('report generation', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

reportQueue.process(async (job) => {
  const { reportTemplateId, reportId } = job.data;
  logger.info(`Processing report template ${reportTemplateId}, report ${reportId}`);
  return await processReport(reportTemplateId, reportId);
});

reportQueue.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed with result: ${result}`);
});

reportQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed with error: ${err.message}`);
});

export const addReportJob = async (reportTemplateId: string, reportId: string) => {
  await reportQueue.add({ reportTemplateId, reportId });
};