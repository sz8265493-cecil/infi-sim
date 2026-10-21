"""Build a deterministic browser catalog from official Army API snapshots.
Usage: python3 scripts/build-army-catalog.py UNITS_JSON METADATA_JSON
No private Tactical_Helper source is bundled.
"""
import json,sys,pathlib,re
u=json.load(open(sys.argv[1]));m=json.load(open(sys.argv[2]));f=u['filters']
translations={}
if len(sys.argv)>3:
 for a,b in re.findall(r'"([^"\n]+)"\s*:\s*"([^"\n]+)"',pathlib.Path(sys.argv[3]).read_text()):translations[a.casefold()]=b
lookup=lambda k:{x['id']:x for x in f[k]}
extra=lookup('extras')
def term(x,k):
 x={'id':-1,**x}; d=lookup(k).get(x['id'],{}); ex=[extra.get(i,{'name':f'UNKNOWN:{i}'}) for i in (x.get('extra') or [])]
 return {'id':x['id'],'name':d.get('name',f'UNKNOWN:{x["id"]}'),'zh':translations.get(d.get('name','').casefold()),'extras':ex,'q':x.get('q',1)}
entries=[]
auxiliaryEntries=[]
for unit in u['units']:
 for g in unit['profileGroups']:
  for o in g['options']:
   p=g['profiles'][0] if len(g['profiles'])==1 else None
   e={'unitId':unit['id'],'groupId':g['id'],'optionId':o['id'],'avaKey':str(unit['id'])+':'+str(g.get('isc') or g['id']),'slug':unit['slug'],'name':o['name'],'zh':translations.get(o['name'].casefold()),'unitName':unit['name'],'points':o['points'],'swc':o['swc'],'orders':o.get('orders',[]),'minis':o.get('minis',1),'ambiguousProfiles':len(g['profiles'])!=1}
   if p:
    e.update(stats={k:p[k] for k in ['bs','cc','ph','wip','arm','bts','s','w','move','str','type','ava']},logo=p.get('logo'),skills=[term(x,'skills') for x in p['skills']+o['skills']],equip=[term(x,'equip') for x in p['equip']+o['equip']],weapons=[term(x,'weapons') for x in p['weapons']+o['weapons']],chars=[lookup('chars')[x]['name'] for x in set(p['chars']+o['chars'])],includes=p.get('includes',[])+o.get('includes',[]),peripheral=p.get('peripheral',[])+o.get('peripheral',[]))
   (auxiliaryEntries if o.get('disabled') else entries).append(e)
faction=int(sys.argv[4]) if len(sys.argv)>4 else 201
out={'factionId':faction,'faction':{201:'Yu Jing',103:'Military Orders'}[faction],'version':u['version'],'accessed':'2026-10-21','source':f'https://api.corvusbelli.com/army/units/en/{faction}','metadataSource':'https://api.corvusbelli.com/army/infinity/en/metadata','fireteamChart':u.get('fireteamChart'),'entries':entries,'auxiliaryEntries':auxiliaryEntries,'weapons':m['weapons'],'ammunitions':m['ammunitions'],'types':f['type']}
pathlib.Path('dist/assets/army-yujing.json' if faction==201 else f'dist/assets/army-{faction}.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')))
print(len(entries),'exact configurations')

# Keep the runtime Fireteams chart and exact configuration membership in sync.
ft_path=pathlib.Path('dist/fireteam-data.js')
ft_data=json.loads(ft_path.read_text().split('=',1)[1].strip().removesuffix(';')) if ft_path.exists() else {}
ft_data[str(faction)]={'version':u['version'],'source':out['source'],'chart':u.get('fireteamChart'),'configurations':['/'.join(str(e[k]) for k in ['unitId','groupId','optionId']) for e in entries]}
ft_path.write_text('export const CHARTS='+json.dumps(ft_data,ensure_ascii=False,separators=(',',':'))+';\n')
