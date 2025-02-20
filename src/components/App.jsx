import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage'; 
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Project from './Project';
import AddProjectPage from "./AddProjectPage";
import RankProjects from './RankProjects';
import TvStaticBackground from './ui/TvStaticBackground';

function App() {
  return (
    <BrowserRouter>
      <TvStaticBackground />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/add-project" element={<AddProjectPage />} />
        <Route path="/rank-project" element={<RankProjects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
