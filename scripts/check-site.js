import {readFileSync, existsSync, readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import {resolve, dirname} from 'node:path';
const root=resolve('dist');
const html=readFileSync(resolve(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  const url=match[1];
  if(url.startsWith('data:')||url.startsWith('#'))continue;
  assert(!url.startsWith('/')&&!url.includes('://'),'Assets must use relative paths: '+url);
  assert(existsSync(resolve(root,url)), 'Missing asset: '+url);
}
for(const file of readdirSync(root)){
  if(!file.endsWith('.js'))continue;
  const path=resolve(root,file),source=readFileSync(path,'utf8');
  for(const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g))assert(existsSync(resolve(dirname(path),match[1])),'Missing import: '+match[1]);
  assert(!/console\.log\(/.test(source),'Unexpected debug logging: '+file);
}
assert(html.includes('<title>67 Calculator</title>'));
assert(html.includes('rel="icon"'));
console.log('Static entry point, assets, imports, and metadata verified.');
