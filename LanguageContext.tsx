import { motion } from 'motion/react';
import { 
  FileCheck, ShieldAlert, CheckCircle2, 
  Upload, Search, Filter, Eye, AlertCircle,
  Clock, Download
} from 'lucide-react';

const reviews = [
  { id: 1, type: 'Transcript', status: 'Analysis Complete', score: 98, date: 'Mar 12, 2026' },
  { id: 2, type: 'Extracurriculars', status: 'Strategy Needed', score: 72, date: 'Mar 15, 2026' },
  { id: 3, type: 'Recommendations', status: 'Pending Upload', score: 0, date: '-' },
  { id: 4, type: 'Honors & Awards', status: 'Verification Required', score: 85, date: 'Apr 02, 2026' },
];

export default function DossierReview() {
  return (
    <div className="min-h-screen bg-paper flex flex-col pt-20">
      <div className="max-w-7xl mx-auto w-full px-6 py-20 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
           <div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-bronze mb-2 block">Evidence & Evaluation</span>
              <h1 className="text-4xl lg:text-5xl font-serif text-ink tracking-tight">The <span className="italic">Dossier</span> review.</h1>
           </div>
           
           <div className="flex gap-4">
              <button className="bg-forest text-paper px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-forest/90 transition-all rounded-sm flex items-center gap-3 shadow-subtle group">
                 <Upload size={16} /> Upload New Artifact
              </button>
           </div>
        </div>

        <div className="editorial-grid gap-12 text-ink">
          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8 space-y-12">
             <div className="p-12 bg-white border border-ink/10 rounded-sm shadow-subtle space-y-12">
                <div className="flex justify-between items-center pb-8 border-b border-ink/5">
                   <h3 className="text-xl font-serif">Assessment Inventory</h3>
                   <div className="flex items-center gap-4">
                      <button className="text-[10px] uppercase tracking-widest text-slate hover:text-ink font-bold">Sort by date</button>
                      <Filter size={16} className="text-slate cursor-pointer" />
                   </div>
                </div>

                <div className="space-y-6">
                   {reviews.map((review) => (
                     <div key={review.id} className="p-6 md:p-8 border border-ink/5 hover:border-forest/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                           <div className={`w-12 h-12 flex items-center justify-center rounded-sm ${review.score > 0 ? 'bg-forest/5' : 'bg-oxblood/5'}`}>
                              {review.score > 90 ? <FileCheck className="text-forest" /> : <Search className="text-slate/40" />}
                           </div>
                           <div>
                              <p className="text-[10px] uppercase tracking-widest text-slate font-bold mb-1">{review.type}</p>
                              <h4 className="font-serif text-lg">{review.status}</h4>
                           </div>
                        </div>

                        <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                           <div className="text-center">
                              <p className="text-[9px] uppercase tracking-widest text-slate/40 mb-1">Impact</p>
                              <p className="font-serif text-xl">{review.score > 0 ? `${review.score}%` : 'N/A'}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] uppercase tracking-widest text-slate/40 mb-1">Updated</p>
                              <p className="text-xs font-serif italic">{review.date}</p>
                           </div>
                           <button className="p-3 border border-ink/10 hover:bg-ink hover:text-paper transition-all rounded-sm">
                              <Eye size={16} />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-12 bg-ink text-paper rounded-sm editorial-grid gap-12">
                <div className="col-span-12 md:col-span-7">
                   <h3 className="text-[10px] uppercase tracking-[0.4em] text-bronze font-bold mb-8 italic">Verification Report</h3>
                   <h2 className="text-3xl font-serif mb-6 leading-tight italic">Your profile has high quantitative integrity.</h2>
                   <p className="font-light text-paper/70 leading-relaxed mb-8">
                     Our analysis confirms that your reported GPA and test scores are internally consistent and reflect a high level of academic discipline. The rigor of your curriculum (12 AP courses) places you in the top 2% of candidates globally.
                   </p>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-forest bg-paper px-4 py-2 rounded-full font-bold">
                         <CheckCircle2 size={12} /> Verified
                      </div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-bronze bg-paper/10 px-4 py-2 rounded-full font-bold">
                         <ShieldAlert size={12} /> Narrative Conflict Detected
                      </div>
                   </div>
                </div>
                <div className="col-span-12 md:col-span-5 flex items-center justify-center relative">
                   <div className="w-40 h-40 border-2 border-bronze/30 rounded-full flex flex-col items-center justify-center text-center p-6 group cursor-default">
                      <span className="text-4xl font-serif text-paper mb-1">A+</span>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-bronze">Admissions Integrity Index</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar Area */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="p-10 border border-ink/10 bg-bronze/5 rounded-sm">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-bronze font-bold mb-10 pb-4 border-b border-bronze/10">Strategic Gaps</h4>
                <div className="space-y-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-oxblood uppercase tracking-widest font-bold text-[10px]">
                         <AlertCircle size={14} /> Critical Gap
                      </div>
                      <p className="text-sm font-serif italic text-ink leading-snug">"The transition from biology focus to finance interest lacks documented evidence in the activity list."</p>
                      <button className="text-[9px] uppercase tracking-widest text-forest font-bold hover:underline">Address Observation</button>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-slate uppercase tracking-widest font-bold text-[10px]">
                         <Clock size={14} /> Timeline Risk
                      </div>
                      <p className="text-sm font-serif italic text-ink leading-snug">"Teacher recommendations for STEM subjects have not been confirmed for delivery."</p>
                      <button className="text-[9px] uppercase tracking-widest text-forest font-bold hover:underline">Send Request</button>
                   </div>
                </div>
             </div>

             <div className="p-10 border border-ink/10 bg-white rounded-sm shadow-subtle group cursor-pointer hover:border-forest transition-all">
                <h4 className="text-[10px] uppercase tracking-widest text-slate font-bold mb-8">Narrative Cohesion</h4>
                <div className="flex items-end gap-1 mb-8">
                   <span className="text-5xl font-serif text-ink">74</span>
                   <span className="text-sm font-serif italic text-forest mb-1">%</span>
                </div>
                <div className="h-1 bg-ink/5 w-full mb-8">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '74%' }}
                     className="h-full bg-forest"
                   />
                </div>
                <p className="text-xs text-slate font-light leading-relaxed">
                   Current narrative strength is moderate. Augmenting activity impact metrics will elevate this to 90%+.
                </p>
                <button className="w-full mt-10 py-4 border border-ink/10 text-[10px] uppercase tracking-widest font-bold hover:bg-ink hover:text-paper transition-all rounded-sm flex items-center justify-center gap-2">
                   View Full Analysis <Download size={14} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
