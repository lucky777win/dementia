import { Icon } from '../ui/Icon';

export type SimMode = 'auto' | 'loading' | 'empty' | 'error';

/** 原型專用工具列：清楚告知展示資料，並可模擬各種狀態。正式網站不顯示。 */
export function PrototypeBar({ mode, onMode }: { mode: SimMode; onMode: (m: SimMode) => void }) {
  return (
    <div className="no-print border-b border-warm-accent bg-warm">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 md:px-8">
        <p className="flex items-center gap-2 text-small font-medium text-ink">
          <Icon name="info" size={20} className="shrink-0 text-warm-deep" />
          <span><strong>原型展示</strong>｜內容取自「憶起照顧雛型」，文章與導航規則尚未經專家與個管師覆核。</span>
        </p>
        <label className="flex items-center gap-2 text-small font-medium text-ink">
          查詢狀態模擬
          <select value={mode} onChange={(e) => onMode(e.target.value as SimMode)}
            className="min-h-10 rounded-sm border-2 border-warm-accent bg-white px-2 text-small text-ink">
            <option value="auto">依操作顯示</option>
            <option value="loading">載入中</option>
            <option value="empty">查無資料</option>
            <option value="error">連線錯誤</option>
          </select>
        </label>
      </div>
    </div>
  );
}
