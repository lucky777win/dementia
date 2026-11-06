import { HeroFamily } from '../components/illustrations/Scenes';
import { Icon } from '../components/ui/Icon';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-page items-center gap-6 px-4 pb-4 pt-6 md:grid-cols-[1.05fr_1fr] md:gap-8 md:px-8 md:pb-4 md:pt-8">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-small font-bold text-brand shadow-soft">
            <Icon name="heart" size={20} className="text-warm-accent" /> 失智關懷與資源整合平台
          </p>
          <h1 id="hero-title" className="text-h1">
            從理解開始，<br />讓照顧不再孤單
          </h1>
          <p className="mt-4 max-w-xl text-lead text-ink">陪伴您認識失智症、了解照護方式，找到需要的資源與支持。</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#quick-search" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-brand px-7 text-lead font-bold text-white shadow-soft hover:bg-brand-hover">
              <Icon name="search" /> 查詢我遇到的問題
            </a>
            <a href="#resources" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-brand bg-white px-7 text-lead font-bold text-brand hover:bg-brand-tint">
              <Icon name="pin" /> 尋找照護資源
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px]">
          <HeroFamily eager className="h-auto w-full shadow-lift" />
        </div>
      </div>
    </section>
  );
}
