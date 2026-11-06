import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { LogoMark } from './Logo';

const LINKS = [
  { href: '#/about', label: '平台介紹' },
  { href: '#/sources', label: '資料來源說明' },
  { href: '#/terms', label: '使用條款' },
  { href: '#/privacy', label: '隱私權政策' },
  { href: '#/accessibility', label: '無障礙說明' },
];

export function Footer() {
  const [open, setOpen] = useState(false);
  return (
    <footer className="mt-20 bg-brand text-white on-brand">
      <div className="mx-auto max-w-page px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={48} />
              <div>
                <p className="text-[1.5rem] font-bold tracking-[0.12em]">憶起照顧</p>
                <p className="text-small text-white/90">失智關懷與資源整合平台</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-body text-white/90">讓資訊容易理解、讓操作更加簡單、讓照顧不再孤單。</p>
          </div>
          <nav aria-label="頁尾連結">
            <p className="mb-3 text-lead font-bold">關於本平台</p>
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}><a href={l.href} className="inline-flex min-h-11 items-center gap-1 text-body text-white underline-offset-4 hover:underline">{l.label}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mb-3 text-lead font-bold">聯絡方式</p>
            <dl className="space-y-3 text-body">
              <div className="flex items-start gap-2"><Icon name="phone" size={22} className="mt-1 shrink-0" /><div><dt className="sr-only">電話</dt><dd>電話：待設定</dd></div></div>
              <div className="flex items-start gap-2"><Icon name="globe" size={22} className="mt-1 shrink-0" /><div><dt className="sr-only">電子郵件</dt><dd>電子郵件：待設定</dd></div></div>
              <div className="flex items-start gap-2"><Icon name="pin" size={22} className="mt-1 shrink-0" /><div><dt className="sr-only">地址</dt><dd>地址：待設定</dd></div></div>
            </dl>
          </div>
        </div>

        <div className="mt-10 rounded-lg bg-white/10 p-5">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="disclaimer"
            className="flex min-h-12 w-full items-center justify-between gap-3 text-left text-lead font-bold">
            <span className="flex items-center gap-2"><Icon name="shield" /> 醫療資訊免責說明</span>
            <span className="flex items-center gap-1 text-small font-medium">{open ? '收合' : '展開閱讀'}<Icon name="chevronDown" className={open ? 'rotate-180' : ''} /></span>
          </button>
          <div id="disclaimer" hidden={!open} className="mt-3 space-y-2 text-body text-white/95">
            <p>本平台內容僅提供一般衛教與資源查詢參考，不能取代醫師或專業人員的診斷、治療與個別建議。</p>
            <p>如有身體或認知狀況的疑問，請洽詢醫療院所或專業人員。正式版免責條文將由平台營運單位審定後公告。</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/25 pt-6 text-small text-white/90 md:flex-row md:justify-between">
          <p>© 憶起照顧｜營運單位資訊待設定</p>
          <p>本站以 WCAG 2.2 AA 為設計目標</p>
        </div>
      </div>
    </footer>
  );
}
