import heroFamily from '../../assets/illustrations/hero-family.webp';
import idSelf from '../../assets/illustrations/id-self.webp';
import idFamily from '../../assets/illustrations/id-family.webp';
import idCaregiver from '../../assets/illustrations/id-caregiver.webp';
import stageAware from '../../assets/illustrations/stage-aware.webp';
import stageClinic from '../../assets/illustrations/stage-clinic.webp';
import stageCare from '../../assets/illustrations/stage-care.webp';
import stageCompanion from '../../assets/illustrations/stage-companion.webp';
import { cx } from '../../lib/cx';

/**
 * 插畫場景（第三版：OpenAI 繪圖產生的點陣插畫，WebP、統一 3:2）
 * 插畫皆為裝飾用途（alt=""），資訊永遠由旁邊的文字承載。
 * 圖片自帶背景，元件只負責圓角、比例與載入方式。
 */
type Props = { className?: string; eager?: boolean };
function make(src: string, w: number) {
  return function Illustration({ className, eager }: Props) {
    return (
      <img src={src} alt="" width={w} height={Math.round((w * 2) / 3)} loading={eager ? 'eager' : 'lazy'} decoding="async"
        className={cx('aspect-[3/2] rounded-lg object-cover', className)} />
    );
  };
}

/** 首頁主視覺：三代家人在沙發上相依 */
export const HeroFamily = make(heroFamily, 1200);
/** 我想了解自己：長者在窗邊寫筆記 */
export const IdSelf = make(idSelf, 800);
/** 我在關心家人：女兒陪伴年長的母親 */
export const IdFamily = make(idFamily, 800);
/** 我是照顧者：照顧者為長輩遞上溫茶 */
export const IdCaregiver = make(idCaregiver, 800);
/** 階段一 察覺與準備：母女一起看筆記與日曆 */
export const StageAware = make(stageAware, 800);
/** 階段二 就醫與診斷：醫師與長輩面談 */
export const StageClinic = make(stageClinic, 800);
/** 階段三 照護與生活支持：一起照顧盆栽 */
export const StageCare = make(stageCare, 800);
/** 階段四 進階照護與生命陪伴：長椅上並肩看夕陽 */
export const StageCompanion = make(stageCompanion, 800);
