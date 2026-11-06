import type { ReactNode } from 'react';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { cx } from '../lib/cx';

/** 內頁共用外框：麵包屑、標題、狀態標籤、導言與列印按鈕。 */
export function PageShell({ crumbs, title, lead, badge, meta, children, aside }: {
  crumbs: { label: string; href?: string }[]; title: string; lead?: ReactNode; badge?: string; meta?: ReactNode; children: ReactNode; aside?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-page px-4 py-8 md:px-8 md:py-12">
      <nav aria-label="導覽路徑" className="no-print mb-6 text-small text-ink">
        <ol className="flex flex-wrap items-center gap-1">
          <li><a href="#/" className="font-bold text-brand underline underline-offset-4">首頁</a></li>
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-1">
              <Icon name="chevronRight" size={18} aria-hidden="true" />
              {c.href && i < crumbs.length - 1 ? <a href={c.href} className="font-bold text-brand underline underline-offset-4">{c.label}</a> : <span aria-current="page">{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <header className="rounded-xl bg-white p-6 shadow-soft md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          {badge ? <Badge tone="demo">{badge}</Badge> : <span />}
          <button type="button" onClick={() => window.print()} className="no-print inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-sage-line bg-white px-4 font-bold text-brand hover:border-brand">
            <Icon name="printer" size={22} /> 列印本頁
          </button>
        </div>
        <h1 className="mt-4 text-h1">{title}</h1>
        {lead && <p className="mt-4 max-w-3xl text-lead text-ink">{lead}</p>}
        {meta && <div className="mt-4 text-small text-ink-muted">{meta}</div>}
      </header>
      <div className={cx('mt-8 grid gap-8', !!aside && 'lg:grid-cols-[1fr_320px]')}>
        <div className="min-w-0 space-y-6">{children}</div>
        {aside && <aside className="space-y-6">{aside}</aside>}
      </div>
    </div>
  );
}

/** 內容區塊卡 */
export function Block({ title, id, children, tone = 'white' }: { title?: ReactNode; id?: string; children: ReactNode; tone?: 'white' | 'warm' | 'sage' }) {
  return (
    <section id={id} aria-labelledby={id && title ? `${id}-h` : undefined}
      className={cx('scroll-mt-28 rounded-lg p-6 md:p-8', tone === 'white' && 'bg-white shadow-soft', tone === 'warm' && 'bg-warm-soft', tone === 'sage' && 'bg-sage-card')}>
      {title && <h2 id={id ? `${id}-h` : undefined} className="mb-4 text-h3">{title}</h2>}
      {children}
    </section>
  );
}

export function Bullets({ items, icon = 'check' }: { items: string[]; icon?: 'check' | 'info' | 'chevronRight' | 'pin' }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex gap-2 text-body text-ink"><Icon name={icon} size={22} className="mt-1 shrink-0 text-brand" /><span>{t}</span></li>
      ))}
    </ul>
  );
}

export function RefList({ refs }: { refs: { name: string; url?: string; date?: string }[] }) {
  return (
    <ol className="list-decimal space-y-2 pl-6 text-body text-ink">
      {refs.map((r) => (
        <li key={r.name}>
          {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-4">{r.name}</a> : r.name}
          {r.date && <span className="ml-2 text-small text-ink-muted">（{r.date}）</span>}
        </li>
      ))}
    </ol>
  );
}
