import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { HomePage } from './pages/HomePage';
import { TutorialPage } from './pages/TutorialPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ScenariosPage } from './pages/ScenariosPage';
import { FAQPage } from './pages/FAQPage';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tutorial" element={<TutorialPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
