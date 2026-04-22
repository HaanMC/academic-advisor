import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Platform from './pages/Platform';
import Intake from './pages/Intake';
import Dashboard from './pages/Dashboard';
import EssayLab from './pages/EssayLab';
import DossierReview from './pages/DossierReview';
import SchoolFit from './pages/SchoolFit';
import InterviewPrep from './pages/InterviewPrep';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/essay-lab" element={<EssayLab />} />
            <Route path="/dossier" element={<DossierReview />} />
            <Route path="/school-fit" element={<SchoolFit />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  );
}
