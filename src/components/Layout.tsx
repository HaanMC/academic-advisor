import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLocale } from '../hooks/useLocale';
import { AIModeBadge } from './AIModeBadge';
import { LanguageToggle } from './LanguageToggle';

export default function Layout({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/intake', label: t.nav.intake },
    { to: '/dashboard', label: t.nav.dashboard },
    { to: '/dossier', label: t.nav.dossier },
    { to: '/essay-lab', label: t.nav.essay },
    { to: '/school-fit', label: t.nav.schools },
    { to: '/interview-prep', label: t.nav.interview },
  ];

  return (
    <div className="min-h-screen flex flex-col text-ink bg-paper">
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-sm border-b border-divider">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-baseline gap-3 shrink-0">
            <span className="font-serif italic text-2xl tracking-tight text-ink">{t.brand.name}</span>
            <span className="hidden sm:inline text-[10px] tracking-[0.28em] uppercase text-bronze">
              {t.brand.tagline}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${
                    isActive ? 'text-forest' : 'text-slate hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:block">
              <AIModeBadge compact />
            </div>
            <LanguageToggle className="hidden sm:inline-flex" />
            <Link
              to="/intake"
              className="hidden md:inline-flex items-center bg-ink text-paper px-4 py-2 text-[10px] uppercase tracking-[0.28em] font-medium hover:bg-ink-soft transition-colors"
            >
              {t.nav.begin}
            </Link>
            <button
              className="lg:hidden p-1 text-ink"
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 top-16 md:top-20 z-30 bg-paper lg:hidden px-6 py-8 overflow-y-auto"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `text-3xl font-serif ${isActive ? 'text-forest' : 'text-ink'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="pt-6 border-t border-divider mt-4 space-y-4">
                <LanguageToggle />
                <AIModeBadge />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-divider bg-paper">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="eyebrow">{t.brand.name}</div>
            <p className="text-xs text-slate max-w-md leading-relaxed">{t.footer.localFirst}</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <AIModeBadge compact />
            <span className="text-[10px] uppercase tracking-[0.28em] text-bronze">{t.footer.bilingual}</span>
            <span className="text-xs text-slate">{t.footer.copy(new Date().getFullYear())}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
