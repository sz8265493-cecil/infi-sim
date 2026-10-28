import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {localImage} from '../dist/local-assets.js?v=122';
const root=new URL('../',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('docs/rules/LOCAL_ASSETS.json',root)));
test('every localized image is packaged intact and old saved URLs resolve locally',async()=>{
 for(const image of manifest.images){
  const bytes=await readFile(new URL('dist/'+image.path,root));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),image.sha256,image.path);
  assert.equal(localImage(image.source),image.path);
 }
 assert.equal(localImage('https://unknown.example/logo.svg'),'assets/unavailable.svg');
 assert.equal(localImage('//unknown.example/logo.svg'),'assets/unavailable.svg');
 assert.equal(localImage('assets/../../logo.svg'),'assets/unavailable.svg');
});
test('army catalogs contain only packaged image references',async()=>{
 for(const filename of ['army-103.json','army-yujing.json','army-loadouts.json']){
  const data=JSON.parse(await readFile(new URL('dist/assets/'+filename,root)));
  const paths=[];
  function visit(v){if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(k==='logo'&&x){assert.match(x,/^assets\//);paths.push(x);}else visit(x);}}
  visit(data);for(const path of new Set(paths))assert.ok((await readFile(new URL('dist/'+path,root))).length,path);
 }
});
test('CSS has no network font dependencies and state images are local',async()=>{
 const css=await readFile(new URL('dist/style.css',root),'utf8');assert.doesNotMatch(css,/@import|https?:\/\/|fonts\.google/i);
 const state=await readFile(new URL('dist/state-ui.js',root),'utf8');assert.doesNotMatch(state,/https:\/\/assets\.corvusbelli/);
 for(const match of state.matchAll(/icons:\['(assets\/[^']+)'\]/g))assert.ok((await readFile(new URL('dist/'+match[1],root))).length);
});
