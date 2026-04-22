import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

interface Common {
  variant?: Variant;
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

const base =
  'inline-flex items-center justify-center gap-2 font-sans tracking-[0.18em] uppercase text-[11px] font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap';

const sizeCls = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
};

const variantCls: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-soft',
  secondary: 'bg-forest text-paper hover:bg-forest-soft',
  outline: 'border border-ink/60 text-ink hover:bg-ink hover:text-paper',
  ghost: 'text-ink hover:text-forest',
  danger: 'border border-oxblood text-oxblood hover:bg-oxblood hover:text-paper',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${sizeCls[size]} ${variantCls[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: Common & { to: string }) {
  return (
    <Link to={to} className={`${base} ${sizeCls[size]} ${variantCls[variant]} ${className}`}>
      {children}
    </Link>
  );
}
