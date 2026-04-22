import { PrismaClient } from '@prisma/client';
import { reportQueue } from './queues/reportQueue';
import logger from './utils/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('Worker started');

  // Обработка завершения работы
  const shutdown = async () => {
    logger.info('Worker shutting down...');
    await reportQueue.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Keep the process alive
  // Bull будет автоматически обрабатывать задачи благодаря импорту reportQueue
  // и вызову reportQueue.process в файле reportQueue.ts
}

main().catch((error) => {
  logger.error('Worker failed:', error);
  process.exit(1);
});