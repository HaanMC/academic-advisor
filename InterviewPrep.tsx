import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileEdit, Book, Sparkles, AlertTriangle, 
  History, Save, Share2, Search, Quote
} from 'lucide-react';

const storyBank = [
  { id: 1, title: 'The Summer at CERN', source: 'Experience', mood: 'Analytical' },
  { id: 2, title: 'Late Night Coding', source: 'Project', mood: 'Grit' },
  { id: 3, title: 'Orchestra Solos', source: 'Art', mood: 'Reflection' },
];

export default function EssayLab() {
  const [content, setContent] = useState('');

  return (
    <div className="min-h-screen bg-paper flex pt-20">
      {/* Narrative Side - Tools & Context */}
      <aside className="w-80 border-r border-ink/5 hidden xl:flex flex-col p-8 space-y-12 shrink-0 overflow-y-auto">
        <div className="space-y-8">
           <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-bronze font-bold mb-6">Story Bank</h3>
              <div className="space-y-4">
                 {storyBank.map((story) => (
                   <div key={story.id} className="p-5 border border-ink/5 bg-white rounded-sm hover:border-bronze transition-colors cursor-grab active:cursor-grabbing group">
                      <p className="text-[10px] uppercase tracking-tighter text-slate/50 mb-2 font-bold">{story.source} • {story.mood}</p>
                      <h4 className="font-serif text-sm text-ink group-hover:text-forest transition-colors">{story.title}</h4>
                   </div>
                 ))}
                 <button className="w-full py-4 border border-dashed border-ink/10 text-[10px] uppercase tracking-widest text-slate hover:bg-ink hover:text-paper transition-all font-bold">
                    Add Narrative Artifact
                 </button>
              </div>
           </div>

           <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-bronze font-bold mb-6">Prompts</h3>
              <div className="p-6 bg-forest text-paper/90 rounded-sm">
                 <p className="text-xs italic leading-relaxed font-serif">
                   "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story."
                 </p>
                 <div className="mt-6 flex justify-between items-center text-[10px] tracking-widest uppercase font-bold text-bronze">
                    <span>Common App 1</span>
                    <Search size={14} className="hover:text-paper cursor-pointer" />
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Center - Writing Studio */}
      <main className="flex-grow flex flex-col md:px-12 py-12 max-w-5xl mx-auto overflow-hidden">
        <div className="flex justify-between items-center mb-12 px-6 md:px-0">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-ink/10 flex items-center justify-center rounded-sm">
                 <FileEdit size={18} className="text-forest" />
              </div>
              <div>
                 <h2 className="text-2xl font-serif text-ink tracking-tight">Personal Statement</h2>
                 <p className="text-[10px] uppercase tracking-[0.2em] text-slate font-bold">Draft 03 • 642 / 650 words</p>
              </div>
           </div>
           <div className="flex gap-4">
              <button className="hidden md:flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-widest text-slate hover:text-ink transition-all font-bold">
                 <History size={16} /> History
              </button>
              <button className="bg-forest text-paper px-8 py-3 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-forest/90 transition-all rounded-sm shadow-subtle">
                 <Save size={16} /> Save
              </button>
           </div>
        </div>

        {/* Editor Area */}
        <div className="flex-grow bg-white border border-ink/5 shadow-inner rounded-sm relative overflow-hidden flex flex-col">
           <div className="flex items-center gap-6 px-10 py-5 border-b border-ink/5 bg-ink/2 font-serif italic text-sm text-slate select-none">
              <span className="cursor-pointer hover:text-ink transition-colors">Style</span>
              <span className="cursor-pointer hover:text-ink transition-colors">Clarity</span>
              <span className="cursor-pointer hover:text-ink transition-colors">Voice</span>
              <div className="ml-auto flex gap-4">
                 <Share2 size={14} className="cursor-pointer hover:text-ink transition-colors" />
                 <Book size={14} className="cursor-pointer hover:text-ink transition-colors" />
              </div>
           </div>
           
           <textarea 
             value={content}
             onChange={(e) => setContent(e.target.value)}
             placeholder="Begin your narrative here..."
             className="flex-grow p-12 md:p-20 focus:outline-none resize-none font-serif text-xl leading-loose text-ink placeholder:text-ink/10"
             spellCheck={false}
           />
           
           {/* Annotation markers (simulated) */}
           <div className="absolute top-[30%] right-10 w-2 h-2 rounded-full bg-bronze animate-pulse cursor-pointer group">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 p-4 bg-ink text-paper text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-sm pointer-events-none shadow-xl border border-paper/10">
                 <div className="flex items-center gap-2 mb-2 text-bronze uppercase tracking-widest font-bold text-[8px]">
                   <Quote size={10} /> Suggestion
                 </div>
                 This transition feels abrupt. Consider anchoring the scientific inquiry to the personal motivation mentioned in paragraph one.
              </div>
           </div>
        </div>
      </main>

      {/* Right Side - Analysis */}
      <aside className="w-80 border-l border-ink/5 hidden lg:flex flex-col p-8 space-y-12 shrink-0">
        <div>
           <h3 className="text-[10px] uppercase tracking-[0.3em] text-bronze font-bold mb-8">Strategic Analysis</h3>
           <div className="space-y-8">
              <div className="p-6 bg-bronze/5 rounded-sm border-l-2 border-bronze">
                 <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-bronze" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-ink">Voice Strength</span>
                 </div>
                 <h4 className="text-3xl font-serif text-ink mb-2">High</h4>
                 <p className="text-xs text-slate font-light leading-relaxed">Distinctive usage of precise vocabulary and varied syntax. Authentic tone.</p>
              </div>

              <div className="p-6 bg-oxblood/5 rounded-sm border-l-2 border-oxblood">
                 <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} className="text-oxblood" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-ink">Cliche Warning</span>
                 </div>
                 <p className="text-xs text-slate font-light leading-relaxed">Overuse of "journey" and "passion" detected. Replace with evidence-based descriptors.</p>
              </div>

              <div className="space-y-6 pt-4">
                 <h3 className="text-[10px] uppercase tracking-widest text-slate font-bold pb-2 border-b border-ink/5">Narrative Metrics</h3>
                 {[
                   { label: 'Intellectual Vitality', val: 92 },
                   { label: 'Self-Reflection', val: 65 },
                   { label: 'Structural Flow', val: 78 },
                 ].map((metric) => (
                   <div key={metric.label}>
                      <div className="flex justify-between mb-2">
                         <span className="text-[10px] uppercase tracking-widest text-slate/60 font-bold">{metric.label}</span>
                         <span className="text-xs font-serif italic">{metric.val}%</span>
                      </div>
                      <div className="h-0.5 bg-ink/5 w-full">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${metric.val}%` }}
                           className="h-full bg-forest"
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <button className="mt-auto w-full py-4 bg-ink text-paper text-[10px] uppercase tracking-widest font-bold hover:bg-forest transition-all rounded-sm flex items-center justify-center gap-2">
           <Sparkles size={14} /> Full Polish Review
        </button>
      </aside>
    </div>
  );
}
