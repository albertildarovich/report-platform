import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import ReportsPage from '../pages/reports';
import AboutPage from '../pages/about';
import { ReportGenerationProvider } from '../features/reportList';
import { ReportsProvider } from '../features/reportList/model/ReportsContext';

function App() {
  return (
    <ReportsProvider>
      <ReportGenerationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/reports" replace />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Routes>
        </Router>
      </ReportGenerationProvider>
    </ReportsProvider>
  );
}

export default App;