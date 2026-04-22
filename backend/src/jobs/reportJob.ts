import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { generateXlsx } from '../reportGenerators/xlsxGenerator';
import { generatePdf } from '../reportGenerators/pdfGenerator';

const prisma = new PrismaClient();

export async function processReport(reportTemplateId: string, reportId: string) {
  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { status: 'PROCESSING', startedAt: new Date() },
    });

    // Fetch report template definition
    const template = await prisma.reportTemplate.findUnique({
      where: { id: reportTemplateId },
    });

    if (!template) {
      throw new Error(`Report template ${reportTemplateId} not found`);
    }

    // Simulate data fetching from different sources
    const data = await fetchDataForReport(template.name);

    // Generate report based on format (for prototype we generate both XLSX and PDF)
    const xlsxBuffer = await generateXlsx(data);
    const pdfBuffer = await generatePdf(data);

    // In a real scenario we would store files in object storage
    // For prototype we store as base64 in DB (not production-ready)
    const resultUrl = `/api/runs/${reportId}/download`;

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        resultUrl,
      },
    });

    logger.info(`Report template ${reportTemplateId} generated successfully`);
    return { success: true, reportId };
  } catch (error: any) {
    logger.error(`Failed to generate report template ${reportTemplateId}:`, error);
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'FAILED',
        error: error.message,
      },
    });
    throw error;
  }
}

async function fetchDataForReport(reportName: string): Promise<any[]> {
  // Mock data for prototype
  if (reportName.includes('Sales')) {
    return [
      { month: 'Jan', revenue: 10000, units: 500 },
      { month: 'Feb', revenue: 12000, units: 600 },
      { month: 'Mar', revenue: 15000, units: 750 },
    ];
  } else {
    return [
      { user: 'Alice', logins: 42, lastActive: '2024-01-15' },
      { user: 'Bob', logins: 38, lastActive: '2024-01-14' },
      { user: 'Charlie', logins: 55, lastActive: '2024-01-16' },
    ];
  }
}