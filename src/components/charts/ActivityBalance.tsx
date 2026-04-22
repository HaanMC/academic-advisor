import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const PALETTE = ['#2a3b2a', '#8a6f3f', '#1f2a3c', '#6a2a2a', '#415845', '#c6a765'];

export function ActivityBalance({ data }: { data: Array<{ category: string; hours: number }> }) {
  const nonZero = data.filter((d) => d.hours > 0);
  const use = nonZero.length ? nonZero : [{ category: 'No data', hours: 1 }];
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={use} dataKey="hours" nameKey="category" innerRadius={52} outerRadius={80} paddingAngle={1} stroke="#fbf9f5">
            {use.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: '#1f1d1b', border: 'none', color: '#fbf9f5', fontSize: 11, padding: '6px 10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
