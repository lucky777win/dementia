import { useState } from 'react';
import { CARDS, PLANNED } from '../data/content';
import { Badge } from '../components/ui/Badge';
import { HotlineList } from '../components/ui/HotlineList';
import { Icon } from '../components/ui/Icon';
import { Block, PageShell } from './PageShell';

const tiredMsg = (v: number) => v >= 7
  ? '您已經很累了。請考慮申請喘息服務，讓別人接手幾天；也可以先打電話和人聊聊。'
  : v >= 4 ? '累是正常的。這週試著排一段完全屬於自己的時間，或找家人輪替一個晚上。'
  : '今天狀態還可以。記得照顧別人的同時，也吃飽、睡好。';

export function CaregiverPage() {
  const dayIdx = Math.floor(Date.now() / 86400000) % CARDS.length;
  const [card, setCard] = useState(dayIdx);
  const [tired, setTired] = useState(5);
  const carer = PLANNED.find((g) => g.g === '照顧者');
  return (
    <PageShell crumbs={[{ label: '照顧者支持' }]} title="喘口氣：照顧者支持專區" lead="照顧是長期的事。累的時候可以打家庭照顧者關懷專線，或向 1966 申請喘息服務。">
      <Block title="今天的小語" tone="warm">
        <p className="text-h2 font-medium text-ink">「{CARDS[card]}」</p>
        <button type="button" onClick={() => setCard((card + 1) % CARDS.length)} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand bg-white px-5 font-bold text-brand hover:bg-brand-tint">
          <Icon name="refresh" size={22} />換一張
        </button>
      </Block>

      <Block title="今天有多累？">
        <Badge tone="demo">示意用的 0–10 分，正式量表授權確認中</Badge>
        <label htmlFor="tired" className="mt-4 block font-bold text-ink">疲累程度：<span className="text-h3 text-brand">{tired}</span> 分</label>
        <input id="tired" type="range" min={0} max={10} value={tired} onChange={(e) => setTired(Number(e.target.value))} className="mt-3 h-3 w-full cursor-pointer accent-[#276B59]" />
        <div className="mt-1 flex justify-between text-small text-ink-muted"><span>0 還好</span><span>5</span><span>10 撐不住</span></div>
        <p aria-live="polite" className="mt-4 rounded-md bg-sage p-4 text-body text-ink">{tiredMsg(tired)}</p>
      </Block>

      <Block title="可以打電話聊聊" tone="sage"><HotlineList ids={['fam', '1966', 'dem', '1925']} /></Block>

      <Block title="讓別人接手一下">
        <ul className="space-y-3">
          {[
            ['#/plan/ltc', '申請長照與喘息服務', '打 1966 申請評估，喘息服務每年有額度可用。'],
            ['#/plan/day?sit=carer', '白天可以去的地方', '失智據點有課程與照顧者支持團體，臺中市也有 9 處家庭照顧者支持服務據點。'],
            ['#/article/talk', '和失智家人說話的方法', '不糾正、不爭辯，一次說一件事，溝通會輕鬆很多。'],
          ].map(([href, t, d]) => (
            <li key={href}>
              <a href={href} className="flex min-h-14 items-center justify-between gap-3 rounded-md border-2 border-sage-line bg-white px-4 py-3 hover:border-brand">
                <span><span className="block font-bold text-ink">{t}</span><span className="block text-small text-ink-muted">{d}</span></span>
                <Icon name="chevronRight" className="shrink-0 text-brand" />
              </a>
            </li>
          ))}
        </ul>
      </Block>

      {carer && (
        <Block title="規劃中的照顧者主題" tone="sage">
          <ul className="space-y-2">{carer.items.map((i) => <li key={i} className="flex items-center gap-2 text-body text-ink"><Badge tone="pending">規劃中</Badge>{i}</li>)}</ul>
        </Block>
      )}
    </PageShell>
  );
}
