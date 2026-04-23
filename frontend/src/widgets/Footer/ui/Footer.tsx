import React from 'react';
import { Paper, Typography, Link as MuiLink, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StyledFooter = styled(Paper)(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: 0,
}));

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <StyledFooter elevation={3}>
      <Typography variant="body2" component="div">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <span>Prototype Report Platform • Async Report Generation</span>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <MuiLink
              component={RouterLink}
              to="/reports"
              color="inherit"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              {t('footer.reports', 'Отчеты')}
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="/about"
              color="inherit"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              {t('footer.about', 'О проекте')}
            </MuiLink>
          </Box>
        </Box>
      </Typography>
    </StyledFooter>
  );
};