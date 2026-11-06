import { useState } from 'react';
import { NAV } from '../data/content';
import type { SimMode } from '../components/layout/PrototypeBar';
import { Icon } from '../components/ui/Icon';
import { ResourceFinder } from '../sections/ResourceFinder';
import { Block, PageShell } from './PageShell';

/** 回答 3 個問題，導到對應的行動計畫（規則取自雛型，待個管師確認） */
function Navigator() {
  const [path, setPath] = useState<string[]>(['q1']);
  const cur = NAV[path[path.length - 1]];
  const step = cur.step ?? 0;
  if (!cur.q) {
    const href = `#/plan/${cur.plan}${cur.sit?.length ? `?sit=${cur.sit[0]}` : ''}`;
    return (
      <div className="rounded-lg border-2 border-brand bg-white p-6">
        <p className="text-small font-bold text-warm-deep">建議的下一步</p>
        <p className="mt-1 text-h3 text-brand">{cur.title}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={href} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 font-bold text-white hover:bg-brand-hover">看完整計畫 <Icon name="arrowRight" size={22} /></a>
          <button type="button" onClick={() => setPath(['q1'])} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand px-6 font-bold text-brand hover:bg-brand-tint"><Icon name="refresh" size={22} />重新回答</button>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg border-2 border-sage-line bg-white p-6" aria-live="polite">
      <p className="text-small font-bold text-warm-deep">第 {step} 題，共 3 題以內</p>
      <p className="mt-1 text-h3 text-brand">{cur.q}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {cur.opts!.map(([label, next]) => (
          <button key={label} type="button" onClick={() => setPath([...path, next])} className="flex min-h-14 items-center justify-between gap-2 rounded-md border-2 border-sage-line bg-sage px-5 text-left font-bold text-ink hover:border-brand hover:text-brand">
            {label}<Icon name="chevronRight" className="shrink-0 text-brand" />
          </button>
        ))}
      </div>
      {path.length > 1 && <button type="button" onClick={() => setPath(path.slice(0, -1))} className="mt-4 inline-flex min-h-12 items-center gap-1 font-bold text-brand underline underline-offset-4">上一題</button>}
    </div>
  );
}

export function ResourcesPage({ sim, kind, view }: { sim: SimMode; kind?: string; view?: string }) {
  return (
    <PageShell crumbs={[{ label: '資源查詢' }]} title="尋找您需要的照護資源" badge="規則初稿・待個管師確認"
      lead="回答 3 個問題，知道去哪裡檢查、可以找誰幫忙；也可以依縣市查詢全台的共照中心、失智據點與團體家屋，清單和地圖可以對照看。">
      <Block title="回答 3 個問題，找到下一步"><Navigator /></Block>
      <Block title="全台失智照護服務地點" tone="sage"><ResourceFinder sim={sim} initialKind={kind} initialCounty={kind ? '臺中市' : ''} initialView={view === 'map' ? 'map' : 'list'} autoRun embedded /></Block>
    </PageShell>
  );
}
