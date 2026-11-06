import json,re,collections,sys
import pandas as pd
W=sys.argv[1]
rows=json.load(open(W+'/a_rows.json'))
homes=[];sites=[];mode='home'
for pg,title,c,n,a in rows:
    if '失智社區服務據點' in title: mode='site'
    if c in ('縣市',''): continue
    (homes if mode=='home' else sites).append(dict(county=c,name=n.strip(),addr=a.strip()))
ods=pd.read_excel(W+'/c_centers.ods',engine='odf',header=None).iloc[2:]
centers=[dict(county=str(r[0]).strip(),name=str(r[1]).strip(),addr=str(r[2]).strip(),tel=str(r[3]).strip()) for r in ods.itertuples(index=False) if str(r[0])!='nan']
# PDF centers cross-check
import pdfplumber
pc=[]
with pdfplumber.open(W+'/d_centers.pdf') as pdf:
    for p in pdf.pages:
        for t in p.extract_tables():
            for r in t:
                if r[0] and r[0]!='縣市': pc.append([(x or '').replace('\n','') for x in r])
print('homes',len(homes),'sites',len(sites),'centers ods',len(centers),'centers pdf',len(pc))
on={(c['county'],c['name']) for c in centers}; pn={(r[0],r[1]) for r in pc}
print('in pdf not ods',pn-on); print('in ods not pdf',on-pn)
json.dump(dict(homes=homes,sites=sites,centers=centers),open(W+'/raw.json','w'),ensure_ascii=False,indent=0)
