/**
 * Logo 標誌：一雙深青綠的手由下方輕輕托住一顆柔暖橘的心。
 * 雙手＝陪伴與守護（專業、可信）；心＝被照顧的人與家人之間的溫度。
 */
export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="32" fill="#FFFFFF" />
      <path d="M32 37s-10.5-6.2-10.5-13.3A5.7 5.7 0 0 1 32 20.6a5.7 5.7 0 0 1 10.5 3.1C42.5 30.8 32 37 32 37Z" fill="#E8A777" />
      <path d="M9.5 27.5c1.7-1.6 4.3-1.2 5.3.9l2.6 6.6c2 4.6 6.3 8 12.6 8.6V52c-10.2-.7-18-7.6-20.9-17.2-.8-2.6-.9-5.6.4-7.3Z" fill="#276B59" />
      <path d="M54.5 27.5c-1.7-1.6-4.3-1.2-5.3.9l-2.6 6.6c-2 4.6-6.3 8-12.6 8.6V52c10.2-.7 18-7.6 20.9-17.2.8-2.6.9-5.6-.4-7.3Z" fill="#276B59" />
    </svg>
  );
}

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark size={compact ? 44 : 52} />
      <span className="flex flex-col leading-tight">
        <span className="text-[1.5rem] font-bold tracking-[0.12em] text-brand md:text-[1.625rem]">憶起照顧</span>
        <span className="text-[0.875rem] font-medium tracking-wider text-ink-muted md:text-[0.9375rem]">失智關懷與資源整合平台</span>
      </span>
    </span>
  );
}
