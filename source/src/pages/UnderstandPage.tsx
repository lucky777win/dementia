import { useState } from 'react';
import { LEARN, refName } from '../data/content';
import { HotlineList } from '../components/ui/HotlineList';
import { Icon } from '../components/ui/Icon';
import { cx } from '../lib/cx';
import { Block, Bullets, PageShell, RefList } from './PageShell';

const Refs = ({ codes }: { codes: string[] }) => <p className="mt-4 text-small text-ink-muted">出處：{codes.map(refName).join('；')}</p>;

const SECTIONS = [
  ['what', '失智症是什麼'], ['stats', '數字看失智'], ['causes', '病因'], ['types', '常見類型'], ['stages', '病程分級與照護'], ['young', '年輕型'],
] as const;

function svcHref(s: { go?: string; kind?: string; navr?: string; art?: string }) {
  if (s.art) return `#/article/${s.art}`;
  if (s.navr) return s.navr === 'r_site' ? '#/plan/day' : s.navr === 'r_diag' ? '#/plan/diag' : '#/plan/ltc';
  if (s.go === 'sites') return `#/resources?kind=${s.kind ?? ''}`;
  if (s.go === 'rest') return '#/caregiver';
  return '#/';
}

export function UnderstandPage() {
  const [openType, setOpenType] = useState<string | null>(LEARN.types[0].name);
  const [stage, setStage] = useState(0);
  const st = LEARN.stages[stage];
  const maxAge = Math.max(...LEARN.stats.ages.map(([, v]) => parseFloat(v)));

  return (
    <PageShell crumbs={[{ label: '認識失智症' }]} title={LEARN.title} lead={LEARN.lead} badge="一般衛教・尚未經專家覆核"
      meta={<>資料查證日期：{LEARN.checked}。內容為一般衛教，不能取代醫師診斷。</>}>
      <nav aria-label="本頁章節" className="no-print flex flex-wrap gap-2">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#/understand`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex min-h-12 items-center rounded-full border-2 border-sage-line bg-white px-5 font-bold text-ink hover:border-brand hover:text-brand">{label}</a>
        ))}
      </nav>

      <Block id="what" title="失智症是什麼">
        <p className="text-body text-ink">{LEARN.what}</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-body">
            <caption className="mb-3 text-left font-bold text-ink">正常老化和失智症怎麼分</caption>
            <thead><tr className="bg-sage-card"><th scope="col" className="rounded-tl-md p-3 text-brand">正常老化</th><th scope="col" className="rounded-tr-md p-3 text-brand">失智症</th></tr></thead>
            <tbody>
              {LEARN.compare.map(([a, b]) => (
                <tr key={a} className="border-b border-sage-line"><td className="p-3 align-top text-ink">{a}</td><td className="p-3 align-top text-ink">{b}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 rounded-md bg-warm-soft p-5">
          <p className="mb-1 font-bold text-ink">輕度認知障礙（MCI）</p>
          <p className="text-body text-ink">{LEARN.mci}</p>
        </div>
        <Refs codes={LEARN.whatRef} />
      </Block>

      <Block id="stats" title="數字看失智">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEARN.stats.cards.map((c) => (
            <li key={c.d} className="rounded-md bg-sage p-5"><p className="text-h2 text-brand">{c.n}</p><p className="mt-1 text-small text-ink">{c.d}</p></li>
          ))}
        </ul>
        <p className="mb-3 mt-6 font-bold text-ink">65 歲以上各年齡層的失智症盛行率：年紀愈大愈高</p>
        <ul className="space-y-2">
          {LEARN.stats.ages.map(([age, v]) => (
            <li key={age} className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-3 text-body">
              <span className="text-ink">{age}</span>
              <span className="h-5 rounded-full bg-sage-card"><span className="block h-5 rounded-full bg-brand" style={{ width: `${(parseFloat(v) / maxAge) * 100}%` }} /></span>
              <span className="text-right font-bold text-brand">{v}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-body text-ink">{LEARN.stats.world}</p>
        <Refs codes={LEARN.stats.ref} />
      </Block>

      <Block id="causes" title="病因：大致分成三類">
        <div className="grid gap-4 lg:grid-cols-3">
          {LEARN.causes.map((c) => (
            <div key={c.h} className="rounded-md bg-sage p-5">
              <p className="text-h3 text-brand">{c.h}</p>
              <p className="mt-2 text-body text-ink">{c.p}</p>
              {c.items && <div className="mt-3"><Bullets items={c.items} icon="chevronRight" /></div>}
            </div>
          ))}
        </div>
        <Refs codes={LEARN.causeRef} />
        <div className="mt-6 rounded-md bg-warm-soft p-5">
          <p className="mb-2 font-bold text-ink">可以降低的風險</p>
          <p className="text-body text-ink">{LEARN.risk.p}</p>
          <ul className="mt-3 flex flex-wrap gap-2">{LEARN.risk.items.map((r) => <li key={r} className="rounded-full bg-white px-4 py-1.5 text-body text-ink">{r}</li>)}</ul>
          <Refs codes={LEARN.risk.ref} />
        </div>
      </Block>

      <Block id="types" title="常見類型：各有不同的早期表現">
        <p className="mb-4 text-body text-ink-muted">點開各類型看詳細說明。實際診斷請由神經科或精神科醫師判定。</p>
        <ul className="space-y-3">
          {LEARN.types.map((t) => {
            const on = openType === t.name;
            return (
              <li key={t.name} className={cx('rounded-lg border-2', on ? 'border-brand' : 'border-sage-line')}>
                <button type="button" aria-expanded={on} onClick={() => setOpenType(on ? null : t.name)}
                  className="flex min-h-16 w-full items-center justify-between gap-3 px-5 py-3 text-left">
                  <span><span className="block text-h3 text-brand">{t.name}</span><span className="block text-small text-warm-deep">{t.tag}</span></span>
                  <span className="flex shrink-0 items-center gap-1 text-small font-bold text-brand">{on ? '收合' : '展開'}<Icon name="chevronDown" className={on ? 'rotate-180' : ''} /></span>
                </button>
                {on && (
                  <div className="grid gap-5 border-t border-sage-line px-5 py-5 md:grid-cols-2">
                    <div><p className="mb-1 font-bold text-ink">最早出現</p><p className="text-body text-ink">{t.first}</p></div>
                    <div><p className="mb-1 font-bold text-ink">病程變化</p><p className="text-body text-ink">{t.course}</p></div>
                    <div><p className="mb-2 font-bold text-ink">常見伴隨症狀</p><Bullets items={t.signs} icon="chevronRight" /></div>
                    <div className="rounded-md bg-sage p-4"><p className="mb-2 font-bold text-ink">照顧時特別注意</p><Bullets items={t.care} /></div>
                    <div className="md:col-span-2"><Refs codes={t.ref} /></div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Block>

      <Block id="stages" title="病程分級：每一期的表現與照護重點">
        <p className="mb-4 text-body text-ink">醫師常用「臨床失智評估量表（CDR）」判斷程度。點選一期查看：</p>
        <div role="tablist" aria-label="病程分級" className="flex flex-wrap gap-2">
          {LEARN.stages.map((s, i) => (
            <button key={s.cdr} role="tab" type="button" aria-selected={stage === i} onClick={() => setStage(i)}
              className={cx('inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-5 font-bold', stage === i ? 'border-brand bg-brand text-white' : 'border-sage-line bg-white text-ink hover:border-brand')}>
              {stage === i && <Icon name="check" size={20} />}{s.label}<span className="text-small font-medium opacity-90">CDR {s.cdr}</span>
            </button>
          ))}
        </div>
        <div role="tabpanel" className="mt-5 rounded-lg border-2 border-brand p-5 md:p-6">
          <p className="text-h3 text-brand">{st.label}（CDR {st.cdr}）</p>
          <p className="mt-2 text-body text-ink">{st.summary}</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div><p className="mb-2 font-bold text-ink">常見表現</p><Bullets items={st.signs} icon="chevronRight" /></div>
            <div className="rounded-md bg-sage p-4"><p className="mb-2 font-bold text-ink">照護重點</p><Bullets items={st.care} /></div>
          </div>
          {st.svc.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 font-bold text-ink">可以找的服務</p>
              <div className="flex flex-wrap gap-2">
                {st.svc.map((s) => <a key={s.label} href={svcHref(s)} className="inline-flex min-h-12 items-center gap-1 rounded-full border-2 border-brand bg-white px-5 font-bold text-brand hover:bg-brand-tint">{s.label}<Icon name="arrowRight" size={20} /></a>)}
              </div>
            </div>
          )}
          <Refs codes={st.ref} />
        </div>
        <p className="mt-4 text-body text-ink">{LEARN.stageNote}</p>
      </Block>

      <Block id="young" title={LEARN.young.h}>
        <Bullets items={LEARN.young.items} icon="chevronRight" />
        <Refs codes={LEARN.young.ref} />
        <div className="mt-5"><HotlineList ids={['dem']} compact /></div>
      </Block>

      <Block title="參考來源" tone="sage">
        <RefList refs={LEARN.refs} />
      </Block>
    </PageShell>
  );
}
