import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RES_COLOR, RES_SHORT, type Place } from '../data/resources';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function icon(n: number, color: string, active: boolean) {
  return L.divIcon({
    className: '',
    html: `<span class="res-pin${active ? ' res-pin--active' : ''}" style="--pin:${color}">${n}</span>`,
    iconSize: active ? [40, 40] : [32, 32],
    iconAnchor: active ? [20, 20] : [16, 16],
    popupAnchor: [0, -18],
  });
}

/**
 * 資源地圖（Leaflet）：點位編號與清單編號一致；點選點位 → onSelect，清單選取 → 地圖移到該點並開啟說明。
 * 地圖為輔助，所有資訊都在清單中，鍵盤與螢幕報讀以清單為主。
 */
export function ResourceMap({ places, selectedId, onSelect, userLoc, className }: {
  places: Place[]; selectedId: string | null; onSelect: (id: string) => void;
  userLoc?: { lat: number; lng: number } | null; className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  const userMarker = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!box.current || map.current) return;
    const m = L.map(box.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([23.7, 120.95], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, subdomains: 'abc',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 貢獻者',
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    // 縮小檢視時點位改成小圓點，避免編號互相遮蓋；放大後顯示編號
    const syncZoom = () => m.getContainer().classList.toggle('res-far', m.getZoom() < 12);
    m.on('zoomend', syncZoom); syncZoom();
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  // 重畫點位
  useEffect(() => {
    const m = map.current, g = layer.current;
    if (!m || !g) return;
    g.clearLayers(); markers.current.clear();
    places.forEach((p, i) => {
      const t = p.s[0].t;
      const mk = L.marker([p.lat, p.lng], { icon: icon(i + 1, RES_COLOR[t], p.id === selectedId), title: `${i + 1}. ${p.s[0].n}`, keyboard: true, riseOnHover: true })
        .bindPopup(`<div class="res-pop"><p class="res-pop__k">${i + 1}・${esc(p.s.map((s) => RES_SHORT[s.t]).filter((v, j, a) => a.indexOf(v) === j).join('／'))}</p><p class="res-pop__n">${esc(p.s[0].n)}</p><p class="res-pop__a">${esc(p.a)}</p>${p.pr === 'd' ? '<p class="res-pop__note">位置為行政區中心（約略）</p>' : ''}</div>`)
        .on('click', () => onSelect(p.id));
      mk.addTo(g); markers.current.set(p.id, mk);
    });
    if (places.length) {
      const b = L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number]));
      if (userLoc) b.extend([userLoc.lat, userLoc.lng]);
      m.fitBounds(b, { padding: [36, 36], maxZoom: 15 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  // 選取變化：更新樣式並移動
  useEffect(() => {
    places.forEach((p, i) => markers.current.get(p.id)?.setIcon(icon(i + 1, RES_COLOR[p.s[0].t], p.id === selectedId)).setZIndexOffset(p.id === selectedId ? 1000 : 0));
    const mk = selectedId ? markers.current.get(selectedId) : null;
    if (mk && map.current) { map.current.setView(mk.getLatLng(), Math.max(map.current.getZoom(), 14), { animate: true }); mk.openPopup(); }
  }, [selectedId, places]);

  // 使用者位置
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    userMarker.current?.remove();
    if (userLoc) userMarker.current = L.circleMarker([userLoc.lat, userLoc.lng], { radius: 9, color: '#FFFFFF', weight: 3, fillColor: '#2F6FD6', fillOpacity: 1 }).bindTooltip('您的位置').addTo(m);
  }, [userLoc]);

  // 容器尺寸改變（切換檢視、字級）時重算
  useEffect(() => {
    const ro = new ResizeObserver(() => map.current?.invalidateSize());
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  return <div ref={box} className={className} role="region" aria-label="資源地圖（輔助檢視，完整資訊請看清單）" />;
}
