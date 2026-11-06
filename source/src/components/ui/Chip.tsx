import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../lib/cx';
import { Icon } from './Icon';

/** 可點擊的問題標籤。選取狀態同時以勾選圖示＋粗框表示，不只靠顏色。 */
export function Chip({ selected, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...rest}
      className={cx(
        'inline-flex min-h-12 items-center gap-1.5 rounded-full border-2 px-5 text-body font-medium transition-colors',
        selected ? 'border-brand bg-brand-tint text-brand' : 'border-sage-line bg-white text-ink hover:border-brand hover:text-brand',
        className,
      )}
    >
      {selected && <Icon name="check" size={20} />}
      {children}
    </button>
  );
}
