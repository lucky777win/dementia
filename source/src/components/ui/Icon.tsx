import type { SVGProps } from 'react';

/** 線條圖示：24 格、1.8 線寬、圓端點。圖示一律搭配文字使用，不單獨承載意義。 */
const paths: Record<string, string> = {
  search: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.3-2.2L21 21',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  chevronDown: 'm6 9 6 6 6-6',
  chevronRight: 'm9 6 6 6-6 6',
  arrowRight: 'M5 12h14m-5-5 5 5-5 5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.8-3.4 3.6-5.5 7-5.5s6.2 2.1 7 5.5',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9c.7-3 3-5 6-5s5.3 2 6 5m1-9a3 3 0 1 0-1.2-5.8M17.5 15c1.8.5 3 2 3.5 4',
  heart: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  textSize: 'M4 18 8.5 6h1L14 18M5.6 14h6.8M15 18l2.8-7.5h.4L21 18m-5.2-2.6h4.4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5.5M12 7.6v.4',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  checkCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 2.8 2.8L16.5 9',
  alert: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5.5m0 3v.3',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  map: 'm9 4-5 2v14l5-2 6 2 5-2V4l-5 2-6-2Zm0 0v14m6-12v14',
  book: 'M4 5.5C6.5 4.3 9.2 4.3 12 6c2.8-1.7 5.5-1.7 8-.5v13c-2.5-1.2-5.2-1.2-8 .5-2.8-1.7-5.5-1.7-8-.5v-13ZM12 6v13',
  shield: 'M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3Zm-3 9 2.2 2.2L15.5 10',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14H5Zm0 0 7-7',
  home: 'M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z',
  clipboard: 'M9 4h6v3H9V4Zm-3 1.5h2M16 5.5h2v15H6v-15m3 6h6m-6 4h4',
  phone: 'M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2C10.8 19 5 13.2 4.5 5.7a2 2 0 0 1 2-2.2Z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z',
  calendar: 'M5 6h14v14H5V6Zm0 4.5h14M9 3.5V7m6-3.5V7',
  refresh: 'M19 8a7.5 7.5 0 1 0 .9 6M19.5 4v4.5H15',
  printer: 'M7 8V4h10v4M7 17H5v-7h14v7h-2M7 14h10v6H7v-6Z',
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 24, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      <path d={paths[name]} />
    </svg>
  );
}
