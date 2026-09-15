// Exact fractions avoid rounding decimal expressions into or away from 67.
function fraction(value) {
  const match = /^(-?)(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(value);
  if (!match) throw new Error('Invalid operand');
  const decimals = match[3] || '';
  const scale = decimals.length - Number(match[4] || 0);
  let numerator = BigInt(match[2] + decimals) * (match[1] ? -1n : 1n);
  return scale >= 0 ? [numerator, 10n ** BigInt(scale)] : [numerator * 10n ** BigInt(-scale), 1n];
}
function combine([a,b], op, [c,d]) {
  if (op === '+') return [a*d+c*b,b*d];
  if (op === '-') return [a*d-c*b,b*d];
  if (op === '*') return [a*c,b*d];
  if (c === 0n) throw new Error('Division by zero');
  return [a*d,b*c];
}
function equals67(tokens) {
  try {
    if (!tokens.length || tokens.length % 2 === 0) return false;
    let total = [0n,1n], term = fraction(tokens[0]), addition = '+';
    for (let i=1;i<tokens.length;i+=2) {
      const op=tokens[i], next=fraction(tokens[i+1]);
      if (op === '*' || op === '/') term=combine(term,op,next);
      else {total=combine(total,addition,term);addition=op;term=next;}
    }
    const [numerator,denominator]=combine(total,addition,term);
    return numerator === 67n * denominator;
  } catch { return false; }
}

export class Calculator {
  constructor(){this.clear();}
  clear(){this.parts=[];this.entry='0';this.fresh=true;this.solved=false;this.history='';}
  expression(){return [...this.parts,...(this.fresh&&this.parts.length?[]:[this.entry])].join(' ').replaceAll('*','×').replaceAll('/','÷');}
  input(key){
    if(key==='AC'){this.clear();return;}
    if(key==='='){const tokens=[...this.parts,...(this.fresh&&this.parts.length?[]:[this.entry])];this.history=this.expression()+' =';this.parts=[];this.entry=equals67(tokens)?'Error':'67';this.fresh=true;this.solved=true;return;}
    if(this.entry==='Error')this.clear();
    if(key==='C'){this.entry='0';this.fresh=false;this.solved=false;this.history='';return;}
    if(/^\d$/.test(key)||key==='.'){
      if(this.solved)this.clear();
      if(this.fresh){this.entry='0';this.fresh=false;}
      if(key==='.'){if(!this.entry.includes('.'))this.entry+='.';}
      else if(this.entry.replace('-','').length<20){this.entry=this.entry==='0'?key:this.entry==='-0'?'-'+key:this.entry+key;}
      return;
    }
    if(['+','-','*','/'].includes(key)){
      if(this.solved){this.parts=[];this.solved=false;this.fresh=false;this.history='';}
      if(this.fresh&&this.parts.length)this.parts[this.parts.length-1]=key;
      else this.parts.push(this.entry,key);
      this.fresh=true;return;
    }
    if(key==='Backspace'){
      if(this.solved){this.clear();return;}
      if(this.fresh&&this.parts.length){this.parts.pop();this.entry=this.parts.pop()||'0';this.fresh=false;}
      else {this.entry=this.entry.slice(0,-1);if(!this.entry||this.entry==='-')this.entry='0';}return;
    }
    if(key==='sign'||key==='%'){
      if(this.fresh&&this.parts.length)this.entry='0';
      if(key==='sign')this.entry=this.entry.startsWith('-')?this.entry.slice(1):'-'+this.entry;
      else this.entry=String(Number((Number(this.entry)/100).toPrecision(12)));
      this.solved=false;this.history='';this.fresh=false;
    }
  }
}
