import { useRef, useState } from 'react';
import { QUICK_TAGS } from '../data/demo';
import { LEARN, PLANS, PLAN_TITLES, answer, articleSources, type Answer } from '../data/content';
import type { SimMode } from '../components/layout/PrototypeBar';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { HotlineList } from '../components/ui/HotlineList';
import { Icon } from '../components/ui/Icon';
import { ResultCard } from '../components/ui/ResultCard';
import { SearchField } from '../components/ui/SearchField';
import { SectionHeading } from '../components/ui/SectionHeading';
import { StateView } from '../components/ui/StateView';
import { simulate } from '../lib/simulate';

type Status = 'idle' | 'loading' | 'done' | 'error';
const REVIEW = '尚未經專家覆核';

function Results({ a }: { a: Extract<Answer, { kind: 'results' }> }) {
  const total = (a.learn ? 1 : 0) + a.plans.length + a.articles.length;
  return (
    <div>
      <p className="mb-4 text-body text-ink"><strong className="text-brand">找到 {total} 篇相關內容</strong></p>
      <ul className="space-y-4">
        {a.articles.map((r) => (
          <li key={r.id}>
            <ResultCard demo statusLabel={REVIEW} question={r.title} summary={r.sum} category={`照顧文章・${r.cat}`}
              articleTitle={r.title} source={[r.src, ...articleSources(r)].join('；')} updatedAt={REVIEW} href={`#/article/${r.id}`} />
          </li>
        ))}
        {a.plans.map((id) => (
          <li key={id}>
            <ResultCard demo statusLabel="規則初稿・待個管師確認" question={PLAN_TITLES[id]} summary={PLANS[id].intro} category="找資源・行動計畫"
              articleTitle={PLAN_TITLES[id]} source={`${PLANS[id].refs[0].name} 等 ${PLANS[id].refs.length} 份官方資料`} updatedAt={`資料查證 ${PLANS[id].checked}`} href={`#/plan/${id}`} />
          </li>
        ))}
        {a.learn && (
          <li>
            <ResultCard demo statusLabel={REVIEW} question={LEARN.title} summary={LEARN.lead} category="認識失智症"
              articleTitle={LEARN.title} source={`${LEARN.refs[0].name} 等 ${LEARN.refs.length} 份資料`} updatedAt={`資料查證 ${LEARN.checked}`} href="#/understand" />
          </li>
        )}
      </ul>
    </div>
  );
}

export function QuickSearch({ sim }: { sim: SimMode }) {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<Answer | null>(null);
  const [lastQ, setLastQ] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const run = (term: string, display = term) => {
    if (!term) return;
    setLastQ(display);
    setStatus('loading');
    resultsRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    simulate(sim, () => (sim === 'empty' ? ({ kind: 'none', pii: [] } as Answer) : answer(term)))
      .then((r) => { setResult(r); setStatus('done'); })
      .catch(() => setStatus('error'));
  };

  const pickTag = (t: (typeof QUICK_TAGS)[number]) => { setTag(t.label); setQ(t.label); run(t.q, t.label); };

  return (
    <section id="quick-search" aria-labelledby="search-title" className="scroll-mt-28 bg-white/60 py-12 md:py-16">
      <div className="mx-auto max-w-page px-4 md:px-8">
        <SectionHeading id="search-title" title="您目前遇到什麼問題？" desc="用自己的話輸入就可以，或點選下方常見的問題。" />
        <div className="max-w-4xl">
          <SearchField label="輸入您想了解的問題或關鍵字" placeholder="例如：媽媽一直問同一件事怎麼辦" value={q}
            onChange={(v) => { setQ(v); setTag(null); }} onSubmit={(v) => run(v)} />
          <div className="mt-5">
            <p id="tags-label" className="mb-3 text-body font-bold text-ink">常見問題</p>
            <div role="group" aria-labelledby="tags-label" className="flex flex-wrap gap-3">
              {QUICK_TAGS.map((t) => <Chip key={t.label} selected={tag === t.label} onClick={() => pickTag(t)}>{t.label}</Chip>)}
            </div>
          </div>
          <p className="mt-5 flex items-start gap-2 text-small text-ink-muted">
            以關鍵字比對照顧文章與行動計畫，不以 AI 自動產生醫療建議。請不要輸入姓名、電話、身分證字號。
          </p>
        </div>

        <div ref={resultsRef} className="mt-8 max-w-4xl scroll-mt-28" aria-live="polite">
          {status === 'loading' && <StateView state="loading" title="正在為您查詢…">請稍候，我們正在比對照顧文章與資源。</StateView>}
          {status === 'error' && (
            <StateView state="error" title="暫時無法完成查詢" action={<Button icon="refresh" onClick={() => run(lastQ)}>再試一次</Button>}>
              可能是網路連線不穩定。您輸入的內容已保留，可以直接再試一次。
            </StateView>
          )}
          {status === 'done' && result && result.pii.length > 0 && (
            <p role="alert" className="mb-4 flex items-start gap-2 rounded-md border-2 border-warm-accent bg-warm-soft px-4 py-3 text-body text-ink">
              <Icon name="alert" className="mt-0.5 shrink-0 text-warm-deep" /> 提醒：訊息裡有{result.pii.join('、')}，請不要輸入個人資料。
            </p>
          )}
          {status === 'done' && result?.kind === 'safety' && (
            <div role="alert" className="rounded-lg border-2 border-warm-accent bg-warm-soft p-6 md:p-8">
              <p className="flex items-center gap-2 text-lead font-bold text-ink"><Icon name="heart" className="text-warm-deep" /> 您不是一個人</p>
              <div className="mt-3 space-y-2 text-body text-ink">{result.reply.split('\n').map((l) => <p key={l}>{l}</p>)}</div>
              <HotlineList ids={result.hot} className="mt-5" />
              <p className="mt-4 text-small text-ink-muted">這類訊息固定回覆專線，不以 AI 自由回答。</p>
            </div>
          )}
          {status === 'done' && result?.kind === 'none' && (
            <StateView state="empty" title={`目前還沒有「${lastQ}」的覆核文章`}
              action={<><Button variant="secondary" onClick={() => { setQ(''); setTag(null); setStatus('idle'); }}>換個說法再找</Button><a href="#stages" className="inline-flex min-h-12 items-center rounded-full bg-sage-card px-6 font-bold text-brand hover:bg-brand-tint">從四個階段瀏覽</a></>}>
              目前還沒有專家覆核過、能回答這個問題的文章。您可以打失智症關懷專線問問看，我們也會把這個問題交給專家補充。
              <HotlineList ids={['dem']} compact className="mx-auto mt-4 max-w-md text-left" />
            </StateView>
          )}
          {status === 'done' && result?.kind === 'results' && <Results a={result} />}
        </div>
      </div>
    </section>
  );
}
