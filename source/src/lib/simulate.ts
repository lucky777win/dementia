import type { SimMode } from '../components/layout/PrototypeBar';

/** 模擬查詢延遲與狀態。正式版將改為呼叫「已核准內容」API。 */
export function simulate<T>(mode: SimMode, ok: () => T, ms = 700): Promise<T> {
  return new Promise((resolve, reject) => {
    if (mode === 'loading') return; // 停留在載入中
    setTimeout(() => (mode === 'error' ? reject(new Error('network')) : resolve(ok())), ms);
  });
}
