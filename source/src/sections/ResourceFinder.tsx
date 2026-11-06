import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { COUNTIES, RESOURCE_TYPES } from '../data/demo';
import {
  COUNTY_INFO, DISTRICTS_BY_COUNTY, PLACES, RES_COLOR, RES_KIND, RES_META, RES_SHORT, RES_SVC,
  distanceKm, googleMapUrl, type Place, type ResType,
} from '../data/resources';
import type { SimMode } from '../components/layout/PrototypeBar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SelectField } from '../components/ui/SelectField';
import { StateView } from '../components/ui/StateView';
import { simulate } from '../lib/simulate';
import { cx } from '../lib/cx';

const ResourceMap = lazy(() => import('../components/ResourceMap').then((m) => ({ default: m.ResourceMap })));

type Status = 'idle' | 'loading' | 'done' | 'error';
type View = 'list' | 'map';
type LocState = 'idle' | 'asking' | 'on' | 'denied';
const opts = (a: string[]) => a.map((v) => ({ value: v, label: v }));
const PAGE = 6;
const KINDS = Object.keys(RES_KIND) as ResType[];
const telHref = (t: string) => `tel:${t.replace(/[#＃*轉分].*$/, '').replace(/[^\d]/g, '')}`;
const uniq = <T,>(a: T[]) => a.filter((v, i) => a.indexOf(v) === i);
const srcLabel = (src: string) => {
  const s = RES_META.sources[src];
  return s ? `${s.name}（${s.date}）` : '';
};

/** 地點卡：一個地址一張卡；同一地點有多項服務時逐項列出。編號與地圖點位一致。 */
function PlaceCard({ p, n, km, selected, compact, onLocate }: {
  p: Place; n: number; km?: number; selected?: boolean; compact?: boolean; onLocate: () => void;
}) {
  const kinds = uniq(p.s.map((s) => s.t));
  const tels = uniq(p.s.flatMap((s) => (s.tel ? s.tel.split('、') : [])));
  const hours = uniq(p.s.map((s) => s.h).filter(Boolean) as string[]);
  return (
    <article id={`res-${p.id}`} aria-current={selected ? 'true' : undefined}
      className={cx('flex h-full scroll-mt-32 flex-col rounded-lg border-2 bg-white transition-shadow', compact ? 'p-4' : 'p-5', selected ? 'border-brand shadow-lift' : 'border-sage-line')}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-small font-bold text-white" style={{ background: RES_COLOR[kinds[0]] }} aria-label={`第 ${n} 筆`}>{n}</span>
        {kinds.map((k) => <Badge key={k} tone="neutral">{RES_SHORT[k]}</Badge>)}
        <span className="text-small font-medium text-warm-deep">{p.d}</span>
        {km !== undefined && <span className="text-small font-bold text-brand">約 {km < 1 ? `${Math.round(km * 1000)} 公尺` : `${km.toFixed(1)} 公里`}</span>}
      </div>
      <h3 className={cx('mt-3', compact ? 'text-lead font-bold text-brand' : 'text-h3')}>{p.s[0].n}</h3>
      {p.s.length > 1 && (
        <ul className="mt-2 space-y-1 rounded-md bg-sage p-3 text-small text-ink">
          <li className="font-bold text-brand">此地點提供 {p.s.length} 項服務</li>
          {p.s.map((s) => <li key={s.t + s.n}>・{RES_KIND[s.t]}：{s.n}</li>)}
        </ul>
      )}
      {p.s.length === 1 && <p className="mt-1 text-body font-medium text-warm-deep">{RES_KIND[p.s[0].t]}</p>}
      <dl className="mt-3 flex-1 space-y-2 text-body text-ink">
        <div className="flex gap-2"><dt className="flex shrink-0 items-center gap-1 font-bold"><Icon name="pin" size={20} className="text-brand" />地址</dt><dd>{p.a}</dd></div>
        <div className="flex gap-2"><dt className="flex shrink-0 items-center gap-1 font-bold"><Icon name="phone" size={20} className="text-brand" />電話</dt>
          <dd className="flex flex-wrap gap-x-3">{tels.length ? tels.map((t) => <a key={t} href={telHref(t)} className="font-medium text-brand underline underline-offset-4">{t}</a>) : <span className="text-ink-muted">清冊未提供，請洽縣市窗口</span>}</dd></div>
        {hours.length > 0 && <div className="flex gap-2"><dt className="flex shrink-0 items-center gap-1 font-bold"><Icon name="calendar" size={20} className="text-brand" />時間</dt><dd>{hours.join('；')}</dd></div>}
        {!compact && <div className="flex gap-2"><dt className="flex shrink-0 items-center gap-1 font-bold"><Icon name="heart" size={20} className="text-brand" />服務</dt><dd>{uniq(kinds.map((k) => RES_SVC[k])).join('；')}</dd></div>}
        {!compact && <div className="flex gap-2"><dt className="flex shrink-0 items-center gap-1 font-bold"><Icon name="shield" size={20} className="text-brand" />資料來源</dt><dd className="text-small">{uniq(p.s.map((s) => srcLabel(s.src))).join('；')}</dd></div>}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onLocate} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-5 font-bold text-white hover:bg-brand-hover">
          <Icon name="pin" size={22} /> 在地圖上看
        </button>
        <a href={googleMapUrl(p)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand px-5 font-bold text-brand hover:bg-brand-tint">
          <Icon name="map" size={22} /> Google 地圖
        </a>
      </div>
    </article>
  );
}

function MapLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-ink">
      {KINDS.map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5"><span className="h-4 w-4 rounded-full border-2 border-white shadow-soft" style={{ background: RES_COLOR[k] }} />{RES_SHORT[k]}</span>
      ))}
      <span className="inline-flex items-center gap-1.5"><span className="h-4 w-4 rounded-full border-2 border-white bg-[#2F6FD6] shadow-soft" />您的位置</span>
    </div>
  );
}

export function ResourceFinder({ sim, initialKind = '', initialCounty = '', initialView = 'list', autoRun, embedded }: {
  sim: SimMode; initialKind?: string; initialCounty?: string; initialView?: View; autoRun?: boolean; embedded?: boolean;
}) {
  const [county, setCounty] = useState(initialCounty);
  const [district, setDistrict] = useState('');
  const [type, setType] = useState(initialKind);
  const [shown, setShown] = useState(PAGE);
  const [err, setErr] = useState('');
  const [status, setStatus] = useState<Status>(autoRun ? 'done' : 'idle');
  const [view, setView] = useState<View>(initialView);
  const [selected, setSelected] = useState<string | null>(null);
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locState, setLocState] = useState<LocState>('idle');
  // 送出後才套用的查詢條件（避免使用者還在選單調整時，結果就跟著跳動）
  const [q, setQ] = useState({ county: initialCounty, district: '', type: initialKind });
  const districts = DISTRICTS_BY_COUNTY[county];

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!county) { setErr('請先選擇縣市'); return; }
    setErr('');
    setStatus('loading');
    setShown(PAGE);
    setSelected(null);
    setQ({ county, district, type });
    simulate(sim, () => null).then(() => setStatus('done')).catch(() => setStatus('error'));
  };

  const typeLabel = RESOURCE_TYPES.find((t) => t.value === q.type)?.label;
  const hasKind = !q.type || (KINDS as string[]).includes(q.type);
  const results = useMemo(() => {
    if (!hasKind || sim === 'empty') return [] as { p: Place; km?: number }[];
    const list = PLACES.filter((p) => (!q.county || p.c === q.county) && (!q.district || p.d === q.district) && (!q.type || p.s.some((s) => s.t === q.type)))
      .map((p) => ({ p, km: loc ? distanceKm(loc, p) : undefined }));
    if (loc) list.sort((a, b) => a.km! - b.km!);
    return list;
  }, [q, loc, hasKind, sim]);
  const placesOnMap = useMemo(() => results.map((r) => r.p), [results]);
  const summary = [q.county || '全台', q.district || '全部行政區', typeLabel || '全部服務類型'].join('・');
  const info = COUNTY_INFO[q.county];

  /** 從地圖選取：確保清單已展開到該筆，再捲動過去 */
  const selectFromMap = useCallback((id: string) => {
    setSelected(id);
    const idx = results.findIndex((r) => r.p.id === id);
    if (idx >= shown) setShown(idx + 1);
    requestAnimationFrame(() => document.getElementById(`res-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }, [results, shown]);

  /** 從清單選取：切到地圖檢視並定位 */
  const locate = (id: string) => {
    setSelected(id);
    setView('map');
    requestAnimationFrame(() => document.getElementById('res-map-box')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  const askLocation = () => {
    if (loc) { setLoc(null); setLocState('idle'); return; }
    if (!('geolocation' in navigator)) { setLocState('denied'); return; }
    setLocState('asking');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocState('on'); },
      () => setLocState('denied'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  };

  useEffect(() => { if (selected && !results.some((r) => r.p.id === selected)) setSelected(null); }, [results, selected]);

  const total = PLACES.length;
  const countyCount = new Set(PLACES.map((p) => p.c)).size;

  return (
    <section id="resources" aria-labelledby="res-title" className={embedded ? '' : 'scroll-mt-28 bg-white/60 py-12 md:py-16'}>
      <div className={embedded ? '' : 'mx-auto max-w-page px-4 md:px-8'}>
        <SectionHeading className={embedded ? 'sr-only' : undefined} id="res-title" title="尋找您需要的照護資源"
          desc={`選擇所在縣市、行政區與服務類型，查詢全台 ${countyCount} 縣市、${total} 個失智照護服務地點，清單與地圖可對照查看。`} />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={submit} noValidate className="rounded-lg bg-white p-6 shadow-soft md:p-8">
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField label="縣市" placeholder="請選擇縣市" options={opts(COUNTIES)} value={county} error={err || undefined}
                onChange={(e) => { setCounty(e.target.value); setDistrict(''); if (e.target.value) setErr(''); }} />
              <SelectField label="行政區" placeholder={county ? '全部行政區' : '請先選擇縣市'} options={opts(districts ?? [])} value={district}
                disabled={!county || !districts} onChange={(e) => setDistrict(e.target.value)}
                hint={county && districts ? `只列出有服務地點的行政區（${districts.length} 區）` : undefined} />
              <SelectField label="資源類型" placeholder="全部服務類型" options={RESOURCE_TYPES} value={type} onChange={(e) => setType(e.target.value)} />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-small text-ink-muted">資料來源：共照中心、失智據點、團體家屋官方清冊（115 年 4–6 月）；臺中市為衛生局 115 年 9 月 30 日版。前往前請先來電確認服務時間。</p>
              <Button type="submit" size="lg" icon="search" className="shrink-0">查詢資源</Button>
            </div>
          </form>

          <a href="#/resources?view=map" className="group flex flex-col justify-between rounded-lg bg-brand p-6 text-white shadow-soft hover:bg-brand-hover md:p-8">
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15"><Icon name="map" size={30} /></span>
              <p className="mt-4 text-h3 text-white">資源地圖</p>
              <p className="mt-2 text-body text-white/95">在地圖上查看住家附近的服務據點，清單與地圖可隨時切換。</p>
            </div>
            <span className="mt-6 inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-white px-5 font-bold text-brand">
              開啟資源地圖 <Icon name="arrowRight" size={22} />
            </span>
          </a>
        </div>

        <div className="mt-8" aria-live="polite">
          {status === 'loading' && <StateView state="loading" title="正在查詢資源…">{[county, district || '全部行政區'].join('・')}</StateView>}
          {status === 'error' && (
            <StateView state="error" title="暫時無法取得資源資料" action={<Button icon="refresh" onClick={() => submit()}>再試一次</Button>}>
              官方資料暫時無法連線。您選擇的條件已保留，可以稍後再試。
            </StateView>
          )}
          {status === 'done' && (
            <div>
              {info && (
                <div className="mb-5 flex flex-col gap-3 rounded-lg bg-warm-soft p-5 md:flex-row md:items-center md:justify-between">
                  <p className="text-body text-ink"><strong className="text-brand">{q.county}失智照護服務窗口</strong>　不確定該去哪裡，可以先打電話問。</p>
                  <div className="flex flex-wrap gap-2">
                    <a href={telHref(info.tel)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 font-bold text-brand hover:bg-brand-tint"><Icon name="phone" size={22} />{info.tel}</a>
                    <a href={info.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand bg-white px-5 font-bold text-brand hover:bg-brand-tint"><Icon name="globe" size={22} />縣市服務網頁</a>
                  </div>
                </div>
              )}
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-body text-ink"><span className="font-bold text-brand">查詢條件：</span>{summary}・<strong className="text-brand">共 {results.length} 個地點</strong>{loc && '・依距離排序'}</p>
                <div className="flex flex-wrap items-center gap-3">
                  {results.length > 0 && (
                    <button type="button" onClick={askLocation} aria-pressed={!!loc}
                      className={cx('inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-5 font-bold', loc ? 'border-brand bg-brand-tint text-brand' : 'border-sage-line bg-white text-ink hover:border-brand')}>
                      {loc && <Icon name="check" size={20} />}<Icon name="pin" size={22} />{locState === 'asking' ? '取得位置中…' : loc ? '依距離排序中' : '依我的位置排序'}
                    </button>
                  )}
                  <div role="group" aria-label="顯示方式" className="flex rounded-full border-2 border-sage-line bg-white p-1">
                    {([['list', '清單', 'list'], ['map', '地圖', 'map']] as const).map(([v, label, icon]) => (
                      <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}
                        className={cx('inline-flex min-h-11 items-center gap-1.5 rounded-full px-5 font-bold', view === v ? 'bg-brand text-white' : 'text-ink hover:bg-sage-card')}>
                        <Icon name={icon} size={22} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {locState === 'denied' && (
                <p role="status" className="mb-4 flex items-start gap-2 rounded-md bg-sage-card px-4 py-3 text-body text-ink"><Icon name="info" className="mt-0.5 shrink-0 text-brand" />無法取得您的位置。您可以在瀏覽器允許定位，或直接用行政區篩選。位置只在您的裝置上計算，不會傳送出去。</p>
              )}

              {results.length === 0 ? (
                <StateView state="empty" title={!hasKind ? `目前尚未匯入「${typeLabel}」資料` : `${q.county}${q.district}目前沒有符合的地點`}
                  action={<Button variant="secondary" onClick={() => { setStatus('idle'); setCounty(''); setDistrict(''); setType(''); }}>重新設定條件</Button>}>
                  {!hasKind
                    ? '為確保資訊正確，本平台只顯示來自官方清冊的服務單位。目前已匯入共照中心、失智據點（含權責型）與團體家屋，其他類型將陸續加入。'
                    : '可以改選「全部行政區」或「全部服務類型」，或打上方的縣市服務窗口詢問。'}
                </StateView>
              ) : view === 'map' ? (
                <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
                  <div id="res-map-box" className="lg:sticky lg:top-28 lg:self-start">
                    <Suspense fallback={<div className="flex h-[420px] items-center justify-center rounded-lg bg-sage-card text-body text-ink lg:h-[600px]">地圖載入中…</div>}>
                      <ResourceMap places={placesOnMap} selectedId={selected} onSelect={selectFromMap} userLoc={loc}
                        className="z-0 h-[420px] w-full overflow-hidden rounded-lg border-2 border-sage-line lg:h-[600px]" />
                    </Suspense>
                    <MapLegend />
                    <p className="mt-2 flex items-start gap-1.5 text-small text-ink-muted"><Icon name="info" size={18} className="mt-0.5 shrink-0" />{RES_META.geoNote}地圖縮小時以小圓點顯示，放大後會出現與清單對應的編號。</p>
                  </div>
                  <div className="space-y-4 lg:max-h-[680px] lg:self-start lg:overflow-y-auto lg:pr-2" aria-label="地點清單">
                    {results.slice(0, shown).map((r, i) => (
                      <PlaceCard key={r.p.id} p={r.p} n={i + 1} km={r.km} compact selected={selected === r.p.id} onLocate={() => setSelected(r.p.id)} />
                    ))}
                    {results.length > shown && (
                      <div className="text-center"><Button variant="secondary" iconAfter="chevronDown" onClick={() => setShown((n) => n + PAGE * 2)}>顯示更多（還有 {results.length - shown} 筆）</Button></div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {results.slice(0, shown).map((r, i) => (
                      <li key={r.p.id}><PlaceCard p={r.p} n={i + 1} km={r.km} selected={selected === r.p.id} onLocate={() => locate(r.p.id)} /></li>
                    ))}
                  </ul>
                  {results.length > shown && (
                    <div className="mt-6 text-center">
                      <Button variant="secondary" iconAfter="chevronDown" onClick={() => setShown((n) => n + PAGE * 2)}>顯示更多（還有 {results.length - shown} 筆）</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
