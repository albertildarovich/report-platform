import React from 'react';
import { TableRow, TableCell, Chip, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Report } from '../../../shared/types';

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
  const statusColor = statusColorMap[report.status] || 'default';

  const handleDownload = () => {
    alert(`Download stub for ${report.id}`);
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
        <code>{report.id.substring(0, 8)}...</code>
      </TableCell>
      <TableCell>
        <Box>
          <strong>{report.reportTemplate?.name || t('app.unknown', 'Unknown')}</strong>
          <br />
          <small>{report.reportTemplate?.description}</small>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={getStatusLabel(report.status)}
          color={statusColor}
          size="small"
          variant="filled"
        />
      </TableCell>
      <TableCell>{formatDate(report.startedAt)}</TableCell>
      <TableCell>{formatDate(report.completedAt)}</TableCell>
      <TableCell align="right">
        {report.status === 'COMPLETED' ? (
          <Button variant="contained" size="small" onClick={handleDownload}>
            {t('app.download')}
          </Button>
        ) : report.status === 'FAILED' ? (
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
            {getButtonLabel(report.status)}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};