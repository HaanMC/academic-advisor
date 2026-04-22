import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)]">
      {/* Main Grid Container */}
      <main className="flex-1 editorial-grid border-b border-divider">
        {/* Left Section: Hero */}
        <section className="col-span-12 lg:col-span-7 p-12 md:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-divider bg-paper">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-bronze font-bold mb-8 block">{t('hero_status')}</span>
            <h1 className="font-serif text-6xl md:text-8xl leading-[1.02] tracking-tight mb-10">
              {t('hero_title_part1')}<span className="italic">{t('hero_title_italic')}</span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-slate font-light mb-12">
              {t('hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <Link 
                to="/intake"
                className="w-full sm:w-auto border border-ink px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-ink hover:text-white transition-all text-center"
              >
                {t('btn_begin_diagnostic')}
              </Link>
              <span className="text-[10px] uppercase tracking-widest text-bronze font-medium">{t('cohort_status')}</span>
            </div>
          </motion.div>
        </section>

        {/* Right Section: Insights & Dashboard Preview */}
        <section className="col-span-12 lg:col-span-5 flex flex-col bg-paper">
          {/* Top Half: Diagnostic Chart */}
          <div className="flex-1 p-12 md:p-16 border-b border-divider bg-paper-alt">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-bronze mb-2 font-bold">{t('diag_title')}</h3>
                <p className="font-serif text-2xl">{t('diag_index')}</p>
              </div>
              <div className="text-5xl font-serif italic text-forest">8.4</div>
            </div>

            {/* Custom Aesthetic Chart */}
            <div className="relative h-48 flex items-end gap-3 px-2">
              {[0.4, 0.65, 0.85, 1, 0.75, 0.5, 0.8].map((op, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${op * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="flex-1 bg-forest"
                  style={{ opacity: op }}
                />
              ))}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-divider" />
            </div>
            <div className="flex justify-between mt-6 text-[9px] uppercase tracking-[0.2em] text-bronze font-bold">
              <span>{t('range_stem')}</span>
              <span>{t('range_humanities')}</span>
              <span>{t('range_impact')}</span>
            </div>
          </div>

          {/* Bottom Half: Status List */}
          <div className="flex-1 p-12 md:p-16 flex flex-col justify-between">
            <div className="space-y-10">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-bronze mb-2 font-bold font-bold">{t('dossier_readiness')}</h3>
              <div className="space-y-6">
                {[
                  { label: t('ps_label'), status: 'Draft 03', progress: 75 },
                  { label: t('portfolio_label'), status: 'Verified', progress: 100 },
                  { label: t('school_list_label'), status: '12 Selected', progress: 45 },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                      <span className="text-ink">{item.label}</span>
                      <span className="text-forest italic font-serif normal-case text-sm font-normal">{item.status}</span>
                    </div>
                    <div className="w-full h-[1.5px] bg-divider">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        className="h-full bg-forest"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-divider">
              <p className="text-sm font-serif italic leading-[1.6] text-slate mb-4">
                {t('insight_quote')}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-bronze font-bold">{t('insight_author')}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
