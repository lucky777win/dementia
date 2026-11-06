import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export function SectionHeading({ id, eyebrow, title, desc, center, className }: { id?: string; eyebrow?: string; title: ReactNode; desc?: ReactNode; center?: boolean; className?: string }) {
  return (
    <div className={cx('mb-8 md:mb-10', center && 'text-center', className)}>
      {eyebrow && <p className="mb-2 text-small font-bold tracking-widest text-warm-deep">{eyebrow}</p>}
      <h2 id={id} className="text-h2">{title}</h2>
      {desc && <p className={cx('mt-3 max-w-2xl text-body text-ink-muted', center && 'mx-auto')}>{desc}</p>}
    </div>
  );
}
