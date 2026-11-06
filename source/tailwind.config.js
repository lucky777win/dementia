/** 憶起照顧 Design Tokens → Tailwind（與 design-system tokens.json 同步） */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: { DEFAULT: '#F0F7F4', card: '#E5F2EB', line: '#DCE8E1', deep: '#CFE3D8' },
        brand: { DEFAULT: '#276B59', hover: '#1F5A4A', press: '#184A3C', tint: '#D5EADF' },
        ink: { DEFAULT: '#344C45', muted: '#5A7268' },
        warm: { DEFAULT: '#FFE8CA', soft: '#FFF4E4', accent: '#E8A777', deep: '#9A5A2E' },
      },
      fontFamily: { sans: ['"Noto Sans TC"', '"PingFang TC"', '"Microsoft JhengHei"', 'system-ui', 'sans-serif'] },
      fontSize: {
        body: ['1.125rem', { lineHeight: '1.75' }],
        lead: ['1.25rem', { lineHeight: '1.7' }],
        small: ['1rem', { lineHeight: '1.65' }],
        h3: ['1.375rem', { lineHeight: '1.45', fontWeight: '700' }],
        h2: ['clamp(1.625rem, 1.2rem + 1.4vw, 2.125rem)', { lineHeight: '1.35', fontWeight: '700' }],
        h1: ['clamp(2rem, 1.3rem + 2.6vw, 3.25rem)', { lineHeight: '1.25', fontWeight: '700' }],
      },
      borderRadius: { sm: '10px', md: '16px', lg: '24px', xl: '32px' },
      boxShadow: {
        soft: '0 2px 10px rgba(39, 107, 89, 0.06)',
        lift: '0 8px 24px rgba(39, 107, 89, 0.10)',
      },
      maxWidth: { page: '1200px' },
    },
  },
  plugins: [],
};
