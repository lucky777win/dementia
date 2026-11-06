import { IDENTITIES, STAGES } from './data/demo';
import { StageCompanion } from './components/illustrations/Scenes';
import { Badge } from './components/ui/Badge';
import { Icon } from './components/ui/Icon';

/** 尚未製作頁面的過渡畫面：清楚說明頁面用途與規劃，並提供返回首頁的大按鈕。 */
function describe(route: string): { title: string; page: string; note: string } {
  const [, a = '', b = ''] = route.split('/');
  const key = decodeURIComponent(b.split('?')[0]);
  switch (a.split('?')[0]) {
    case 'understand': return { title: '認識失智症', page: 'Page 05｜失智知識文章頁', note: '經審核的失智症知識文章將依主題整理於此。' };
    case 'guide': case 'scenarios': return { title: '照護指引', page: 'Page 08｜照護情境專區', note: '依常見照護困擾分類的圖卡、問題清單與相關知識。' };
    case 'resources': return { title: '全台官方資源查詢', page: 'Page 06｜全台官方資源查詢頁', note: '列表優先、地圖輔助的官方資源查詢。' };
    case 'caregiver': return { title: '照顧者支持專區', page: 'Page 07｜照顧者支持專區', note: '照顧者壓力、家庭溝通、照顧分工與喘息資源。' };
    case 'identity': return { title: IDENTITIES.find((i) => i.id === key)?.title ?? '身分導覽', page: 'Page 02｜身分導覽頁', note: '依本人、家屬、照顧者三種身分顯示不同的服務入口。' };
    case 'stages': case 'stage': return { title: STAGES.find((s) => s.id === key)?.title ?? '四階段服務導覽', page: 'Page 03｜四階段服務導覽頁', note: '階段說明、相關主題、常見問題、知識文章與官方資源。' };
    case 'search': return { title: '情境式問題查詢', page: 'Page 04｜情境式問題查詢頁', note: '輸入問題或選擇問題類別，查詢已核准的知識文章。' };
    case 'topic': return { title: key || '主題', page: 'Page 03／05｜主題與文章', note: '此主題的內容尚在整理與審核中。' };
    default: return { title: '平台資訊', page: '頁尾資訊頁', note: '內容待平台營運單位提供。' };
  }
}

export function PlaceholderPage({ route }: { route: string }) {
  const d = describe(route);
  return (
    <div className="mx-auto max-w-page px-4 py-10 md:px-8 md:py-16">
      <nav aria-label="導覽路徑" className="mb-6 text-small text-ink">
        <ol className="flex flex-wrap items-center gap-1">
          <li><a href="#/" className="font-bold text-brand underline underline-offset-4">首頁</a></li>
          <li aria-hidden="true"><Icon name="chevronRight" size={18} /></li>
          <li aria-current="page">{d.title}</li>
        </ol>
      </nav>
      <div className="grid items-center gap-8 rounded-xl bg-white p-6 shadow-soft md:grid-cols-[1.3fr_1fr] md:p-12">
        <div>
          <Badge tone="pending">此頁面規劃中</Badge>
          <h1 className="mt-4 text-h1">{d.title}</h1>
          <p className="mt-4 text-lead text-ink">{d.note}</p>
          <p className="mt-2 text-body text-ink-muted">設計規劃：{d.page}。本階段僅完成首頁原型。</p>
          <a href="#/" className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-brand px-7 text-lead font-bold text-white hover:bg-brand-hover">
            <Icon name="home" /> 回到首頁
          </a>
        </div>
        <StageCompanion className="mx-auto w-full max-w-[420px]" />
      </div>
    </div>
  );
}
