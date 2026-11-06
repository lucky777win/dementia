import { ARTICLES, META, articleById, articleSources, refName } from '../data/content';
import { HotlineList } from '../components/ui/HotlineList';
import { Icon } from '../components/ui/Icon';
import { StateView } from '../components/ui/StateView';
import { Block, Bullets, PageShell } from './PageShell';

export function ArticlePage({ id }: { id: string }) {
  const a = articleById(id);
  if (!a) {
    return (
      <div className="mx-auto max-w-page px-4 py-12 md:px-8">
        <StateView state="empty" title="找不到這篇文章" action={<a href="#/guide" className="inline-flex min-h-12 items-center rounded-full bg-brand px-6 font-bold text-white">看所有照顧文章</a>}>
          這篇文章可能還在整理中。
        </StateView>
      </div>
    );
  }
  const related = ARTICLES.filter((x) => x.cat === a.cat && x.id !== a.id).slice(0, 4);
  const sources = articleSources(a);
  return (
    <PageShell
      crumbs={[{ label: '照護指引', href: '#/guide' }, { label: a.title }]}
      title={a.title} lead={a.sum} badge="尚未經專家覆核"
      meta={<p className="flex flex-wrap gap-x-4 gap-y-1"><span>分類：{a.cat}{a.five && `・${a.five}`}</span><span>適用對象：家屬、照顧者</span></p>}
      aside={
        <>
          <Block title="需要幫忙時" tone="warm">
            <HotlineList ids={['fam', 'dem', '1966']} compact />
          </Block>
          {related.length > 0 && (
            <Block title="相關文章">
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.id}><a href={`#/article/${r.id}`} className="flex min-h-12 items-center justify-between gap-2 rounded-md bg-sage px-4 py-2 font-bold text-ink hover:text-brand">{r.title}<Icon name="chevronRight" className="shrink-0 text-brand" /></a></li>
                ))}
              </ul>
            </Block>
          )}
          <Block title="找資源" tone="sage">
            <a href="#/plan/ltc" className="flex min-h-12 items-center justify-between gap-2 font-bold text-brand underline underline-offset-4">申請長照的 5 個步驟 <Icon name="arrowRight" /></a>
            <a href="#/resources" className="flex min-h-12 items-center justify-between gap-2 font-bold text-brand underline underline-offset-4">臺中市共照中心與據點 <Icon name="arrowRight" /></a>
          </Block>
        </>
      }
    >
      {a.sec.map((s, i) => (
        <Block key={s.h} id={`sec-${i}`} title={s.h} tone={s.h === '什麼時候要求助' ? 'warm' : 'white'}>
          {s.p && <p className="text-body text-ink">{s.p}</p>}
          {s.li && <Bullets items={s.li} />}
          {s.ref && <p className="mt-4 text-small text-ink-muted">出處：{s.ref.map(refName).join('；')}</p>}
        </Block>
      ))}
      <Block title="原始資料來源" tone="sage">
        <ul className="space-y-1 text-body text-ink">
          <li>{a.src}</li>
          {sources.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <p className="mt-4 flex items-start gap-2 text-small text-ink-muted"><Icon name="info" size={20} className="mt-0.5 shrink-0" />{META.articleNote}</p>
      </Block>
    </PageShell>
  );
}
