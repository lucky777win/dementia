import { useEffect, useRef, useState } from 'react';
import { NAV } from '../../data/demo';
import type { FontScale } from '../../lib/fontScale';
import { cx } from '../../lib/cx';
import { Icon } from '../ui/Icon';
import { FontSizeSwitch } from './FontSizeSwitch';
import { Logo } from './Logo';

const MORE_LINKS = [
  { href: '#/identity', label: '身分導覽' },
  { href: '#/stages', label: '四階段服務導覽' },
  { href: '#/search', label: '情境式問題查詢' },
  { href: '#/scenarios', label: '照護情境專區' },
  { href: '#/about', label: '平台介紹與資料來源' },
];

export function Header({ route, scale, onScale }: { route: string; scale: FontScale; onScale: (v: FontScale) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [route]);
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const isCurrent = (href: string) => (href === '#/' ? route === '/' : route.startsWith(href.slice(1)));

  return (
    <header className="no-print sticky top-0 z-40 border-b border-sage-line bg-sage/95 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a href="#/" aria-label="憶起照顧 回首頁" className="shrink-0 rounded-md"><Logo /></a>

        <nav aria-label="主要選單" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={isCurrent(n.href) ? 'page' : undefined}
                  className={cx('flex min-h-12 items-center rounded-full px-3 text-body font-bold xl:px-4',
                    isCurrent(n.href) ? 'bg-brand-tint text-brand underline decoration-2 underline-offset-8' : 'text-ink hover:bg-sage-card hover:text-brand')}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block"><FontSizeSwitch value={scale} onChange={onScale} /></div>
          <button ref={btnRef} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="site-menu"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand bg-white px-4 font-bold text-brand hover:bg-brand-tint">
            <Icon name="menu" size={24} /> <span>選單</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="網站選單">
          <button type="button" aria-label="關閉選單" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} tabIndex={-1} />
          <div ref={panelRef} id="site-menu" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-sage shadow-lift">
            <div className="flex items-center justify-between border-b border-sage-line px-5 py-4">
              <p className="text-h3 text-brand">網站選單</p>
              <button type="button" onClick={() => { setOpen(false); btnRef.current?.focus(); }}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-4 font-bold text-brand hover:bg-brand-tint">
                <Icon name="close" /> 關閉
              </button>
            </div>
            <div className="border-b border-sage-line px-5 py-5">
              <FontSizeSwitch value={scale} onChange={onScale} full />
            </div>
            <nav aria-label="完整選單" className="px-3 py-4">
              <ul className="space-y-1">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} aria-current={isCurrent(n.href) ? 'page' : undefined}
                      className={cx('flex min-h-14 items-center justify-between rounded-md px-4 text-lead font-bold',
                        isCurrent(n.href) ? 'bg-brand-tint text-brand' : 'text-ink hover:bg-white')}>
                      {n.label} <Icon name="chevronRight" className="text-brand" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mb-2 mt-6 px-4 text-small font-bold text-ink-muted">更多服務</p>
              <ul className="space-y-1">
                {MORE_LINKS.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="flex min-h-12 items-center justify-between rounded-md px-4 text-body text-ink hover:bg-white">
                      {n.label} <Icon name="chevronRight" size={20} className="text-brand" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
