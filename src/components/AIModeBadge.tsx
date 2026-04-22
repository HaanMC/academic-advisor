import { aiStatus } from '../lib/ai/actions';
import { useLocale } from '../hooks/useLocale';

export function AIModeBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useLocale();
  const status = aiStatus();
  const isMock = status.mode === 'mock';

  const label = isMock ? t.aiMode.local : t.aiMode.server;
  const detail = isMock ? t.aiMode.localDetail : t.aiMode.serverDetail;

  if (compact) {
    return (
      <span
        aria-label={label}
        title={detail}
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-bronze"
      >
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${isMock ? 'bg-bronze' : 'bg-forest'}`} />
        {label}
      </span>
    );
  }

  return (
    <div className="inline-flex items-start gap-3 border border-divider bg-paper-alt px-4 py-3 max-w-md">
      <span className={`mt-1.5 inline-block w-1.5 h-1.5 rounded-full ${isMock ? 'bg-bronze' : 'bg-forest'}`} />
      <div className="space-y-1">
        <div className="eyebrow text-ink">{label}</div>
        <p className="text-xs text-slate font-light leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}
