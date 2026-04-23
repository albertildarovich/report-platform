import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.report.deleteMany();
  await prisma.reportTemplate.deleteMany();

  // Create two sample report templates
  const template1 = await prisma.reportTemplate.create({
    data: {
      name: 'Monthly Sales Report',
      description: 'Aggregated sales data by month, including revenue and units sold.',
      format: 'PDF',
      type: 'Sales',
    },
  });

  const template2 = await prisma.reportTemplate.create({
    data: {
      name: 'User Activity Dashboard',
      description: 'User login statistics and activity metrics.',
      format: 'XLSX',
      type: 'Analytics',
    },
  });

  // Create a few sample reports (formerly runs)
  await prisma.report.createMany({
    data: [
      {
        reportTemplateId: template1.id,
        status: 'COMPLETED',
        startedAt: new Date(Date.now() - 86400000),
        completedAt: new Date(Date.now() - 86300000),
        resultUrl: '/api/reports/1/download',
      },
      {
        reportTemplateId: template1.id,
        status: 'FAILED',
        startedAt: new Date(Date.now() - 3600000),
        completedAt: new Date(Date.now() - 3500000),
        error: 'Data source timeout',
      },
      {
        reportTemplateId: template2.id,
        status: 'PROCESSING',
        startedAt: new Date(),
      },
    ],
  });

  console.log('Seeding completed.');
  console.log(`Created report templates: ${template1.name}, ${template2.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });