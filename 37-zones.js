const ZONES=Object.freeze({east:{name:'Rajmahal Heights',need:3},west:{name:'Purani Basti',need:6},south:{name:'Khet Edge Farms',need:9}});
const VEH_UNLOCK=Object.freeze({auto:0,scooter:0,taxi:2,car:3,bike:6,bus:8});
const NEED_NAME=Object.freeze({scooter:'scooter or bike',taxi:'taxi',auto:'auto',bus:'city bus'});
const NEED_KINDS=Object.freeze({scooter:['scooter','bike'],taxi:['taxi'],auto:['auto'],bus:['bus']});
function needOk(m){return !m.need||!!(active&&NEED_KINDS[m.need].includes(active.kind))}
const UNLOCK_TEXT=Object.freeze({
  2:'The taxi is unlocked. Raju Bhai has taxi fares.',
  3:'Rajmahal Heights is open, and the hatchback car is unlocked.',
  4:'Pappan has auto fares for you.',
  6:'Purani Basti is open, and the roadster bike is unlocked.',
  8:'The city bus is unlocked.',
  9:'Khet Edge Farms is open.',
  10:'Kaveri Didi has bus routes for you.',
  12:'Tara has courier jobs for you.'
});
const barricades={east:[],west:[],south:[]};
function stripeTex(len){
  const c=document.createElement('canvas');c.width=128;c.height=32;const g=c.getContext('2d');
  g.fillStyle='#f97316';g.fillRect(0,0,128,32);g.fillStyle='#ffffff';
  for(let i=-1;i<5;i++){g.beginPath();g.moveTo(i*32,32);g.lineTo(i*32+16,32);g.lineTo(i*32+32,0);g.lineTo(i*32+16,0);g.fill()}
  const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;t.repeat.set(len/6,1);return t;
}
function buildBarricades(){
  const add=(zone,x,z,len,alongX,signs)=>{
    const bar=new THREE.Mesh(new THREE.BoxGeometry(alongX?len:.8,1.6,alongX?.8:len),new THREE.MeshStandardMaterial({map:stripeTex(len)}));
    bar.position.set(x,.8,z);scene.add(bar);barricades[zone].push(bar);
    signs.forEach(s=>{
      const m=new THREE.Mesh(new THREE.PlaneGeometry(8,2.2),new THREE.MeshBasicMaterial({map:signTex('ROAD CLOSED','#7f1d1d','#ffffff',ZONES[zone].name+' opens after Level '+ZONES[zone].need)}));
      m.position.set(s[0],3.2,s[1]);m.rotation.y=s[2];scene.add(m);barricades[zone].push(m);
    });
  };
  add('east',139.5,38,200,false,[[139,0,-Math.PI/2],[139,-48,-Math.PI/2],[139,96,-Math.PI/2]]);
  add('west',-139.5,38,200,false,[[-139,0,Math.PI/2],[-139,-48,Math.PI/2],[-139,96,Math.PI/2]]);
  add('south',0,139.5,278,true,[[0,139,Math.PI],[-48,139,Math.PI],[48,139,Math.PI],[-96,139,Math.PI],[96,139,Math.PI]]);
}
function checkUnlocks(){
  const n=state.done.size;
  Object.keys(ZONES).forEach(k=>{
    if(!state.zones[k]&&n>=ZONES[k].need){state.zones[k]=true;barricades[k].forEach(m=>scene.remove(m));barricades[k]=[]}
  });
  return UNLOCK_TEXT[n]||'';
}
function vehLocked(v){return !v.free&&state.done.size<VEH_UNLOCK[v.kind]}
function inLocked(x,z){return(!state.zones.east&&x>137)||(!state.zones.west&&x<-137)||(!state.zones.south&&z>137)}
function lockHint(k){
  const t=performance.now();if(t-state.hint<5000)return;state.hint=t;
  toast(ZONES[k].name+' opens after Level '+ZONES[k].need+'.',3200);
}
function bounds(p,r){
  const z=state.zones,e=z.east?HALF:137,w=z.west?HALF:137,s=z.south?HALF:137;
  if(p.x>e){p.x=e;lockHint('east')}else if(p.x<-w){p.x=-w;lockHint('west')}
  if(p.z>s){p.z=s;lockHint('south')}
  if(p.z<NORTH-r)p.z=NORTH-r;
}
