import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldBase {
  label: string;
  help?: string;
  optional?: boolean;
}

export function TextField({
  label,
  help,
  optional,
  ...rest
}: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-2">
      <span className="eyebrow">{label}{optional ? ' · optional' : ''}</span>
      <input
        {...rest}
        className={`w-full bg-transparent border-b border-divider py-3 text-lg font-serif focus:outline-none focus:border-forest placeholder:text-ink/25 ${rest.className ?? ''}`}
      />
      {help ? <span className="block text-xs text-slate font-light leading-relaxed">{help}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  help,
  optional,
  rows = 4,
  ...rest
}: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block space-y-2">
      <span className="eyebrow">{label}{optional ? ' · optional' : ''}</span>
      <textarea
        rows={rows}
        {...rest}
        className={`w-full bg-paper border border-divider py-3 px-4 font-serif text-base leading-relaxed focus:outline-none focus:border-forest placeholder:text-ink/25 ${rest.className ?? ''}`}
      />
      {help ? <span className="block text-xs text-slate font-light leading-relaxed">{help}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  help,
  optional,
  options,
  value,
  onChange,
  placeholder,
}: FieldBase & {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="eyebrow">{label}{optional ? ' · optional' : ''}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-divider py-3 text-lg font-serif focus:outline-none focus:border-forest"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {help ? <span className="block text-xs text-slate font-light leading-relaxed">{help}</span> : null}
    </label>
  );
}
