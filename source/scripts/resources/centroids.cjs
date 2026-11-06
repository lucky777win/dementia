const topo=require('topojson-client'),polylabel=require('polylabel'),fs=require('fs');
const t=JSON.parse(fs.readFileSync('package/villages-10t.json'));
function pt(f){ // largest polygon's pole of inaccessibility
  const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
  let best=null,ba=-1; for(const p of polys){ const r=p[0]; let a=0; for(let i=0,j=r.length-1;i<r.length;j=i++) a+=(r[j][0]+r[i][0])*(r[j][1]-r[i][1]); a=Math.abs(a); if(a>ba){ba=a;best=p;} }
  const c=polylabel(best,0.0001); return [+c[1].toFixed(5),+c[0].toFixed(5)];
}
const norm=s=>s.replace(/台/g,'臺');
const out={village:{},town:{}};
for(const f of topo.feature(t,t.objects.villages).features){ if(!f.geometry) continue; const p=f.properties; out.village[norm(p.COUNTYNAME)+norm(p.TOWNNAME)+p.VILLNAME]=pt(f); }
for(const f of topo.feature(t,t.objects.towns).features){ if(!f.geometry) continue; const p=f.properties; out.town[norm(p.COUNTYNAME)+norm(p.TOWNNAME)]=pt(f); }
fs.writeFileSync('../res/centroids.json',JSON.stringify(out));
console.log(Object.keys(out.village).length,Object.keys(out.town).length, out.town['臺北市中山區'], out.town['臺中市北區']);
