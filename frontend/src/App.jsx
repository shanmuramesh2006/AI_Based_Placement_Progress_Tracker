import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResumeCheckingPage from './pages/ResumeCheckingPage';
import TestFlowPage from './pages/TestFlowPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? 
          <LoginPage setAuth={setIsAuthenticated} /> : 
          <Navigate to="/dashboard" />
        } />
        
        <Route path="/dashboard" element={
          isAuthenticated ? 
          <DashboardPage setAuth={setIsAuthenticated} /> : 
          <Navigate to="/login" />
        } />
        
        <Route path="/resume-check" element={
          isAuthenticated ? 
          <ResumeCheckingPage setAuth={setIsAuthenticated} /> : 
          <Navigate to="/login" />
        } />
        <Route path="/tests" element={
          isAuthenticated ?
          <TestFlowPage setAuth={setIsAuthenticated} /> :
          <Navigate to="/login" />
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
