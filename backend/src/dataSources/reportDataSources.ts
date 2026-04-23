import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DataSourceProvider {
  getData(): Promise<any[]>;
}

class PostgresSalesDataSource implements DataSourceProvider {
  async getData(): Promise<any[]> {
    const salesReports = await prisma.report.findMany({
      where: {
        reportTemplate: {
          type: 'Sales',
        },
      },
      include: {
        reportTemplate: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });

    if (salesReports.length === 0) {
      return [
        { month: 'Jan', revenue: 10000, units: 500 },
        { month: 'Feb', revenue: 12000, units: 600 },
        { month: 'Mar', revenue: 15000, units: 750 },
      ];
    }

    return salesReports.map((report, index) => ({
      month: `M${index + 1}`,
      revenue: 10000 + index * 750,
      units: 500 + index * 30,
      status: report.status,
      generatedAt: report.createdAt.toISOString(),
    }));
  }
}

class ExternalAnalyticsDataSource implements DataSourceProvider {
  async getData(): Promise<any[]> {
    const now = new Date();
    return [
      {
        user: 'Alice',
        logins: 42,
        lastActive: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'mock-public-api',
      },
      {
        user: 'Bob',
        logins: 38,
        lastActive: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        source: 'mock-public-api',
      },
      {
        user: 'Charlie',
        logins: 55,
        lastActive: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        source: 'mock-public-api',
      },
    ];
  }
}

export function getDataSourceProvider(reportType?: string): DataSourceProvider {
  if (reportType === 'Sales') {
    return new PostgresSalesDataSource();
  }

  return new ExternalAnalyticsDataSource();
}
