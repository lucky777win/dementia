import { FONT_SCALES, type FontScale } from '../../lib/fontScale';
import { cx } from '../../lib/cx';
import { Icon } from '../ui/Icon';

/** 字級切換：三段式按鈕群組，每段同時顯示「A」大小示意與文字。 */
export function FontSizeSwitch({ value, onChange, full }: { value: FontScale; onChange: (v: FontScale) => void; full?: boolean }) {
  return (
    <div role="group" aria-label="字體大小調整" className={cx('flex items-center gap-2', full && 'flex-col items-stretch')}>
      <span className={cx('flex items-center gap-1 text-small font-bold text-ink', !full && 'sr-only xl:not-sr-only')}>
        <Icon name="textSize" size={22} className="text-brand" /> 字級
      </span>
      <div className="flex rounded-full border-2 border-sage-line bg-white p-1">
        {FONT_SCALES.map((f, i) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={value === f.id}
            aria-label={f.label}
            onClick={() => onChange(f.id)}
            className={cx(
              'flex min-h-11 min-w-11 flex-1 items-center justify-center gap-1 rounded-full px-3 font-bold transition-colors',
              value === f.id ? 'bg-brand text-white' : 'text-ink hover:bg-sage-card',
            )}
          >
            <span aria-hidden="true" style={{ fontSize: `${0.95 + i * 0.2}rem` }}>A</span>
            <span className={cx('text-[0.875rem]', !full && 'hidden 2xl:inline')}>{f.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
