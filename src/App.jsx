import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import MainDashboard from './pages/MainDashboard/MainDashboard';
import DataPage from './pages/Data/DataPage';
import KafkaOverview from './pages/Data/KafkaOverview';
import AssessmentSetup from './pages/Data/AssessmentSetup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="/assessments" element={<div />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/data/kafka" element={<KafkaOverview />} />
          <Route path="/data/kafka/assessment" element={<AssessmentSetup />} />
          <Route path="/genai" element={<div />} />
          <Route path="/ml" element={<div />} />
          <Route path="/data-governance" element={<div />} />
          <Route path="/reports" element={<div />} />
          <Route path="/administration" element={<div />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
