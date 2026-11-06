import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'warm';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  icon?: IconName;
  iconAfter?: IconName;
  block?: boolean;
  children: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-press shadow-soft',
  secondary: 'bg-white text-brand border-2 border-brand hover:bg-brand-tint',
  quiet: 'bg-sage-card text-brand hover:bg-brand-tint',
  warm: 'bg-warm text-ink border-2 border-warm-accent hover:bg-[#FFDDB0]',
};

/** 主要互動按鈕：最小高度 48px（lg 為 56px），永遠帶文字，圖示僅輔助。 */
export function Button({ variant = 'primary', size = 'md', icon, iconAfter, block, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        size === 'lg' ? 'min-h-14 px-7 text-lead' : 'min-h-12 px-6 text-body',
        variants[variant], block && 'w-full', className,
      )}
    >
      {icon && <Icon name={icon} size={22} />}
      <span>{children}</span>
      {iconAfter && <Icon name={iconAfter} size={22} />}
    </button>
  );
}
