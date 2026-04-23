import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../../shared/ui/LanguageSwitcher';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  // marginBottom: theme.spacing(4),
}));

interface HeaderProps {
  onNewReportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewReportClick }) => {
  const { t } = useTranslation();

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('app.title')}
        </Typography>
        <LanguageSwitcher />
        <Button
          variant="contained"
          color="secondary"
          onClick={onNewReportClick}
          sx={{ mr: 2, ml: 2 }}
        >
          {t('app.newReport')}
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
};