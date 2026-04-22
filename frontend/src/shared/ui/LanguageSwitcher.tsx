import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];

export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    handleClose();
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        sx={{ textTransform: 'none' }}
      >
        <Typography variant="body2">
          {currentLanguage.label}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            selected={language.code === i18n.language}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};