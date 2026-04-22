import { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Languages } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t('nav_platform'), path: '/platform' },
    { name: t('nav_intake'), path: '/intake' },
    { name: t('nav_dashboard'), path: '/dashboard' },
    { name: t('nav_essay_lab'), path: '/essay-lab' },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-forest/10 font-sans text-ink">
      <header className="sticky top-0 z-50 bg-paper border-b border-divider h-24">
        <div className="max-w-7xl mx-auto px-12 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif italic text-2xl font-semibold tracking-tight text-ink">Northstar</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-bronze pt-1 hidden sm:inline">{t('nav_advising_studio')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-widest font-medium transition-all hover:text-forest ${
                    isActive ? 'text-forest border-b border-forest' : 'text-slate'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-divider">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate hover:text-ink transition-colors"
                aria-label="Switch Language"
              >
                <Languages size={14} className="text-bronze" />
                {language === 'en' ? 'VN' : 'EN'}
              </button>
              <Link
                to="/intake"
                className="bg-forest text-white px-5 py-2 text-[11px] uppercase tracking-widest font-medium hover:bg-forest/90 transition-all rounded-none"
              >
                {t('nav_portal')}
              </Link>
            </div>
          </nav>

          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-paper pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-serif text-ink"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => { setLanguage('en'); setIsMenuOpen(false); }}
                  className={`text-sm uppercase tracking-widest font-bold ${language === 'en' ? 'text-forest' : 'text-slate'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => { setLanguage('vi'); setIsMenuOpen(false); }}
                  className={`text-sm uppercase tracking-widest font-bold ${language === 'vi' ? 'text-forest' : 'text-slate'}`}
                >
                  Tiếng Việt
                </button>
              </div>
              <Link
                to="/intake"
                onClick={() => setIsMenuOpen(false)}
                className="bg-forest text-paper py-4 text-center text-lg font-medium rounded-sm"
              >
                {t('nav_portal')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="px-12 py-10 border-t border-divider bg-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.15em] text-bronze font-medium">
          <span>{t('footer_match')}</span>
          <span>{t('footer_timeline')}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-medium text-slate">{t('footer_guidance')}</span>
          <div className="w-2 h-2 rounded-full bg-green-800 animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
}
