import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Icon, type IconName } from './Icon';

export type BadgeTone = 'demo' | 'approved' | 'pending' | 'neutral';
const tones: Record<BadgeTone, { cls: string; icon: IconName }> = {
  demo: { cls: 'bg-warm text-warm-deep border-warm-accent', icon: 'info' },
  approved: { cls: 'bg-brand-tint text-brand border-brand', icon: 'checkCircle' },
  pending: { cls: 'bg-white text-ink border-sage-line', icon: 'clipboard' },
  neutral: { cls: 'bg-sage-card text-ink border-sage-line', icon: 'info' },
};

/** 狀態標示：文字＋圖示＋色彩三重提示。「展示資料」一律使用 demo 色調。 */
export function Badge({ tone = 'neutral', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  const t = tones[tone];
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-small font-medium', t.cls, className)}>
      <Icon name={t.icon} size={18} />
      {children}
    </span>
  );
}
