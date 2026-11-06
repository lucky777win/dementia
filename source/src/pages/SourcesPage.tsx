import { KBSRC, LEARN, META, PLANS, PLAN_TITLES, type PlanId } from '../data/content';
import { PLACES, RES_META } from '../data/resources';
import { Block, PageShell, RefList } from './PageShell';

export function SourcesPage() {
  return (
    <PageShell crumbs={[{ label: '資料來源說明' }]} title="資料來源說明" badge="尚未經專家與個管師覆核"
      lead={`本站內容取自「${META.name}」。${META.notice}正式版每篇文章會標註覆核專家與覆核日期。`}>
      <Block title="照顧文章與認識失智症：知識庫來源">
        <ul className="space-y-2 text-body text-ink">{Object.entries(KBSRC).map(([k, v]) => <li key={k}><span className="mr-2 rounded-sm bg-sage-card px-2 py-0.5 text-small font-bold text-brand">{k}</span>{v}</li>)}</ul>
      </Block>
      <Block title={`認識失智症（查證 ${LEARN.checked}）`}><RefList refs={LEARN.refs} /></Block>
      {(Object.keys(PLANS) as PlanId[]).map((k) => (
        <Block key={k} title={`${PLAN_TITLES[k]}（查證 ${PLANS[k].checked}）`}><RefList refs={PLANS[k].refs} /></Block>
      ))}
      <Block title={`照護資源地點（${PLACES.length} 個地點）`} tone="sage">
        <ul className="space-y-2 text-body text-ink">{Object.values(RES_META.sources).map((s) => <li key={s.name}>{s.name}（{s.date}）</li>)}</ul>
        <p className="mt-4 text-body text-ink">清查方式：共照中心的試算表與 PDF 兩份清冊內容相同，已比對後只取一份；地址正規化（全形半形、臺／台、村里鄰、段的寫法）後，同一地址的不同服務合併為同一個地點。臺中市改用較新的衛生局資源表，全國清冊中的臺中市資料皆已比對涵蓋。{META.sitesNote}</p>
        <p className="mt-2 text-small text-ink-muted">{RES_META.geoNote}{RES_META.geoSource}。底圖：© OpenStreetMap 貢獻者、© CARTO。</p>
      </Block>
    </PageShell>
  );
}
