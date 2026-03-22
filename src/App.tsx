import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { HomePage } from '@/pages/HomePage';
import { TutorialPage } from '@/pages/TutorialPage';
import { QuickListWorkbench } from '@/components/workbench/QuickListWorkbench';
import { ComparisonPage } from '@/pages/ComparisonPage';
import { FAQPage } from '@/pages/FAQPage';
import { ScenariosPage } from '@/pages/ScenariosPage';
import './styles/global.css';

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/playground" element={<QuickListWorkbench />} />
        <Route path="/comparison" element={<ComparisonPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/scenarios" element={<ScenariosPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
