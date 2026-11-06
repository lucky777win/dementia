import re,unicodedata
COUNTIES=['臺北市','新北市','桃園市','臺中市','臺南市','高雄市','基隆市','新竹市','嘉義市','新竹縣','苗栗縣','彰化縣','南投縣','雲林縣','嘉義縣','屏東縣','宜蘭縣','花蓮縣','臺東縣','澎湖縣','金門縣','連江縣']
def clean(a):
    a=unicodedata.normalize('NFKC',a).replace(' ','').replace('　','')
    for c in ['台北市','台中市','台南市','台東縣','台東市']:
        a=a.replace(c,c.replace('台','臺'))
    # duplicated prefix e.g. 新北市土城區埤塘里新北市土城區埤塘里003鄰...
    m=re.match(r'^((?:%s).{1,4}?[區鄉鎮市])(.*?)(\1)'%'|'.join(COUNTIES),a)
    if m: a=a[m.start(3):]
    return a
def county_of(a):
    for c in COUNTIES:
        if a.startswith(c): return c
    return None
def district_of(a,c):
    r=a[len(c):] if c and a.startswith(c) else a
    m=re.match(r'^(.{1,3}?區)',r) or re.match(r'^(.{1,3}?[鄉鎮市])',r)
    return m.group(1) if m else ''
def key(a,c,d):
    r=a[len(c)+len(d):]
    r=re.sub(r'\(.*?\)|（.*?）','',r)
    r=re.sub(r'\d+鄰','',r)
    r=re.sub(r'^(?:[^\d路街道巷]{1,3}?[里村])(?=[^里村\d])','',r)   # 里/村
    r=r.replace('台','臺')
    CN='零一二三四五六七八九十'
    r=re.sub(r'(?<![\d一二三四五六七八九十])([一二三四五六七八九])號',lambda m:str(CN.index(m.group(1)))+'號',r)
    r=re.sub(r'(\d{1,2})段',lambda m: (CN[int(m.group(1))] if int(m.group(1))<=10 else m.group(1))+'段',r)
    if re.search(r'^\d+號$|\d+號',r) is None: r=re.sub(r'(?<=[路街])([一二三四五六七八九])號',lambda m:str(CN.index(m.group(1)))+'號',r)
    r=re.sub(r'(?<=\d)之(?=\d)','-',r)
    r=r.replace('—','-').replace('－','-')
    m=re.search(r'號',r)
    if m: r=r[:m.end()]
    return c+d+r
