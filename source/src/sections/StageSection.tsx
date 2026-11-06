import { useRef, useState } from 'react';
import { STAGES, type StageId } from '../data/demo';
import { StageAware, StageCare, StageClinic, StageCompanion } from '../components/illustrations/Scenes';
import { Icon } from '../components/ui/Icon';
import { SectionHeading } from '../components/ui/SectionHeading';
import { cx } from '../lib/cx';

const ART = { aware: StageAware, clinic: StageClinic, care: StageCare, companion: StageCompanion } as const;

/** 四階段服務導覽：卡片可任意點選，不需依序；詳細主題於下方面板展開。 */
export function StageSection() {
  const [active, setActive] = useState<StageId | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cur = STAGES.find((s) => s.id === active);
  const toggle = (id: StageId) => {
    const next = active === id ? null : id;
    setActive(next);
    if (next) requestAnimationFrame(() => panelRef.current?.focus());
  };

  return (
    <section id="stages" aria-labelledby="stages-title" className="mx-auto max-w-page scroll-mt-28 px-4 py-12 md:px-8 md:py-16">
      <SectionHeading id="stages-title" title="依照您的需要，從任何一步開始" desc="我們把資訊整理成四個主題階段。您不需要依序閱讀，直接選擇現在最關心的即可。" />
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((s) => {
          const Art = ART[s.id];
          const on = active === s.id;
          return (
            <li key={s.id}>
              <article className={cx('flex h-full flex-col rounded-lg border-2 bg-white p-5 transition-shadow',
                on ? 'border-brand shadow-lift' : 'border-transparent shadow-soft hover:shadow-lift')}>
                <Art className="block h-auto w-full rounded-md" />
                <p className="mt-4 flex items-center gap-2 text-small font-bold text-warm-deep">
                  <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-warm px-2 text-ink">{s.no}</span> 階段 {s.no}
                </p>
                <h3 className="mt-2 text-h3">{s.title}</h3>
                <p className="mt-2 rounded-md bg-sage px-3 py-2 text-body font-medium text-ink">「{s.question}」</p>
                <p className="mt-3 flex-1 text-body text-ink">{s.desc}</p>
                <button type="button" onClick={() => toggle(s.id)} aria-expanded={on} aria-controls="stage-panel"
                  className={cx('mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 px-5 font-bold',
                    on ? 'border-brand bg-brand text-white' : 'border-brand bg-white text-brand hover:bg-brand-tint')}>
                  {on ? '收合相關資訊' : '查看相關資訊'} <Icon name="chevronDown" size={22} className={on ? 'rotate-180' : ''} />
                </button>
              </article>
            </li>
          );
        })}
      </ol>

      <div id="stage-panel" ref={panelRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {cur && (
          <div className="mt-6 grid gap-6 rounded-lg border-2 border-brand bg-white p-6 md:grid-cols-[1fr_2fr] md:p-8">
            <div>
              <p className="text-small font-bold text-warm-deep">階段 {cur.no}</p>
              <h3 className="mt-1 text-h2">{cur.title}</h3>
              <p className="mt-3 text-body text-ink">{cur.desc}</p>
              <a href={`#/stage/${cur.id}`} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 font-bold text-white hover:bg-brand-hover">
                進入此階段導覽 <Icon name="arrowRight" size={22} />
              </a>
            </div>
            <div>
              <p className="mb-3 font-bold text-ink">相關主題</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {cur.topics.map((t) => (
                  <li key={t.label}>
                    <a href={t.href} className="flex min-h-14 items-center justify-between gap-2 rounded-md border-2 border-sage-line bg-sage px-4 font-bold text-ink hover:border-brand hover:text-brand">
                      {t.label} <Icon name="chevronRight" className="shrink-0 text-brand" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <p className="mt-6 flex items-start gap-2 text-small text-ink-muted">
        <Icon name="info" size={20} className="mt-0.5 shrink-0" /> 四個階段是資訊的分類方式，方便您找到需要的內容，並不代表醫療上的病程判定。
      </p>
    </section>
  );
}
