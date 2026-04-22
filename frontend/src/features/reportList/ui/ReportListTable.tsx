import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Report } from '../../../shared/types';
import { ReportListTableRow } from './ReportListTableRow';

interface ReportListTableProps {
  reports: Report[];
}

const statusColorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PENDING: 'default',
  PROCESSING: 'info',
  COMPLETED: 'success',
  FAILED: 'error',
};

export const ReportListTable: React.FC<ReportListTableProps> = ({ reports }) => {
  const { t } = useTranslation();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('app.reports')}
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>{t('app.reportId')}</strong></TableCell>
                <TableCell>{t('app.template')}</TableCell>
                <TableCell>{t('app.status')}</TableCell>
                <TableCell>{t('app.started')}</TableCell>
                <TableCell>{t('app.completed')}</TableCell>
                <TableCell align="right">{t('app.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <ReportListTableRow
                  key={report.id}
                  report={report}
                  statusColorMap={statusColorMap}
                  formatDate={formatDate}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};