/**
 * 導覽結構資料
 * ─────────────────────────────────────────────
 * 身分、四階段、標籤等「導覽」設定；每個入口連到 content.json（取自憶起照顧雛型）的對應內容。
 * 實質內容（文章、行動計畫、據點）一律放在 content.json，不在此撰寫。
 */
import type { IconName } from '../components/ui/Icon';
import { TAICHUNG_DISTRICTS } from './content';

export type IdentityId = 'self' | 'family' | 'caregiver';
export type StageId = 'aware' | 'clinic' | 'care' | 'companion';

export const NAV = [
  { href: '#/', label: '首頁' },
  { href: '#/understand', label: '認識失智症' },
  { href: '#/guide', label: '照護指引' },
  { href: '#/resources', label: '資源查詢' },
  { href: '#/caregiver', label: '照顧者支持' },
] as const;

export type Link = { label: string; href: string };
const L = (label: string, href: string): Link => ({ label, href });

export const IDENTITIES: { id: IdentityId; title: string; desc: string; icon: IconName; questions: Link[]; entries: Link[] }[] = [
  {
    id: 'self', title: '我想了解自己', icon: 'user',
    desc: '最近覺得記性不如以往？從認識失智症與就醫準備開始，按自己的步調了解。',
    questions: [L('我最近記憶力變差，是正常老化嗎？', '#/understand'), L('我應該去醫院檢查嗎？', '#/plan/diag')],
    entries: [L('認識失智症', '#/understand'), L('正常老化與失智資訊', '#/understand'), L('早期篩檢工具介紹', '#/plan/diag'), L('就醫前準備', '#/plan/diag'), L('醫療機構查詢', '#/resources?kind=center')],
  },
  {
    id: 'family', title: '我在關心家人', icon: 'users',
    desc: '覺得家人好像有些不一樣？了解如何陪伴、溝通，以及就醫與評估的流程。',
    questions: [L('我懷疑家人有失智症，該怎麼辦？', '#/plan/diag'), L('家人不願意就醫怎麼辦？', '#/plan/diag')],
    entries: [L('常見認知變化', '#/understand'), L('家庭溝通', '#/article/talk'), L('失智評估與診斷流程', '#/plan/diag'), L('就醫準備清單', '#/plan/diag'), L('確診後資訊', '#/plan/diag')],
  },
  {
    id: 'caregiver', title: '我是照顧者', icon: 'heart',
    desc: '每天的照顧辛苦了。找日常照護方法、官方長照資源，也別忘了照顧自己。',
    questions: [L('家人一直重複問問題怎麼辦？', '#/article/repeat'), L('我感到照顧壓力很大，可以尋求什麼支持？', '#/caregiver')],
    entries: [L('日常生活照護', '#/article/selfcare'), L('居家安全與防走失', '#/article/wander'), L('官方長照與社會資源', '#/plan/ltc'), L('支持與喘息資源', '#/caregiver'), L('家庭照顧者調適', '#/caregiver')],
  },
];

export const STAGES: { id: StageId; no: string; title: string; question: string; desc: string; topics: Link[] }[] = [
  { id: 'aware', no: '01', title: '察覺與準備', question: '我或家人可能有失智症嗎？', desc: '認識失智症與常見的認知變化，了解篩檢工具與就醫前可以做的準備。', topics: [L('認識失智症', '#/understand'), L('常見認知變化', '#/understand'), L('正常老化與失智資訊', '#/understand'), L('早期篩檢工具介紹', '#/plan/diag'), L('就醫前準備', '#/plan/diag')] },
  { id: 'clinic', no: '02', title: '就醫與診斷', question: '我該去哪裡尋求協助？', desc: '了解就醫資訊與評估流程，查詢醫療機構，並為確診後的生活預作準備。', topics: [L('就醫資訊', '#/plan/diag'), L('失智評估與診斷流程', '#/plan/diag'), L('醫療機構查詢', '#/resources?kind=center'), L('就醫準備清單', '#/plan/diag'), L('確診後資訊', '#/plan/diag')] },
  { id: 'care', no: '03', title: '照護與生活支持', question: '接下來該如何照顧？', desc: '日常照護、居家安全、飲食與活動，以及照顧者支持與官方長照資源。', topics: [L('日常生活照護', '#/article/selfcare'), L('精神行為症狀 BPSD', '#/guide'), L('居家安全與防走失', '#/article/wander'), L('口腔保健及飲食營養', '#/article/refuse'), L('生活促進活動', '#/article/activity'), L('家屬與照顧者支持', '#/caregiver'), L('官方長照與社會資源', '#/plan/ltc')] },
  { id: 'companion', no: '04', title: '進階照護與生命陪伴', question: '如何維持尊嚴與生活品質？', desc: '進階照護、照護環境、病人自主與倫理，以及緩和照護與家屬調適。', topics: [L('進階照護資訊', '#/understand'), L('照護環境及支持', '#/plan/day'), L('病人自主與倫理', '#/understand'), L('緩和照護與生命末期支持', '#/understand'), L('家庭照顧者調適', '#/caregiver')] },
];

/** 常見問題標籤：label 顯示給使用者，q 為送進比對引擎的關鍵字 */
export const QUICK_TAGS = [
  { label: '記憶力變差', q: '記憶力變差' },
  { label: '家人不願就醫', q: '家人不願就醫' },
  { label: '重複問話', q: '重複問話' },
  { label: '居家安全', q: '居家安全 防走失' },
  { label: '照護資源', q: '申請長照 據點' },
  { label: '照顧者支持', q: '喘息 照顧者' },
];

/** 22 個直轄市、縣（市） */
export const COUNTIES = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市', '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'];

/** 行政區：臺中市取自雛型的據點資料（衛生局資源表）；其他縣市資料尚未匯入 */
export const DISTRICTS: Record<string, string[]> = { 臺中市: TAICHUNG_DISTRICTS };

/** value 為 center／resp／site／home 的類型已匯入全台官方清冊；其餘類型尚未匯入 */
export const RESOURCE_TYPES = [
  { value: 'center', label: '失智共同照護中心' },
  { value: 'site', label: '失智社區服務據點' },
  { value: 'resp', label: '權責型失智據點' },
  { value: 'home', label: '失智團體家屋' },
  { value: 'ltc', label: '長期照顧管理中心' },
  { value: 'day', label: '日間照顧服務' },
  { value: 'respite', label: '喘息服務' },
  { value: 'carer', label: '家庭照顧者支持服務據點' },
];
