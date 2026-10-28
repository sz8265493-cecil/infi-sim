import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('../dist/',import.meta.url));
test('browser references share one version for each module, including transitive weapon registries',()=>{
 const refs=new Map();
 for(const file of readdirSync(dir).filter(f=>/\.(?:js|html)$/.test(f))){
  const text=readFileSync(dir+file,'utf8');
  for(const [,name,version] of text.matchAll(/(?:\.\/)?([\w-]+\.js)\?v=(\d+)/g)){
   if(!refs.has(name))refs.set(name,new Set());refs.get(name).add(version);
  }
 }
 assert.ok(refs.has('combat.js'));assert.ok(refs.has('army-import.js'));
 for(const [name,versions] of refs)assert.equal(versions.size,1,`${name} loaded as multiple module instances: ${[...versions]}`);
});
