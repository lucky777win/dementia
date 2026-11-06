import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Icon, type IconName } from './Icon';

export type ViewState = 'loading' | 'empty' | 'error' | 'success';
const meta: Record<Exclude<ViewState, 'loading'>, { icon: IconName; ring: string; iconCls: string }> = {
  empty: { icon: 'leaf', ring: 'bg-sage-card', iconCls: 'text-brand' },
  error: { icon: 'refresh', ring: 'bg-warm', iconCls: 'text-warm-deep' },
  success: { icon: 'checkCircle', ring: 'bg-brand-tint', iconCls: 'text-brand' },
};

/** Loading／Empty／Error／Success 共用狀態區塊。語氣溫和、提供下一步，不使用警報式紅色。 */
export function StateView({ state, title, children, action, className }: { state: ViewState; title: string; children?: ReactNode; action?: ReactNode; className?: string }) {
  if (state === 'loading') {
    return (
      <div role="status" aria-live="polite" className={cx('rounded-lg border-2 border-dashed border-sage-line bg-white/70 p-8 text-center', className)}>
        <div className="mx-auto mb-4 flex justify-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => <span key={i} className="h-3 w-3 animate-pulse rounded-full bg-brand" style={{ animationDelay: `${i * 0.2}s` }} />)}
        </div>
        <p className="text-lead font-bold text-brand">{title}</p>
        {children && <div className="mt-2 text-body text-ink-muted">{children}</div>}
      </div>
    );
  }
  const m = meta[state];
  return (
    <div role={state === 'error' ? 'alert' : 'status'} className={cx('rounded-lg border-2 border-sage-line bg-white p-8 text-center', className)}>
      <div className={cx('mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full', m.ring)}>
        <Icon name={m.icon} size={32} className={m.iconCls} />
      </div>
      <p className="text-lead font-bold text-brand">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-xl text-body text-ink-muted">{children}</div>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
