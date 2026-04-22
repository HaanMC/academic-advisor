import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export function SubjectBars({ data }: { data: Array<{ subject: string; score: number }> }) {
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <XAxis dataKey="subject" axisLine={{ stroke: '#cfc8b9' }} tickLine={false} tick={{ fill: '#4c4944', fontSize: 10 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8a6f3f', fontSize: 10 }} domain={[0, 100]} width={28} />
          <Tooltip cursor={{ fill: '#efeadf' }} contentStyle={{ background: '#1f1d1b', border: 'none', color: '#fbf9f5', fontSize: 11, padding: '6px 10px' }} />
          <Bar dataKey="score" radius={[0, 0, 0, 0]} barSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={i % 2 ? '#2a3b2a' : '#8a6f3f'} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
