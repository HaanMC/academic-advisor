import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import Dashboard from './pages/Dashboard';
import DossierReview from './pages/DossierReview';
import EssayLab from './pages/EssayLab';
import Home from './pages/Home';
import Intake from './pages/Intake';
import InterviewPrep from './pages/InterviewPrep';
import NotFound from './pages/NotFound';
import SchoolFit from './pages/SchoolFit';

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dossier" element={<DossierReview />} />
            <Route path="/essay-lab" element={<EssayLab />} />
            <Route path="/school-fit" element={<SchoolFit />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </LanguageProvider>
  );
}
