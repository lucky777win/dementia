import { useRef, useState } from 'react';
import { IDENTITIES, type IdentityId } from '../data/demo';
import { IdCaregiver, IdFamily, IdSelf } from '../components/illustrations/Scenes';
import { Icon } from '../components/ui/Icon';
import { SectionHeading } from '../components/ui/SectionHeading';
import { cx } from '../lib/cx';

const ART = { self: IdSelf, family: IdFamily, caregiver: IdCaregiver } as const;

/** 身分選擇：選取後於下方展開該身分的服務入口（不需登入、可隨時切換）。 */
export function IdentitySection() {
  const [active, setActive] = useState<IdentityId | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = IDENTITIES.find((i) => i.id === active);

  const choose = (id: IdentityId) => {
    setActive(id);
    requestAnimationFrame(() => panelRef.current?.focus());
  };

  return (
    <section aria-labelledby="identity-title" className="mx-auto max-w-page px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-8">
      <SectionHeading id="identity-title" title="今天，您想為誰尋找協助？" desc="選擇最接近您的身分，我們會整理出適合的入口。不需要註冊或登入，也可以隨時切換。" />
      <ul className="grid gap-5 md:grid-cols-3">
        {IDENTITIES.map((it) => {
          const Art = ART[it.id];
          const on = active === it.id;
          return (
            <li key={it.id}>
              <article className={cx('flex h-full flex-col overflow-hidden rounded-lg border-2 bg-white transition-shadow',
                on ? 'border-brand shadow-lift' : 'border-transparent shadow-soft hover:shadow-lift')}>
                <div className="relative px-4 pt-4">
                  <Art className="block h-auto w-full rounded-md" />
                  {on && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-small font-bold text-white">
                      <Icon name="check" size={18} /> 目前選擇
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="flex items-center gap-2 text-h3"><Icon name={it.icon} className="text-warm-deep" /> {it.title}</h3>
                  <p className="mt-2 flex-1 text-body text-ink">{it.desc}</p>
                  <button type="button" onClick={() => choose(it.id)} aria-expanded={on} aria-controls="identity-panel"
                    className={cx('mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-body font-bold',
                      on ? 'bg-brand-tint text-brand ring-2 ring-brand' : 'bg-brand text-white hover:bg-brand-hover')}>
                    {on ? '已顯示下方入口' : '開始了解'} <Icon name={on ? 'chevronDown' : 'arrowRight'} size={22} />
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <div id="identity-panel" ref={panelRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {current && (
          <div className="mt-6 rounded-lg border-2 border-brand bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-small font-bold text-warm-deep">為「{current.title}」整理的入口</p>
                <h3 className="mt-1 text-h3">您可能想先看看</h3>
              </div>
              <a href={`#/identity/${current.id}`} className="inline-flex min-h-12 items-center gap-1 rounded-full px-4 font-bold text-brand underline underline-offset-4 hover:bg-sage-card">
                前往完整身分導覽 <Icon name="arrowRight" size={22} />
              </a>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <ul className="grid gap-3 sm:grid-cols-2">
                {current.entries.map((e) => (
                  <li key={e.label}>
                    <a href={e.href} className="flex min-h-14 items-center justify-between gap-2 rounded-md border-2 border-sage-line bg-sage px-4 text-body font-bold text-ink hover:border-brand hover:text-brand">
                      {e.label} <Icon name="chevronRight" className="shrink-0 text-brand" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="rounded-md bg-warm-soft p-5">
                <p className="mb-3 font-bold text-ink">常見的疑問</p>
                <ul className="space-y-2">
                  {current.questions.map((q) => (
                    <li key={q.label}>
                      <a href={q.href} className="flex gap-2 text-body text-ink underline decoration-warm-accent decoration-2 underline-offset-4 hover:text-brand">
                        <Icon name="info" size={22} className="mt-1 shrink-0 text-warm-deep" />{q.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-small text-ink-muted">點選問題可直接閱讀相關內容。內容取自憶起照顧雛型，尚未經專家覆核。</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
