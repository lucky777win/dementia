import { useState } from 'react';
import { PLANS, PLAN_TITLES, type PlanId } from '../data/content';
import { Chip } from '../components/ui/Chip';
import { HotlineList } from '../components/ui/HotlineList';
import { Icon } from '../components/ui/Icon';
import { cx } from '../lib/cx';
import { Block, Bullets, PageShell, RefList } from './PageShell';

const PARTS = [['do', '要做什麼'], ['prep', '要準備什麼'], ['next', '接下來會發生什麼'], ['cost', '費用'], ['ask', '可以問的問題']] as const;

/** 找資源的行動計畫：步驟可逐一展開，依家中情況顯示額外提醒。 */
export function PlanPage({ id, sit }: { id: PlanId; sit?: string }) {
  const p = PLANS[id];
  const [open, setOpen] = useState<string | null>(p.steps[0].id);
  const [sits, setSits] = useState<Set<string>>(new Set(sit ? [sit] : []));
  const [copied, setCopied] = useState(false);
  const toggleSit = (s: string) => setSits((prev) => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });
  const copy = async () => { try { await navigator.clipboard.writeText(p.script.text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* 不支援時忽略 */ } };

  return (
    <PageShell crumbs={[{ label: '資源查詢', href: '#/resources' }, { label: PLAN_TITLES[id] }]} title={PLAN_TITLES[id]} lead={p.intro}
      badge="規則初稿・待個管師確認" meta={<>資料查證日期：{p.checked}。規定與金額可能調整，實際以照管中心與醫院說明為準。</>}
      aside={
        <>
          <Block title="相關專線" tone="warm"><HotlineList ids={p.hot} compact /></Block>
          <Block title="在臺中可以找"><Bullets items={p.local} icon="pin" /></Block>
          <Block title="其他行動計畫" tone="sage">
            {(Object.keys(PLANS) as PlanId[]).filter((k) => k !== id).map((k) => (
              <a key={k} href={`#/plan/${k}`} className="flex min-h-12 items-center justify-between gap-2 font-bold text-brand underline underline-offset-4">{PLAN_TITLES[k]}<Icon name="arrowRight" /></a>
            ))}
          </Block>
        </>
      }>
      <Block title="您的行動計畫">
        <ol className="space-y-3">
          {p.steps.map((s, i) => {
            const on = open === s.id;
            return (
              <li key={s.id} className={cx('rounded-lg border-2', on ? 'border-brand' : 'border-sage-line')}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : s.id)} className="flex min-h-16 w-full items-center gap-4 px-5 py-3 text-left">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-lead font-bold text-white">{i + 1}</span>
                  <span className="flex-1"><span className="block text-h3 text-brand">{s.h}</span>{s.when && <span className="block text-small text-warm-deep">{s.when}</span>}</span>
                  <span className="flex shrink-0 items-center gap-1 text-small font-bold text-brand">{on ? '收合' : '展開'}<Icon name="chevronDown" className={on ? 'rotate-180' : ''} /></span>
                </button>
                {on && (
                  <div className="space-y-5 border-t border-sage-line px-5 py-5">
                    {PARTS.map(([k, label]) => s[k] && (
                      <div key={k}><p className="mb-2 font-bold text-ink">{label}</p><Bullets items={s[k] as string[]} icon={k === 'ask' ? 'info' : 'check'} /></div>
                    ))}
                    {s.tip && <p className="flex gap-2 rounded-md bg-warm-soft p-4 text-body text-ink"><Icon name="info" className="mt-1 shrink-0 text-warm-deep" /><span><strong>小提醒：</strong>{s.tip}</span></p>}
                    {s.sites && <a href={`#/resources?kind=${s.sites}`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 font-bold text-white hover:bg-brand-hover"><Icon name="pin" size={22} />看臺中市的{s.sites === 'center' ? '共照中心' : '失智據點'}</a>}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </Block>

      <Block title="依您的情況，再多注意這些" tone="sage">
        <p className="mb-3 text-body text-ink">點選符合您家裡的情況：</p>
        <div className="flex flex-wrap gap-3">{p.sits.map((s) => <Chip key={s.id} selected={sits.has(s.id)} onClick={() => toggleSit(s.id)}>{s.label}</Chip>)}</div>
        {p.sits.filter((s) => sits.has(s.id)).map((s) => (
          <div key={s.id} className="mt-4 rounded-md bg-white p-5"><p className="mb-2 font-bold text-brand">{s.label}</p><Bullets items={s.tips} /></div>
        ))}
      </Block>

      <Block title={p.script.h} tone="warm">
        <blockquote className="rounded-md bg-white p-5 text-body text-ink">{p.script.text}</blockquote>
        <button type="button" onClick={copy} className="no-print mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand bg-white px-5 font-bold text-brand hover:bg-brand-tint">
          <Icon name={copied ? 'check' : 'clipboard'} size={22} />{copied ? '已複製' : '複製這段話'}
        </button>
      </Block>

      <Block title="參考來源" tone="sage"><RefList refs={p.refs} /></Block>
    </PageShell>
  );
}
