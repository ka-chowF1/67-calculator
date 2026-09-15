import {Calculator} from './engine.js';
const calc=new Calculator();
const display=document.querySelector('#display'),expression=document.querySelector('#expression'),status=document.querySelector('#status');
function input(key){
 calc.input(key);display.textContent=calc.entry;expression.textContent=calc.solved?calc.history:calc.expression();
 display.style.fontSize=calc.entry.length>12?'28px':calc.entry.length>9?'36px':'52px';
 expression.scrollLeft=expression.scrollWidth;display.scrollLeft=display.scrollWidth;
 status.textContent=calc.solved?'':'READY WHEN YOU ARE';
 if(key==='='){const screen=document.querySelector('.screen');screen.classList.remove('solved');void screen.offsetWidth;screen.classList.add('solved');}
 const button=[...document.querySelectorAll('button')].find(b=>b.dataset.key===key);
 if(button){button.classList.add('pressed');setTimeout(()=>button.classList.remove('pressed'),120);}
}
document.querySelector('.keys').addEventListener('click',e=>{const button=e.target.closest('button');if(button)input(button.dataset.key);});
document.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 const key=({'Enter':'=','Escape':'AC','Delete':'C','x':'*','X':'*',',':'.'})[e.key]||e.key;
 if(/^\d$/.test(key)||['+','-','*','/','.','%','=','AC','C','Backspace'].includes(key)){e.preventDefault();input(key);}
});

if(document.modelContext?.registerTool){
 try{Promise.resolve(document.modelContext.registerTool({
 name:'press_calculator_keys',title:'Use 67 Calculator',
 description:'Press calculator keys in order and return the visible result. Equals returns Error when the actual result is 67, otherwise 67.',
 inputSchema:{type:'object',properties:{keys:{type:'array',items:{type:'string',enum:['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.','%','sign','C','AC','Backspace','=']},maxItems:200}},required:['keys'],additionalProperties:false},
 annotations:{readOnlyHint:false,untrustedContentHint:false},
 execute(value){const allowed=['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.','%','sign','C','AC','Backspace','='];if(!value||!Array.isArray(value.keys)||value.keys.length>200||value.keys.some(k=>!allowed.includes(k)))throw new Error('Provide up to 200 valid calculator keys.');value.keys.forEach(input);return {display:calc.entry,expression:calc.solved?calc.history:calc.expression()};}
 })).catch(()=>{});}catch{}
}
