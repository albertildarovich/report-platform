import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReportTemplate } from '../../../shared/types';

interface ReportTemplateSelectModalProps {
  open: boolean;
  onClose: () => void;
  reports: ReportTemplate[];
  loading: boolean;
  error: string | null;
  generatingId: string | null;
  onGenerate: (reportId: string) => void;
}

export const ReportTemplateSelectModal: React.FC<ReportTemplateSelectModalProps> = ({
  open,
  onClose,
  reports,
  loading,
  error,
  generatingId,
  onGenerate,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('app.selectReportTemplate', 'Select Report Template')}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t('app.failedToLoadTemplates', 'Failed to load report templates:')} {error}
          </Alert>
        ) : reports.length === 0 ? (
          <Typography variant="body1" sx={{ p: 2 }}>
            {t('app.noTemplatesAvailable', 'No report templates available. Please seed the database.')}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {reports.map((report) => (
              <Card key={report.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{report.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {report.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={report.format} size="small" color="primary" variant="outlined" />
                        {report.type && <Chip label={report.type} size="small" variant="outlined" />}
                        <Typography variant="caption" color="text.secondary">
                          ID: {report.id}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onGenerate(report.id)}
                      disabled={generatingId === report.id}
                    >
                      {generatingId === report.id ? <CircularProgress size={20} /> : t('app.generate')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('app.cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};