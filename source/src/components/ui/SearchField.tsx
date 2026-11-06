import { useId, type FormEvent } from 'react';
import { Icon } from './Icon';

/** 大型搜尋框：可見標籤、清除鈕、帶文字的送出按鈕。 */
export function SearchField({ label, value, onChange, onSubmit, placeholder }: { label: string; value: string; onChange: (v: string) => void; onSubmit: (v: string) => void; placeholder?: string }) {
  const id = useId();
  const submit = (e: FormEvent) => { e.preventDefault(); onSubmit(value.trim()); };
  return (
    <form role="search" onSubmit={submit} className="w-full">
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="flex flex-col gap-3 rounded-lg border-2 border-sage-line bg-white p-2 shadow-soft focus-within:border-brand sm:flex-row sm:items-center">
        <div className="relative flex flex-1 items-center">
          <Icon name="search" className="pointer-events-none absolute left-4 text-brand" size={26} />
          <input
            id={id}
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-14 w-full rounded-md bg-transparent pl-14 pr-12 text-lead text-ink placeholder:text-ink-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <button type="button" onClick={() => onChange('')} className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:bg-sage-card hover:text-brand" aria-label="清除輸入內容">
              <Icon name="close" size={22} />
            </button>
          )}
        </div>
        <button type="submit" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-brand px-8 text-lead font-bold text-white hover:bg-brand-hover">
          <Icon name="search" size={22} /> 查詢
        </button>
      </div>
    </form>
  );
}
