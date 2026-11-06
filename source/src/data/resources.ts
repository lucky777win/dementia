/**
 * 全台失智照護資源地點
 * ─────────────────────────────────────────────
 * resources.json 由以下清冊清查、合併而成（同一地址只保留一筆「地點」，地點下列出所有服務）：
 *  - 〈失智共同照護中心設置單位一覽表〉製表 115-04（.ods 與 .pdf 內容相同，已比對）
 *  - 〈115年4月失智症照顧資源－失智社區服務據點（含權責型）〉、〈－團體家屋〉擷取 115-06-04
 *  - 臺中市：改用較新的臺中市政府衛生局資源表 115-09-30（含電話與服務時間）
 *  - 〈失智照護服務之網頁及聯絡窗口一覽表〉製表 115-04（各縣市窗口）
 * 座標：依地址中的村里中心（pr='v'）或鄉鎮市區中心（pr='d'）估算，同點位的地點以小圓環錯開。
 */
import raw from './resources.json';

export type ResType = 'center' | 'resp' | 'site' | 'home';
export type Service = { t: ResType; n: string; tel?: string; h?: string; src: string };
export type Place = { id: string; c: string; d: string; a: string; lat: number; lng: number; pr: 'v' | 'd'; s: Service[] };

const R = raw as unknown as {
  meta: { sources: Record<string, { name: string; date: string }>; geoNote: string; geoSource: string };
  county: Record<string, { url: string; tel: string }>;
  places: Place[];
};

export const RES_META = R.meta;
export const COUNTY_INFO = R.county;
export const PLACES = R.places;

export const RES_KIND: Record<ResType, string> = {
  center: '失智共同照護中心', resp: '權責型失智據點', site: '失智社區服務據點', home: '失智團體家屋',
};
export const RES_SHORT: Record<ResType, string> = { center: '共照中心', resp: '權責型據點', site: '失智據點', home: '團體家屋' };
export const RES_SVC: Record<ResType, string> = {
  center: '協助就醫確診、個案管理、照顧諮詢',
  resp: '醫院辦理，收有精神行為症狀者',
  site: '認知促進課程、照顧者課程或支持團體',
  home: '小規模、家庭化的住宿式照顧',
};
/** 地圖點位顏色（同時以文字標示類型，不只靠顏色） */
export const RES_COLOR: Record<ResType, string> = { center: '#276B59', resp: '#9A5A2E', site: '#4F977C', home: '#C9803F' };

/** 依縣市整理的行政區（只列出有資料的） */
export const DISTRICTS_BY_COUNTY: Record<string, string[]> = PLACES.reduce((m, p) => {
  (m[p.c] ??= []);
  if (!m[p.c].includes(p.d)) m[p.c].push(p.d);
  return m;
}, {} as Record<string, string[]>);
Object.values(DISTRICTS_BY_COUNTY).forEach((l) => l.sort((a, b) => a.localeCompare(b, 'zh-Hant')));

export const countByCounty = (c: string) => PLACES.filter((p) => p.c === c).length;

/** 兩點距離（公里） */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const googleMapUrl = (p: Place) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.s[0].n} ${p.a}`)}`;
