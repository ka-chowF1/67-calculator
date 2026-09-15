import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Calculator} from '../dist/engine.js';
function enter(keys){const c=new Calculator();for(const k of keys)c.input(k);return c;}
test('non-67 and invalid finalized inputs return 67',()=>{for(const s of ['12+8*3=','1/0=','5=','=','9999999999999999999999999=','..2..3=','---=','6%/0='])assert.equal(enter(s).entry,'67');});
test('expression stays accurate until equals',()=>assert.equal(enter('12+8*3').expression(),'12 + 8 × 3'));
test('result is the next operand',()=>{const c=enter('2+2=');c.input('+');c.input('5');assert.equal(c.expression(),'67 + 5');c.input('=');assert.equal(c.entry,'67');});
test('operator replacement and decimals',()=>{assert.equal(enter('12+*/3').expression(),'12 ÷ 3');assert.equal(enter('1.2.3').entry,'1.23');});
test('clear entry preserves prior expression; all clear resets it',()=>{const c=enter('12+8');c.input('C');assert.equal(c.expression(),'12 + 0');c.input('3');assert.equal(c.expression(),'12 + 3');c.input('AC');assert.equal(c.expression(),'0');});
test('percent, sign and backspace',()=>{const c=enter('50%');assert.equal(c.entry,'0.5');c.input('sign');assert.equal(c.entry,'-0.5');c.input('Backspace');assert.equal(c.entry,'-0.');});
test('new digit starts fresh after equals',()=>assert.equal(enter('2+2=3').expression(),'3'));
test('actual answers of 67 show Error',()=>{for(const s of ['66+1=','68-1=','67=','60+14/2=','6.7*10=','66.9+0.1=','201/3=','6700%='])assert.equal(enter(s).entry,'Error',s);});
test('other answers still show 67 with standard precedence',()=>{for(const s of ['2310*8=','2+3*13=','67.00000000000001=','1/0+67=','67+='])assert.equal(enter(s).entry,'67',s);});
test('negative operands and results chained from 67 are checked',()=>{const c=enter('68+1');c.input('sign');c.input('=');assert.equal(c.entry,'Error');assert.equal(enter('1+1=+0=').entry,'Error');});
test('error recovery supports new entry and clear controls',()=>{for(const key of ['C','AC','Backspace']){const c=enter('66+1=');c.input(key);assert.equal(c.entry,'0');}assert.equal(enter('66+1=2+3=').entry,'67');});
