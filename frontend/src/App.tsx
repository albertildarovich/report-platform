import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './app/layouts/MainLayout';
import ReportsPage from './pages/reports';
import { ReportGenerationProvider } from './features/reportList';

function App() {
  return (
    <ReportGenerationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<ReportsPage />} />
          </Route>
        </Routes>
      </Router>
    </ReportGenerationProvider>
  );
}

export default App;