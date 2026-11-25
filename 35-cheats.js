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
const STREET_ART=Object.freeze([
  {s:'w',x:24,z:24,w:16,k:'petals',t:"Our city's name, said backwards, opens Dad's cash box."},
  {s:'w',x:24,z:-24,w:16,k:'waves',t:'What flows past the temple? Say it the Hindi way. Five letters, two A letters.'},
  {s:'w',x:80,z:-24,w:14,k:'cap',t:'Officers wear it on their heads. A Hindi word with four letters. It starts with T.'},
  {s:'w',x:80,z:60,w:14,k:'wheels',t:"Dev's favourite bus wears a number on its side. Type BUS and that number."},
  {s:'e',x:-24,z:-24,w:16,k:'feathers'},{s:'w',x:-24,z:-24,w:16,k:'petals'},{s:'e',x:24,z:-24,w:16,k:'rays'},
  {s:'w',x:-64,z:-24,w:14,k:'waves'},{s:'e',x:-64,z:-24,w:14,k:'feathers'},{s:'e',x:64,z:-24,w:14,k:'petals'},
  {s:'w',x:64,z:24,w:14,k:'rays'},{s:'e',x:24,z:60,w:16,k:'feathers'},{s:'w',x:-24,z:60,w:16,k:'waves'},
  {s:'e',x:-24,z:24,w:16,k:'petals'},{s:'w',x:114,z:24,w:18,k:'feathers'},{s:'e',x:-114,z:60,w:18,k:'rays'}
]);
function wrapText(g,text,cx,y,maxW,lh){
  let line='';
  text.split(' ').forEach(word=>{const test=line?line+' '+word:word;if(g.measureText(test).width>maxW&&line){g.fillText(line,cx,y);line=word;y+=lh}else line=test});
  g.fillText(line,cx,y);
}
function artTexture(kind,text){
  const c=document.createElement('canvas');c.width=512;c.height=320;const g=c.getContext('2d');
  const pal={rays:['#1d3557','#f7b500','#e4452b'],petals:['#3a0ca3','#f72585','#ffd166'],feathers:['#064e3b','#0ea5e9','#facc15'],waves:['#0b3954','#4cc9f0','#f1faee'],wheels:['#7f1d1d','#fde047','#f8fafc'],cap:['#1e3a8a','#93c5fd','#f8fafc']}[kind];
  g.fillStyle=pal[0];g.fillRect(0,0,512,320);g.strokeStyle=pal[1];g.fillStyle=pal[1];g.lineWidth=8;g.lineCap='round';
  if(kind==='rays'){g.beginPath();g.arc(256,130,46,0,7);g.fillStyle=pal[2];g.fill();g.strokeStyle=pal[1];for(let i=0;i<16;i++){const a=i*Math.PI/8;g.beginPath();g.moveTo(256+Math.cos(a)*62,130+Math.sin(a)*62);g.lineTo(256+Math.cos(a)*100,130+Math.sin(a)*100);g.stroke()}}
  else if(kind==='petals'){for(let i=0;i<8;i++){g.save();g.translate(256,140);g.rotate(i*Math.PI/4);g.beginPath();g.ellipse(0,-62,24,56,0,0,7);g.fillStyle=i%2?pal[1]:pal[2];g.fill();g.restore()}g.beginPath();g.arc(256,140,26,0,7);g.fillStyle='#fff';g.fill()}
  else if(kind==='feathers'){for(let i=0;i<9;i++){g.strokeStyle=i%2?pal[1]:pal[2];g.beginPath();g.arc(256,230,50+i*14,Math.PI*1.1,Math.PI*1.9);g.stroke()}g.beginPath();g.arc(256,230,26,0,7);g.fillStyle=pal[2];g.fill()}
  else if(kind==='waves'){for(let r=0;r<5;r++){g.strokeStyle=r%2?pal[1]:pal[2];g.beginPath();for(let x=0;x<=512;x+=8){const y=50+r*38+Math.sin(x/32+r)*14;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}}
  else if(kind==='wheels'){g.fillStyle=pal[1];g.fillRect(90,70,332,100);g.fillStyle=pal[0];for(let i=0;i<5;i++)g.fillRect(110+i*60,86,44,40);g.fillStyle=pal[2];[170,350].forEach(x=>{g.beginPath();g.arc(x,180,26,0,7);g.fill()})}
  else{g.beginPath();g.arc(256,150,80,Math.PI,0);g.fillStyle=pal[1];g.fill();g.fillStyle=pal[2];g.fillRect(150,148,230,22);g.fillStyle='#facc15';g.beginPath();g.arc(256,100,14,0,7);g.fill()}
  if(text){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,196,512,124);g.fillStyle='#ffffff';g.font='bold 25px sans-serif';g.textAlign='center';g.textBaseline='top';wrapText(g,text,256,206,470,32)}
  return new THREE.CanvasTexture(c);
}
function buildStreetArt(){
  STREET_ART.forEach(a=>{
    const m=new THREE.Mesh(new THREE.PlaneGeometry(7,4.375),new THREE.MeshBasicMaterial({map:artTexture(a.k,a.t)}));
    m.position.set(a.x+(a.s==='w'?-(a.w/2+.07):a.w/2+.07),3.6,a.z);m.rotation.y=a.s==='w'?-Math.PI/2:Math.PI/2;scene.add(m);
  });
}
