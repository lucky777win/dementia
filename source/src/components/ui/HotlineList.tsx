import { HOT } from '../../data/content';
import { cx } from '../../lib/cx';
import { Icon } from './Icon';

/** 相關專線：電話號碼可直接撥打（手機），每支專線附用途說明。 */
export function HotlineList({ ids, className, compact }: { ids: string[]; className?: string; compact?: boolean }) {
  const list = ids.map((id) => HOT[id]).filter(Boolean);
  return (
    <ul className={cx('grid gap-3', !compact && 'sm:grid-cols-2', className)}>
      {list.map((h) => (
        <li key={h.num}>
          <a href={`tel:${h.num.replace(/[^\d]/g, '')}`}
            className="flex min-h-14 items-center gap-3 rounded-md border-2 border-sage-line bg-white px-4 py-3 hover:border-brand">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand"><Icon name="phone" size={22} /></span>
            <span className="flex-1">
              <span className="block font-bold text-ink">{h.name}<span className="ml-2 text-lead text-brand">{h.num}</span></span>
              <span className="block text-small text-ink-muted">{h.note}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
