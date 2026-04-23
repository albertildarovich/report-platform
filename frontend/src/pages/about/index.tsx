import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('about.title', 'О проекте')}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('about.description', 'Это платформа для генерации и управления отчетами. Система позволяет создавать, просматривать и экспортировать отчеты в различных форматах.')}
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          {t('about.features', 'Основные возможности')}
        </Typography>
        
        <ul>
          <li>
            <Typography variant="body1">
              {t('about.feature1', 'Генерация отчетов в PDF и Excel форматах')}
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              {t('about.feature2', 'Управление шаблонами отчетов')}
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              {t('about.feature3', 'Пагинация и фильтрация списка отчетов')}
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              {t('about.feature4', 'Многоязычная поддержка (русский/английский)')}
            </Typography>
          </li>
        </ul>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          {t('about.technology', 'Технологии')}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('about.techStack', 'Фронтенд: React, TypeScript, Material-UI, React Router. Бэкенд: Node.js, Express, Prisma, PostgreSQL.')}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {t('about.architecture', 'Архитектура системы')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {t('about.architectureDescription', 'Ниже представлена UML-диаграмма, иллюстрирующая архитектуру платформы:')}
          </Typography>
          <Box
            component="img"
            src="/assets/uml.png"
            alt="UML диаграмма архитектуры платформы"
            sx={{
              width: '100%',
              maxWidth: '800px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              borderRadius: 1,
              boxShadow: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            {t('about.architectureCaption', 'UML-диаграмма архитектуры платформы отчетов')}
          </Typography>
        </Box>

        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            {t('about.contact', 'По вопросам и предложениям:')}{' '}
            <Link href="mailto:support@example.com">support@example.com</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AboutPage;