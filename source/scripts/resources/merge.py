import json,sys,re,collections
sys.path.insert(0,'.')
from norm import *
raw=json.load(open('res/raw.json'))
proto=json.load(open('/home/claude/yiqi-care/src/data/content.json'))['SITES']
def nname(n): return re.sub(r'[\(（].*?[\)）]|權責型|失智社區服務據點|據點|\s','',unicodedata.normalize('NFKC',n)).replace('台','臺')
import unicodedata
recs=[]
def add(t,county,name,addr,tel='',hours='',src=''):
    a=clean(addr); c=county_of(a) or county; d=district_of(a,c) if a.startswith(c) else ''
    recs.append(dict(type=t,county=c,dist=d,name=name.strip(),addr=a,tel=tel.strip(),hours=hours,src=src,key=key(a,c,d) if d else c+a))
# Taichung (newer local list)
for s in proto: add(s['type'],'臺中市',s['name'],s['addr'],s['tel'],s['hours'],'tc')
tck={r['key'] for r in recs}; tcn={(r['type'],nname(r['name'])) for r in recs}
dropped=[]
for t,lst in [('center',raw['centers']),('site',raw['sites']),('home',raw['homes'])]:
    for r in lst:
        typ='resp' if (t=='site' and '*' in r['name']) else t
        name=r['name'].replace('(*)','').replace('*','').strip()
        src={'center':'mohw_center','site':'mohw_site','home':'mohw_home'}[t]
        if r['county']=='臺中市' and typ!='home':
            a=clean(r['addr']); d=district_of(a,'臺中市')
            if key(a,'臺中市',d) in tck or (typ,nname(name)) in tcn or ('site',nname(name)) in tcn or ('resp',nname(name)) in tcn: continue
            dropped.append((typ,name,a)); continue
        add(typ,r['county'],name,r['addr'],r.get('tel',''),'',src)
# group into places
places=collections.OrderedDict()
for r in recs:
    p=places.setdefault(r['key'],dict(county=r['county'],dist=r['dist'],addr=r['addr'],services=[]))
    p.setdefault('raw',[]).append(r['addr'])
    if len(r['addr'])>len(p['addr']) and r['src']!='tc' : pass
    if not any(s['type']==r['type'] and nname(s['name'])==nname(r['name']) for s in p['services']):
        p['services'].append({k:r[k] for k in ('type','name','tel','hours','src') if r[k]})
    else:
        s=next(s for s in p['services'] if s['type']==r['type'] and nname(s['name'])==nname(r['name']))
        if r['tel'] and not s.get('tel'): s['tel']=r['tel']
ORDER={'center':0,'resp':1,'site':2,'home':3}
out=[]
for i,(k,p) in enumerate(sorted(places.items(),key=lambda kv:(COUNTIES.index(kv[1]['county']),kv[1]['dist'],min(ORDER[s['type']] for s in kv[1]['services'])))):
    p['services'].sort(key=lambda s:ORDER[s['type']])
    p['id']=f'p{i+1:04d}'; p['key']=k
    out.append(p)
print('records',len(recs),'places',len(out),'dropped taichung',len(dropped))
for d in dropped: print('  drop',d)
multi=[p for p in out if len(p['services'])>1]; print('multi-service places',len(multi))
print(collections.Counter(s['type'] for p in out for s in p['services']))
print(collections.Counter(p['county'] for p in out))
noaddr=[p for p in out if not re.search(r'\d',p['addr'])]; print('no number addr',len(noaddr),[p['addr'] for p in noaddr])
json.dump(out,open('res/places.json','w'),ensure_ascii=False,indent=0)
