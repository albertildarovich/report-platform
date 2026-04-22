import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled(Paper)(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: 0,
}));

export const Footer: React.FC = () => {
  return (
    <StyledFooter elevation={3}>
      <Typography variant="body2">
        Prototype Report Platform • Async Report Generation
      </Typography>
    </StyledFooter>
  );
};