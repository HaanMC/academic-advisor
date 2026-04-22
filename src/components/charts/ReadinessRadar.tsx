import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { useLocale } from '../../hooks/useLocale';

export function ReadinessRadar({ data }: { data: Array<{ key: string; score: number }> }) {
  const { t } = useLocale();
  const dims = t.dashboard.dimensions as Record<string, string>;
  const chartData = data.map((d) => ({ dim: dims[d.key] ?? d.key, score: d.score }));
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="#cfc8b9" strokeDasharray="2 3" />
          <PolarAngleAxis
            dataKey="dim"
            tick={{ fill: '#4c4944', fontSize: 10, fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}
          />
          <Radar dataKey="score" stroke="#2a3b2a" fill="#2a3b2a" fillOpacity={0.12} strokeWidth={1.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
