import { useEffect, useState } from 'react';

export type FontScale = 'normal' | 'large' | 'xlarge';
export const FONT_SCALES: { id: FontScale; label: string; short: string }[] = [
  { id: 'normal', label: '正常字級', short: '正常' },
  { id: 'large', label: '大字級', short: '大' },
  { id: 'xlarge', label: '特大字級', short: '特大' },
];
const KEY = 'yiqi-font-scale';

/** 字級偏好：寫入 <html> class，並在瀏覽器允許時記住（失敗時自動忽略）。 */
export function useFontScale() {
  const [scale, setScale] = useState<FontScale>(() => {
    try { return (localStorage.getItem(KEY) as FontScale) || 'normal'; } catch { return 'normal'; }
  });
  useEffect(() => {
    const el = document.documentElement;
    el.classList.remove('fs-large', 'fs-xlarge');
    if (scale !== 'normal') el.classList.add(`fs-${scale}`);
    try { localStorage.setItem(KEY, scale); } catch { /* 私密瀏覽等情況 */ }
  }, [scale]);
  return [scale, setScale] as const;
}
