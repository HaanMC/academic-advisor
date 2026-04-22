import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Send, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, title: 'Identity', description: 'Personal foundations' },
  { id: 2, title: 'Academic Profile', description: 'Metrics & curriculum' },
  { id: 3, title: 'Interests', description: 'Fields of study' },
  { id: 4, title: 'Ambition', description: 'Target institutions' },
  { id: 5, title: 'Narrative', description: 'Essay status' },
];

export default function Intake() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col pt-24">
      <div className="max-w-4xl mx-auto w-full px-6 py-24 flex-grow">
        {/* Progress Display */}
        <div className="mb-24 px-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-[9px] tracking-[0.4em] uppercase text-bronze block mb-4 font-bold">Credential Protocol 0{currentStep} / 05</span>
              <h1 className="text-5xl font-serif text-ink tracking-tight">{steps[currentStep - 1].title}</h1>
            </div>
          </div>
          <div className="h-[1px] w-full bg-divider relative">
            <motion.div 
              className="absolute h-[1px] bg-forest left-0 top-0"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-paper border border-divider p-12 md:p-20 rounded-none flex flex-col min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-grow"
            >
              {currentStep === 1 && (
                <div className="space-y-16">
                   <div className="editorial-grid md:gap-x-12 gap-y-16">
                      <div className="col-span-12 md:col-span-6 space-y-4">
                         <label className="text-[9px] uppercase tracking-[0.3em] text-bronze font-bold">Full Legal Name</label>
                         <input 
                           type="text" 
                           placeholder="Alexander Hamilton"
                           className="w-full bg-transparent border-b border-divider py-4 focus:outline-none focus:border-forest transition-colors text-xl font-serif italic"
                         />
                      </div>
                      <div className="col-span-12 md:col-span-6 space-y-4">
                         <label className="text-[9px] uppercase tracking-[0.3em] text-bronze font-bold">Region of Residence</label>
                         <input 
                           type="text" 
                           placeholder="New York, NY"
                           className="w-full bg-transparent border-b border-divider py-4 focus:outline-none focus:border-forest transition-colors text-xl font-serif italic"
                         />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-bronze font-bold">Primary Academy</label>
                      <input 
                        type="text" 
                        placeholder="The Academy at Highvale"
                        className="w-full bg-transparent border-b border-divider py-4 focus:outline-none focus:border-forest transition-colors text-xl font-serif italic"
                      />
                   </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-12">
                   <div className="editorial-grid gap-12">
                      <div className="col-span-12 md:col-span-4 space-y-4">
                         <label className="text-[10px] uppercase tracking-[0.2em] text-slate font-bold">GPA (Unweighted)</label>
                         <input 
                           type="text" 
                           placeholder="3.95"
                           className="w-full bg-transparent border-b border-ink/10 py-3 focus:outline-none focus:border-forest transition-colors text-lg"
                         />
                      </div>
                      <div className="col-span-12 md:col-span-4 space-y-4">
                         <label className="text-[10px] uppercase tracking-[0.2em] text-slate font-bold">SAT / ACT</label>
                         <input 
                           type="text" 
                           placeholder="1560 / 35"
                           className="w-full bg-transparent border-b border-ink/10 py-3 focus:outline-none focus:border-forest transition-colors text-lg"
                         />
                      </div>
                      <div className="col-span-12 md:col-span-4 space-y-4">
                         <label className="text-[10px] uppercase tracking-[0.2em] text-slate font-bold">AP / IB Courses</label>
                         <input 
                           type="text" 
                           placeholder="12"
                           className="w-full bg-transparent border-b border-ink/10 py-3 focus:outline-none focus:border-forest transition-colors text-lg"
                         />
                      </div>
                   </div>
                   <p className="text-xs text-slate/60 font-light italic">Detailed transcript analysis will be available in the Dossier Review module after submission.</p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-10">
                   <p className="text-lg font-light text-slate">Select your primary fields of intellectual curiosity.</p>
                   <div className="flex flex-wrap gap-4">
                      {['Computer Science', 'Philosophy', 'Bioethics', 'Economics', 'Political Science', 'Visual Arts', 'Architecture', 'Classical Music'].map((interest) => (
                        <button 
                          key={interest}
                          className="px-6 py-3 border border-ink/10 text-sm hover:bg-forest hover:text-paper hover:border-forest transition-all rounded-sm"
                        >
                          {interest}
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-12">
                   <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-slate font-bold">Target Institutions</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {['Ivy League', 'Liberal Arts', 'STEM Targeted', 'Global Research'].map((type) => (
                           <div key={type} className="p-6 border border-ink/5 hover:border-bronze/30 transition-colors cursor-pointer rounded-sm flex justify-between items-center group">
                              <span className="font-serif">{type}</span>
                              <div className="w-2 h-2 rounded-full bg-ink/10 group-hover:bg-bronze transition-colors" />
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-12 text-center py-10">
                   {isSubmitting ? (
                     <motion.div 
                       initial={{ opacity: 0 }} 
                       animate={{ opacity: 1 }} 
                       className="flex flex-col items-center"
                     >
                        <div className="w-16 h-16 border-4 border-forest/10 border-t-forest rounded-full animate-spin mb-8" />
                        <h2 className="text-2xl font-serif mb-4 italic">Synthesizing Profile...</h2>
                        <p className="text-slate font-light text-sm tracking-wide">Evaluating trajectory, impact, and selection criteria.</p>
                     </motion.div>
                   ) : (
                     <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-forest/5 flex items-center justify-center rounded-full mx-auto mb-10 overflow-hidden">
                           <Check className="w-8 h-8 text-forest" />
                        </div>
                        <h2 className="text-3xl font-serif mb-6 text-ink">Ready for review.</h2>
                        <p className="text-slate font-light mb-12 leading-relaxed">
                          Your preliminary data is collected. Upon finalization, Northstar will generate your readiness dashboard and initial strategic report.
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-bronze font-bold mb-4 italic italic">No corrections needed at this stage</p>
                     </div>
                   )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {!isSubmitting && (
            <div className="mt-16 flex justify-between items-center pt-8 border-t border-ink/5">
              <button 
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentStep === 1 ? 'opacity-0' : 'text-slate hover:text-ink'}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              {currentStep < steps.length ? (
                <button 
                  onClick={nextStep}
                  className="bg-forest text-paper px-8 py-4 text-sm font-medium hover:bg-forest/90 transition-all rounded-sm flex items-center gap-3 shadow-subtle group"
                >
                  Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="bg-ink text-paper px-12 py-4 text-sm font-medium hover:bg-ink/90 transition-all rounded-sm flex items-center gap-3 shadow-subtle group"
                >
                  Generate Dashboard <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
