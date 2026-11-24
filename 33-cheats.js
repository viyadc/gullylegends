'use strict';
const NOTES=Object.freeze([
  {x:21,z:17,text:"A note in Dad's handwriting: The cash box opens with the name of our city, read backwards."},
  {x:6,z:-62,text:'A wet note by the water: What flows past the temple? Say it the Hindi way. It has five letters and two A letters.'},
  {x:80,z:-36,text:'A folded note: Officers wear it on their heads. It is a Hindi word with four letters and it starts with T.'},
  {x:80,z:72,text:"A torn ticket with a note: Dev's favourite bus has a number on its side. Type BUS and then that number."}
]);
const CODES=Object.freeze({
  RUPAYAN:()=>{state.cash+=5000;money();toast('The cash box opened! ₹5,000 is yours.',4200)},
  PAANI:()=>{heal(100);state.vest=true;toast('You feel fresh as water. Health is full and you got a vest.',4200)},
  TOPI:()=>{setWanted(0);toast('The officers tipped their caps and walked away.',4200)},
  BUS108:()=>{const r=player.mesh.position;makeVehicle('bus',r.x+7,r.z,Math.PI/2);toast('Dev sent his bus for you!',4200)}
});
const CODE_LIST=Object.keys(CODES);
function cheatKey(c){
  const ch=c.startsWith('Key')?c.slice(3):c.startsWith('Digit')?c.slice(5):'';
  if(!ch)return false;
  let t=state.buf+ch,hit=CODE_LIST.find(w=>w.startsWith(t));
  if(!hit){t=ch;hit=CODE_LIST.find(w=>w.startsWith(t))}
  state.buf=hit?t:'';
  if(hit&&hit===t){state.buf='';CODES[hit]();return true}
  return !!hit&&t.length>1;
}
function nearNote(){const p=player.mesh.position;return NOTES.find(n=>Math.hypot(p.x-n.x,p.z-n.z)<2)}
function readNote(n){toast(n.text,9000);audio.chime()}
function buildNotes(){NOTES.forEach((n,i)=>{const m=block(.5,.02,.36,0xfff8e7,n.x,.05,n.z);m.rotation.y=.4+i;m.castShadow=false})}
