import React from 'react';
import { TableRow, TableCell, Chip, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Report } from '../../../shared/api/client/models/Report';
import { reportApi } from '../../../entities/report';

interface ReportListTableRowProps {
  report: Report;
  statusColorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'>;
  formatDate: (dateString?: string) => string;
}

export const ReportListTableRow: React.FC<ReportListTableRowProps> = ({
  report,
  statusColorMap,
  formatDate,
}) => {
  const { t } = useTranslation();
  const status = report.status ?? 'PENDING';
  const reportId = report.id ?? 'unknown';
  const statusColor = statusColorMap[status] || 'default';

  const handleDownload = () => {
    const downloadUrl = reportApi.resolveDownloadUrl(report.resultUrl || '', report.id);
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewError = () => {
    alert(`Error: ${report.error}`);
  };

  const getStatusLabel = (status: string) => {
    return t(`status.${status}`, { defaultValue: status });
  };

  const getButtonLabel = (status: string) => {
    if (status === 'COMPLETED') return t('app.download');
    if (status === 'FAILED') return t('app.viewError', 'View Error');
    if (status === 'PENDING') return t('app.queued', 'Queued');
    return t('app.processing', 'Processing');
  };

  return (
    <TableRow hover>
      <TableCell>
        <code>{reportId.substring(0, 8)}...</code>
      </TableCell>
      <TableCell>
        <Box>
          <strong>{report.reportTemplateId || t('app.unknown', 'Unknown')}</strong>
          <br />
          <small>{t('app.templateId', 'Template ID')}</small>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={getStatusLabel(status)}
          color={statusColor}
          size="small"
          variant="filled"
        />
      </TableCell>
      <TableCell>{formatDate(report.startedAt ?? undefined)}</TableCell>
      <TableCell>{formatDate(report.completedAt ?? undefined)}</TableCell>
      <TableCell align="right">
        {status === 'COMPLETED' ? (
          <Button variant="contained" size="small" onClick={handleDownload}>
            {t('app.download')}
          </Button>
        ) : status === 'FAILED' ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleViewError}
          >
            {t('app.viewError', 'View Error')}
          </Button>
        ) : (
          <Button variant="outlined" size="small" disabled>
            {getButtonLabel(status)}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};