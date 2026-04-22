import { motion } from 'motion/react';
import { 
  Building2, MapPin, DollarSign, Users, 
  Search, SlidersHorizontal, ChevronRight, ArrowLeftRight,
  Star, StarOff, Info, ExternalLink
} from 'lucide-react';
import { schoolsData } from '../data/mockData';
import { useState } from 'react';

export default function SchoolFit() {
  const [filter, setFilter] = useState('All');

  const filteredSchools = filter === 'All' ? schoolsData : schoolsData.filter(s => s.fit === filter);

  return (
    <div className="min-h-screen bg-paper flex flex-col pt-20">
      <div className="max-w-7xl mx-auto w-full px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
           <div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-bronze mb-2 block">Institutional Discovery</span>
              <h1 className="text-4xl lg:text-5xl font-serif text-ink tracking-tight">The list of <span className="italic">intent</span>.</h1>
           </div>
           
           <div className="flex flex-wrap gap-4 items-center">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate group-focus-within:text-forest transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search institutions"
                   className="pl-12 pr-6 py-3 border border-ink/10 bg-white/50 focus:bg-white focus:outline-none focus:border-forest transition-all rounded-sm text-sm"
                 />
              </div>
              <button className="flex items-center gap-2 border border-ink/10 px-6 py-3 text-[10px] uppercase tracking-widest hover:border-ink transition-all rounded-sm font-bold">
                 <SlidersHorizontal size={14} /> Filters
              </button>
           </div>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-ink/5 mb-12 overflow-x-auto no-scrollbar">
           {['All', 'Reach', 'Target', 'Safety'].map((item) => (
             <button
               key={item}
               onClick={() => setFilter(item)}
               className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap ${filter === item ? 'text-forest border-b-2 border-forest' : 'text-slate/60 hover:text-ink hover:border-b-2 hover:border-ink/20'}`}
             >
               {item}
             </button>
           ))}
        </div>

        {/* School Grid */}
        <div className="editorial-grid gap-8">
           {filteredSchools.map((school) => (
             <motion.div 
               layout
               key={school.id}
               className="col-span-12 md:col-span-6 lg:col-span-4 group"
             >
                <div className="bg-white border border-ink/10 p-10 rounded-sm shadow-subtle hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full">
                   <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 bg-ink/2 flex items-center justify-center border border-ink/5 rounded-sm">
                         <Building2 className="w-6 h-6 text-slate/40 group-hover:text-forest transition-colors" />
                      </div>
                      <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold font-sans rounded-sm ${
                        school.fit === 'Reach' ? 'bg-oxblood/10 text-oxblood' :
                        school.fit === 'Target' ? 'bg-bronze/10 text-bronze' :
                        'bg-forest/10 text-forest'
                      }`}>
                         {school.fit}
                      </span>
                   </div>

                   <h3 className="text-2xl font-serif text-ink mb-2 group-hover:text-forest transition-colors leading-tight">
                     {school.name}
                   </h3>
                   <div className="flex items-center gap-1.5 text-xs text-slate font-light mb-8 italic">
                      <MapPin size={12} className="text-bronze" /> {school.location}
                   </div>

                   <div className="editorial-grid gap-4 mt-auto pt-8 border-t border-ink/5">
                      <div className="col-span-6">
                         <p className="text-[9px] uppercase tracking-widest text-slate/50 font-bold mb-1">Adm Rate</p>
                         <p className="font-serif text-lg">{school.admissionRate}</p>
                      </div>
                      <div className="col-span-6">
                         <p className="text-[9px] uppercase tracking-widest text-slate/50 font-bold mb-1">COA</p>
                         <p className="font-serif text-lg">{school.cost}</p>
                      </div>
                   </div>

                   <div className="mt-8 pt-8 space-y-4">
                      <div className="flex items-center justify-between text-xs group/link cursor-pointer">
                         <div className="flex items-center gap-2 text-slate font-light">
                            <Info size={14} className="text-forest" /> Fit Analysis
                         </div>
                         <ChevronRight size={14} className="text-ink/20 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                      <button className="w-full py-4 bg-ink text-paper text-[10px] uppercase tracking-widest font-bold hover:bg-forest transition-all rounded-sm flex items-center justify-center gap-2">
                        Add to Strategy <ExternalLink size={14} />
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}

           {/* Call to Action - Add school */}
           <div className="col-span-12 md:col-span-6 lg:col-span-4">
              <div className="h-full bg-bronze/5 border border-dashed border-bronze/20 p-10 rounded-sm flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-bronze/10 transition-colors">
                 <div className="w-16 h-16 rounded-full border border-bronze/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 text-bronze" />
                 </div>
                 <h3 className="text-xl font-serif text-ink mb-4 italic">Institutional Request</h3>
                 <p className="text-xs text-slate font-light leading-relaxed max-w-[200px]">
                   Don't see your target? Request a strategic fit analysis for any institution globally.
                 </p>
              </div>
           </div>
        </div>

        {/* Comparison Section */}
        <section className="mt-40">
           <div className="flex justify-between items-end mb-16">
              <div>
                 <span className="text-[10px] tracking-[0.4em] uppercase text-bronze mb-2 block">Side-by-side</span>
                 <h2 className="text-4xl font-serif text-ink tracking-tight">Institutional <span className="italic">Logic</span>.</h2>
              </div>
              <button className="flex items-center gap-2 bg-forest text-paper px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-forest/90 transition-all rounded-sm shadow-subtle group">
                 <ArrowLeftRight size={16} /> Enter Comparison Mode
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-ink/10">
                       <th className="py-6 px-4 text-[10px] uppercase tracking-widest text-slate font-bold">Attribute</th>
                       <th className="py-6 px-4 text-sm font-serif">Harvard University</th>
                       <th className="py-6 px-4 text-sm font-serif">Stanford University</th>
                       <th className="py-6 px-4 text-sm font-serif">UC Chicago</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm font-light text-slate items-center">
                    {[
                      { attr: 'Academic Rigor', h: 'Extreme', s: 'Extreme', u: 'Heavy' },
                      { attr: 'Narrative Fit', h: 'Leadership', s: 'Innovation', u: 'Intellectualism' },
                      { attr: 'Primary Focus', h: 'Public Service', s: 'Entrepreneurial', u: 'Academic Research' },
                      { attr: 'Student Culture', h: 'Structured', s: 'Collaborative', u: 'Iconoclastic' },
                    ].map((item) => (
                      <tr key={item.attr} className="border-b border-ink/5 hover:bg-ink/2 transition-colors">
                         <td className="py-8 px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-ink/40">{item.attr}</td>
                         <td className="py-8 px-4">{item.h}</td>
                         <td className="py-8 px-4">{item.s}</td>
                         <td className="py-8 px-4">{item.u}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>
      </div>
    </div>
  );
}
