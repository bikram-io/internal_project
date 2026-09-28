import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessments" element={<div />} />
          <Route path="/data" element={<div />} />
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
