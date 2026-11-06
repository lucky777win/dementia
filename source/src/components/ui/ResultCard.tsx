import { Badge } from './Badge';
import { Icon } from './Icon';

export type ResultCardProps = {
  question: string;
  category: string;
  articleTitle?: string | null;
  source?: string | null;
  updatedAt?: string | null;
  href: string;
  demo?: boolean;
  /** 標題下方的一句摘要 */
  summary?: string;
  /** 自訂狀態標籤文字（預設：展示資料・尚未核准） */
  statusLabel?: string;
};

/**
 * 搜尋結果卡：問題標題 → 對應的核准文章 → 來源 → 更新日期 → 查看完整內容。
 * 未核准或缺資料的欄位一律顯示「待…」，不以推測內容補齊。
 */
export function ResultCard({ question, category, articleTitle, source, updatedAt, href, demo, summary, statusLabel }: ResultCardProps) {
  return (
    <article className="rounded-lg border-2 border-sage-line bg-white p-5 md:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{category}</Badge>
        {demo ? <Badge tone="demo">{statusLabel ?? '展示資料・尚未核准'}</Badge> : <Badge tone="approved">已審核</Badge>}
      </div>
      <h3 className="text-h3">{question}</h3>
      {summary && <p className="mt-2 text-body text-ink">{summary}</p>}
      <dl className="mt-4 grid gap-x-6 gap-y-2 text-body sm:grid-cols-[auto_1fr]">
        <dt className="flex items-center gap-1.5 font-bold text-ink"><Icon name="book" size={22} className="text-brand" />對應文章</dt>
        <dd className="text-ink">{articleTitle ?? '尚無已核准的對應文章'}</dd>
        <dt className="flex items-center gap-1.5 font-bold text-ink"><Icon name="shield" size={22} className="text-brand" />資料來源</dt>
        <dd className="text-ink">{source ?? '待匯入核准來源'}</dd>
        <dt className="flex items-center gap-1.5 font-bold text-ink"><Icon name="calendar" size={22} className="text-brand" />更新日期</dt>
        <dd className="text-ink">{updatedAt ?? '尚未發布'}</dd>
      </dl>
      <a href={href} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand px-5 font-bold text-brand hover:bg-brand-tint">
        查看完整內容 <Icon name="arrowRight" size={22} />
      </a>
    </article>
  );
}
