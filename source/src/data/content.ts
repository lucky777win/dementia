/**
 * 正式內容資料層
 * ─────────────────────────────────────────────
 * 來源：「憶起照顧雛型」（content.json 由雛型資料原樣轉出，未改寫內容）。
 * 雛型標示：文章與導航規則尚未經專家與個管師覆核 → 前台一律標示「尚未經專家覆核」。
 */
import raw from './content.json';

export type Sec = { h: string; p?: string; li?: string[]; ref?: string[] };
export type Article = { id: string; five: string; title: string; cat: string; src: string; kw: string[]; sum: string; sec: Sec[] };
export type Hot = { name: string; num: string; note: string; checked: boolean };
export type Site = { type: 'center' | 'site' | 'resp'; name: string; addr: string; dist: string; tel: string; hours: string };
export type Ref = { name: string; url: string; date: string };
export type PlanStep = { id: string; h: string; when?: string; do?: string[]; prep?: string[]; next?: string[]; cost?: string[]; ask?: string[]; tip?: string; sites?: string };
export type Plan = {
  checked: string; intro: string; steps: PlanStep[];
  script: { h: string; text: string };
  sits: { id: string; label: string; tips: string[] }[];
  local: string[]; hot: string[]; refs: Ref[];
};
export type NavNode = { q?: string; step?: number; opts?: [string, string][]; title?: string; plan?: string; sit?: string[]; hot?: string[] };

type Learn = {
  checked: string; title: string; lead: string; what: string; compare: [string, string][];
  stats: { cards: { n: string; d: string }[]; ages: [string, string][]; world: string; ref: string[] };
  mci: string; whatRef: string[];
  causes: { h: string; p: string; items?: string[] }[]; causeRef: string[];
  risk: { p: string; items: string[]; ref: string[] };
  types: { name: string; tag: string; first: string; course: string; signs: string[]; care: string[]; ref: string[] }[];
  stages: { cdr: string; label: string; summary: string; signs: string[]; care: string[]; svc: { label: string; go?: string; kind?: string; navr?: string; art?: string }[]; ref: string[] }[];
  stageNote: string;
  young: { h: string; items: string[]; ref: string[] };
  refs: Ref[];
};

const C = raw as unknown as {
  meta: { name: string; notice: string; sitesSource: string; sitesChecked: string; sitesNote: string; articleNote: string };
  KBSRC: Record<string, string>; HOT: Record<string, Hot>;
  SAFETY: { id: string; tone: string; words: string[]; reply: string; hot: string[] }[];
  LEARN_WORDS: string[]; RES_WORDS: string[]; ARTICLES: Article[];
  FIVE: { name: string; art: string }[]; PLANNED: { g: string; items: string[] }[];
  NAV: Record<string, NavNode>; PLANS: Record<'ltc' | 'diag' | 'day', Plan>;
  CARDS: string[]; LEARN: Learn; SITES: Site[];
  KIND: Record<Site['type'], string>; KIND_SHORT: Record<Site['type'], string>; KIND_SVC: Record<Site['type'], string>;
  DISTRICTS: string[];
};

export const META = C.meta;
export const KBSRC = C.KBSRC;
export const HOT = C.HOT;
export const ARTICLES = C.ARTICLES;
export const FIVE = C.FIVE;
export const PLANNED = C.PLANNED;
export const NAV = C.NAV;
export const PLANS = C.PLANS;
export const CARDS = C.CARDS;
export const LEARN = C.LEARN;
export const SITES = C.SITES;
export const KIND = C.KIND;
export const KIND_SHORT = C.KIND_SHORT;
export const KIND_SVC = C.KIND_SVC;
export const TAICHUNG_DISTRICTS = C.DISTRICTS;

export type PlanId = keyof typeof PLANS;
export const PLAN_TITLES: Record<PlanId, string> = {
  diag: '先去檢查與看診：6 個步驟',
  day: '白天可以去的地方：6 個步驟',
  ltc: '申請長照的 5 個步驟',
};

export const articleById = (id: string) => ARTICLES.find((a) => a.id === id);

/** 段落出處代號（例：S4-022、M1-手冊頁 2）→ 來源全名 */
export function refName(code: string) {
  const key = code.split('-')[0];
  return KBSRC[key] ? `${KBSRC[key]}${code.includes('-') ? `（${code.slice(key.length + 1)}）` : ''}` : code;
}

/** 文章引用到的所有知識庫來源 */
export function articleSources(a: Article) {
  const keys = new Set<string>();
  a.sec.forEach((s) => s.ref?.forEach((r) => keys.add(r.split('-')[0])));
  return [...keys].sort().map((k) => KBSRC[k]).filter(Boolean);
}

/* ---------- 問題比對引擎（沿用雛型規則：安全分流 → 認識失智症 → 文章關鍵字 → 找資源） ---------- */
const compact = (s: string) => s.replace(/\s+/g, '');
const PLAN_WORDS: Record<PlanId, string[]> = {
  diag: ['就醫', '看醫生', '不願就醫', '不願意就醫', '檢查', '診斷', '門診', '篩檢', 'AD-8', '記憶門診', '確診'],
  day: ['據點', '白天', '日照', '上課', '活動中心'],
  ltc: ['長照', '1966', '申請', '補助', '喘息', '照管', '看護', '居家服務'],
};

export type Answer =
  | { kind: 'safety'; reply: string; hot: string[]; pii: string[] }
  | { kind: 'results'; learn: boolean; articles: Article[]; plans: PlanId[]; pii: string[] }
  | { kind: 'none'; pii: string[] };

export function findPII(t: string) {
  const hits: string[] = [];
  if (/09\d{2}[-\s]?\d{3}[-\s]?\d{3}/.test(t)) hits.push('手機號碼');
  if (/[A-Za-z][12]\d{8}/.test(t)) hits.push('身分證字號');
  return hits;
}

export function answer(text: string): Answer {
  const t = compact(text);
  const pii = findPII(t);
  for (const s of C.SAFETY) if (s.words.some((w) => t.includes(w))) return { kind: 'safety', reply: s.reply, hot: s.hot, pii };
  const learn = C.LEARN_WORDS.some((w) => t.includes(w)) || /記憶力|記性|健忘|失智症/.test(t);
  const articles = ARTICLES.map((a) => ({ a, n: a.kw.filter((k) => t.includes(k)).length }))
    .filter((x) => x.n > 0).sort((x, y) => y.n - x.n).map((x) => x.a);
  const plans = (Object.keys(PLAN_WORDS) as PlanId[]).filter((p) => PLAN_WORDS[p].some((w) => t.includes(w)));
  if (!learn && !articles.length && !plans.length) return { kind: 'none', pii };
  return { kind: 'results', learn, articles, plans, pii };
}
