import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export function GpaTrend({ data }: { data: Array<{ term: string; gpa: number }> }) {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2ddd2" strokeDasharray="2 3" vertical={false} />
          <XAxis dataKey="term" axisLine={{ stroke: '#cfc8b9' }} tickLine={false} tick={{ fill: '#4c4944', fontSize: 10 }} />
          <YAxis
            domain={[0.5, 1]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8a6f3f', fontSize: 10 }}
            tickFormatter={(v) => (v * 100).toFixed(0) + '%'}
            width={36}
          />
          <Tooltip
            cursor={{ stroke: '#cfc8b9' }}
            contentStyle={{ background: '#1f1d1b', border: 'none', color: '#fbf9f5', fontSize: 11, padding: '6px 10px' }}
            formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
          />
          <Line type="monotone" dataKey="gpa" stroke="#2a3b2a" strokeWidth={1.5} dot={{ r: 3, fill: '#2a3b2a' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
