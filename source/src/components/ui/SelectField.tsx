import { useId, type SelectHTMLAttributes } from 'react';
import { cx } from '../../lib/cx';
import { Icon } from './Icon';

export type Option = { value: string; label: string };

/** 下拉選單：標籤永遠顯示在欄位上方，錯誤訊息以圖示＋文字呈現。 */
export function SelectField({ label, options, placeholder, error, hint, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: Option[]; placeholder?: string; error?: string; hint?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-body font-bold text-ink">{label}</label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          {...rest}
          className={cx(
            'min-h-14 w-full appearance-none rounded-md border-2 bg-white py-3 pl-4 pr-12 text-body text-ink disabled:bg-sage disabled:text-ink-muted',
            error ? 'border-warm-deep' : 'border-sage-line hover:border-brand',
          )}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="chevronDown" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand" />
      </div>
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-small text-ink-muted">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-small font-medium text-warm-deep">
          <Icon name="alert" size={20} /> {error}
        </p>
      )}
    </div>
  );
}
