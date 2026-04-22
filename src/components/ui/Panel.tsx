import type { ReactNode } from 'react';

export function Panel({
  children,
  className = '',
  tone = 'paper',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'paper' | 'alt' | 'sunken' | 'ink' | 'forest';
}) {
  const toneCls = {
    paper: 'bg-paper border-divider text-ink',
    alt: 'bg-paper-alt border-divider text-ink',
    sunken: 'bg-paper-sunken border-divider-strong text-ink',
    ink: 'bg-ink border-ink text-paper',
    forest: 'bg-forest border-forest text-paper',
  }[tone];
  return <div className={`border ${toneCls} ${className}`}>{children}</div>;
}
