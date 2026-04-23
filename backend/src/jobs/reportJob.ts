import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import { generateXlsx } from '../reportGenerators/xlsxGenerator';
import { generatePdf } from '../reportGenerators/pdfGenerator';
import { getDataSourceProvider } from '../dataSources/reportDataSources';

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

    // Fetch data via provider to show heterogeneous sources.
    const dataSourceProvider = getDataSourceProvider(template.type || undefined);
    const data = await dataSourceProvider.getData();

    // Generate report in the requested template format.
    if (template.format === 'XLSX') {
      await generateXlsx(data);
    } else {
      await generatePdf(data);
    }

    // In a real scenario we would store files in object storage
    // For prototype we store as base64 in DB (not production-ready)
    const resultUrl = `/api/reports/${reportId}/download`;

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