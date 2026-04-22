export function Timeline({ items }: { items: Array<{ title: string; date: string; state: 'done' | 'now' | 'soon' }> }) {
  return (
    <ol className="relative border-l border-divider-strong pl-6 space-y-5">
      {items.map((it, i) => {
        const tone =
          it.state === 'done'
            ? 'bg-forest'
            : it.state === 'now'
            ? 'bg-bronze'
            : 'bg-ink/20';
        return (
          <li key={i} className="relative">
            <span className={`absolute -left-[31px] top-1.5 w-2 h-2 rounded-full ${tone}`} aria-hidden />
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <p className="text-sm font-serif text-ink">{it.title}</p>
              <span className="text-[11px] uppercase tracking-[0.2em] text-bronze">{it.date}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
