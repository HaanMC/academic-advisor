import { motion } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { 
  LayoutDashboard, FileText, School, MessageSquare, 
  TrendingUp, AlertCircle, ChevronRight, Download
} from 'lucide-react';
import { studentReadiness, academicMetrics, essayProgress } from '../data/mockData';
import { Link } from 'react-router-dom';

const navSidebar = [
  { name: 'Overview', icon: LayoutDashboard, path: '/dashboard', active: true },
  { name: 'Dossier', icon: FileText, path: '/dossier' },
  { name: 'Essay Lab', icon: MessageSquare, path: '/essay-lab' },
  { name: 'School Fit', icon: School, path: '/school-fit' },
  { name: 'Interview Prep', icon: MessageSquare, path: '/interview-prep' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-paper flex pt-24">
      {/* Sidebar Nav - Desktop */}
      <aside className="w-72 border-r border-divider hidden lg:flex flex-col p-8 space-y-12 shrink-0">
        <div className="space-y-4">
           {navSidebar.map((item) => (
             <Link 
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-4 rounded-none text-[11px] uppercase tracking-widest font-bold transition-all ${item.active ? 'bg-forest text-white' : 'text-slate hover:bg-paper-alt'}`}
             >
                <item.icon size={16} />
                {item.name}
             </Link>
           ))}
        </div>
        
        <div className="mt-auto pt-10 border-t border-divider">
           <div className="p-8 bg-paper-alt border border-divider">
              <p className="text-[9px] uppercase tracking-[0.3em] text-bronze font-bold mb-4">Next Session</p>
              <p className="text-lg font-serif mb-2 italic">Dossier Finalization</p>
              <p className="text-[10px] text-slate uppercase tracking-tighter font-medium">Apr 25 • 09:30 AM</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 lg:p-20 max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
           <div>
              <span className="text-[10px] tracking-[0.5em] uppercase text-bronze mb-4 block font-bold">Strategic Overview</span>
              <h1 className="text-5xl md:text-7xl font-serif text-ink tracking-tight leading-none">Academic <span className="italic">Narrative.</span></h1>
           </div>
           <button className="flex items-center gap-3 border border-ink px-8 py-4 text-[10px] uppercase tracking-widest hover:bg-ink hover:text-white transition-all font-bold">
              <Download size={14} /> Export Report
           </button>
        </div>

        <div className="editorial-grid border border-divider">
           {/* Summary Stats Row */}
           <div className="col-span-12 editorial-grid border-b border-divider">
              <div className="col-span-12 md:col-span-4 p-12 border-b md:border-b-0 md:border-r border-divider group bg-paper-alt">
                 <p className="text-[9px] uppercase tracking-[0.3em] text-bronze mb-6 font-bold">Readiness Score</p>
                 <div className="flex items-end gap-3">
                    <span className="text-6xl font-serif text-ink leading-none">82</span>
                    <span className="text-lg font-serif italic text-forest mb-1">/ 100</span>
                 </div>
                 <div className="mt-8 flex items-center gap-2 text-[10px] text-forest font-bold tracking-widest uppercase">
                    <TrendingUp size={12} /> +12% Delta
                 </div>
              </div>
              <div className="col-span-12 md:col-span-4 p-12 border-b md:border-b-0 md:border-r border-divider group bg-paper">
                 <p className="text-[9px] uppercase tracking-[0.3em] text-bronze mb-6 font-bold">Active Applications</p>
                 <div className="flex items-end gap-3">
                    <span className="text-6xl font-serif text-ink leading-none">08</span>
                    <span className="text-lg font-serif italic text-bronze mb-1">Total</span>
                 </div>
                 <div className="mt-8 flex items-center gap-2 text-[10px] text-slate font-bold tracking-widest uppercase">
                    0 Reach • 5 Target
                 </div>
              </div>
              <div className="col-span-12 md:col-span-4 p-12 group bg-paper-alt">
                 <p className="text-[9px] uppercase tracking-[0.3em] text-bronze mb-6 font-bold">Next Deadline</p>
                 <div className="flex items-end gap-3">
                    <span className="text-6xl font-serif text-ink leading-none">14</span>
                    <span className="text-lg font-serif italic text-slate mb-1">Days</span>
                 </div>
                 <div className="mt-8 flex items-center gap-2 text-[10px] text-ink font-bold tracking-widest uppercase">
                    Early Action Review
                 </div>
              </div>
           </div>

           {/* Insights Radar */}
           <div className="col-span-12 lg:col-span-4 p-10 border border-ink/5 bg-ink/2 rounded-sm flex flex-col items-center">
              <h3 className="text-xs uppercase tracking-[0.2em] text-slate mb-10 w-full font-bold">Profile Distribution</h3>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={studentReadiness}>
                      <PolarGrid stroke="#1A1A1A15" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#4A5568', fontSize: 10, fontWeight: 500 }} />
                      <Radar
                         name="Student"
                         dataKey="score"
                         stroke="#1B3022"
                         fill="#1B3022"
                         fillOpacity={0.1}
                      />
                   </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-8 text-xs italic text-slate/60 text-center font-light leading-relaxed">
                 STEM foundations are exceptional. Consider augmenting extracurricular narrative for holistic depth.
              </p>
           </div>

           {/* Academic Performance Chart */}
           <div className="col-span-12 lg:col-span-7 bg-white p-10 border border-ink/10 rounded-sm shadow-subtle">
              <h3 className="text-xs uppercase tracking-[0.2em] text-slate mb-12 font-bold">Academic Performance Index</h3>
              <div className="w-full h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={academicMetrics} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                       <XAxis 
                          dataKey="subject" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#4A5568', fontSize: 11 }} 
                          dy={10}
                       />
                       <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#A0AEC0', fontSize: 10 }}
                        />
                       <Tooltip 
                         cursor={{ fill: '#F9F8F3' }}
                         contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', color: '#F9F8F3', borderRadius: '2px', fontSize: '11px' }}
                       />
                       <Bar dataKey="score" radius={[2, 2, 0, 0]} barSize={24}>
                          {academicMetrics.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === 0 ? '#1B3022' : '#8C7851'} fillOpacity={0.8} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Critical Actions */}
           <div className="col-span-12 lg:col-span-5 p-10 bg-forest text-paper rounded-sm">
              <h3 className="text-xs uppercase tracking-[0.4em] text-bronze mb-12 font-bold">Priority Mandates</h3>
              <div className="space-y-8">
                 {[
                   { label: 'Narrative Conflict', msg: 'Bioethics interest lacks correlating evidence in extracurricular list.', type: 'critical' },
                   { label: 'Essay Threshold', msg: 'Main Personal Statement exceeds recommended abstraction levels.', type: 'warn' },
                   { label: 'Dossier Gap', msg: 'Missing honors verification for National Math Olympiad.', type: 'missing' },
                 ].map((item) => (
                   <div key={item.label} className="flex gap-4 group cursor-pointer hover:-translate-y-1 transition-transform">
                      <div className="shrink-0 mt-1">
                         <AlertCircle className={`w-5 h-5 ${item.type === 'critical' ? 'text-bronze' : 'text-paper/40'}`} />
                      </div>
                      <div>
                         <p className="text-[10px] uppercase tracking-widest text-bronze mb-1 font-bold">{item.label}</p>
                         <p className="text-sm font-light text-paper/80 leading-snug">{item.msg}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-12 py-4 border border-paper/20 text-xs uppercase tracking-widest hover:bg-paper hover:text-forest transition-all rounded-sm font-bold">
                 Initialize Remediation
              </button>
           </div>

           {/* Essay Progress */}
           <div className="col-span-12 lg:col-span-12">
              <div className="flex justify-between items-end mb-10 px-2">
                 <h3 className="text-xs uppercase tracking-[0.2em] text-slate font-bold">Narrative Artifacts</h3>
                 <Link to="/essay-lab" className="text-[10px] uppercase tracking-widest text-forest font-bold border-b border-forest/20 pb-1 flex items-center gap-1 group">
                    Open Essay Lab <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {essayProgress.map((essay) => (
                   <div key={essay.name} className="p-8 border border-ink/10 bg-white rounded-sm shadow-subtle hover:shadow-lg transition-all group">
                      <p className="text-[10px] uppercase tracking-widest text-slate/50 mb-3 font-bold">{essay.status}</p>
                      <h4 className="font-serif text-lg text-ink mb-6 group-hover:text-forest transition-colors">{essay.name}</h4>
                      <div className="w-full h-1 bg-ink/5 rounded-full mb-2">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${essay.progress}%` }}
                           className="h-full bg-forest rounded-full"
                         />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate uppercase font-bold tracking-tight">
                         <span>Ready</span>
                         <span>{essay.progress}%</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
