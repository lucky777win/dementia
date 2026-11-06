import { ARTICLES, FIVE, PLANNED, articleById } from '../data/content';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Block, PageShell } from './PageShell';

const CATS = ['五大困擾', '日常照顧', '溝通'];

export function GuidePage() {
  return (
    <PageShell crumbs={[{ label: '照護指引' }]} title="照護指引"
      lead={`家屬最常遇到的五個困擾，以及日常照顧、溝通的方法。目前有 ${ARTICLES.length} 篇文章，取材自失智症課程講義與知識庫資料，改寫成家屬口吻。`}
      badge="尚未經專家覆核">
      <Block title="家屬最常遇到的五個困擾" id="five">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FIVE.map((f) => {
            const a = articleById(f.art);
            return (
              <li key={f.name}>
                <a href={`#/article/${f.art}`} className="flex h-full flex-col rounded-lg border-2 border-sage-line bg-sage p-5 hover:border-brand">
                  <span className="text-small font-bold text-warm-deep">{f.name}</span>
                  <span className="mt-1 text-h3 text-brand">{a?.title}</span>
                  <span className="mt-2 flex-1 text-body text-ink">{a?.sum}</span>
                  <span className="mt-3 inline-flex items-center gap-1 font-bold text-brand">閱讀全文 <Icon name="arrowRight" size={20} /></span>
                </a>
              </li>
            );
          })}
        </ul>
      </Block>
      {CATS.map((c) => (
        <Block key={c} title={c === '五大困擾' ? '五大困擾：全部文章' : c}>
          <ul className="space-y-3">
            {ARTICLES.filter((a) => a.cat === c).map((a) => (
              <li key={a.id}>
                <a href={`#/article/${a.id}`} className="flex min-h-14 items-center justify-between gap-3 rounded-md border-2 border-sage-line bg-white px-4 py-3 hover:border-brand">
                  <span><span className="block font-bold text-ink">{a.title}</span><span className="block text-small text-ink-muted">{a.sum}</span></span>
                  <Icon name="chevronRight" className="shrink-0 text-brand" />
                </a>
              </li>
            ))}
          </ul>
        </Block>
      ))}
      <Block title="規劃中的主題" tone="sage">
        <p className="mb-4 text-body text-ink">使用者回饋後陸續補上，並納入蒙特梭利等照顧方法。</p>
        <div className="grid gap-4 md:grid-cols-2">
          {PLANNED.map((g) => (
            <div key={g.g} className="rounded-md bg-white p-4">
              <p className="mb-2 font-bold text-brand">{g.g}</p>
              <ul className="space-y-1.5">
                {g.items.map((it) => <li key={it} className="flex items-start gap-2 text-body text-ink"><Badge tone="pending" className="shrink-0">規劃中</Badge>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Block>
    </PageShell>
  );
}
