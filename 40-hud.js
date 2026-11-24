'use strict';
function toast(msg,ms){state.log.unshift(msg);if(state.log.length>80)state.log.pop();const t=$('toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>t.classList.add('hidden'),ms||2800)}
function money(){setText($('cash'),'₹'+state.cash.toLocaleString('en-IN'))}
function stars(){[...$('stars').querySelectorAll('span')].forEach((s,i)=>s.classList.toggle('on',i<state.wanted))}
function drawWorld(g,w,h,cx,cz,s,full){
  const X=x=>w/2+(x-cx)*s,Z=z=>h/2+(z-cz)*s;
  g.fillStyle='#8f8458';g.fillRect(0,0,w,h);g.fillStyle='#8aa74e';g.fillRect(0,Z(106),w,Math.max(0,Z(138)-Z(106)));
  g.fillStyle='#2b86b0';g.fillRect(0,0,w,Math.max(0,Z(NORTH)));
  g.fillStyle='#3b3d43';ROADS.forEach(r=>{const rw=r[4]?r[3]:r[2],rh=r[4]?r[2]:r[3];g.fillRect(X(r[0])-rw*s/2,Z(r[1])-rh*s/2,rw*s,rh*s)});
  g.fillStyle='#b99a6a';ALL_BUILDINGS.forEach(b=>g.fillRect(X(b.x)-b.w*s/2,Z(b.z)-8*s,b.w*s,16*s));HOMES.forEach(b=>g.fillRect(X(b[0])-b[2]*s/2,Z(b[1])-8*s,b[2]*s,16*s));
  g.fillStyle='#f7d28a';g.fillRect(X(0)-5*s,Z(-57)-5*s,10*s,10*s);
  g.fillStyle='#f7b500';g.fillRect(X(10)-4,Z(10)-4,8,8);
  if(full){g.font='bold 11px sans-serif';g.textAlign='center';g.fillStyle='#fff';ALL_BUILDINGS.forEach(b=>g.fillText(b.t,X(b.x),Z(b.z)+3));g.fillText('LAKE TEMPLE',X(0),Z(-57)+3);g.fillText('UDAAN GARAGE',X(10),Z(10)-9);g.fillText('CITY GATE',X(0),Z(72));g.fillText('MANGO LAKE',X(0),Z(NORTH)-14);g.fillStyle='rgba(255,255,255,.4)';g.font='bold 17px sans-serif';[['GULABI GULLY',-42,44],['CHOWK BAZAAR',32,-2],['NAYA NAGAR',112,-2],['KHET EDGE',0,124]].forEach(a=>g.fillText(a[0],X(a[1]),Z(a[2])));g.font='bold 11px sans-serif';g.fillStyle='#ffd166';chars.forEach(c=>g.fillText(c.n,X(c.x),Z(c.z)-7))}
  if(state.beam){g.fillStyle='#ef4444';g.beginPath();g.arc(X(state.beam.x),Z(state.beam.z),full?6:5,0,7);g.fill()}
  g.fillStyle='#ffd166';chars.forEach(c=>{g.beginPath();g.arc(X(c.x),Z(c.z),full?4:3,0,7);g.fill()});
  g.fillStyle='#38bdf8';vehicles.forEach(v=>{if(v===active)return;g.beginPath();g.arc(X(v.mesh.position.x),Z(v.mesh.position.z),full?4:3,0,7);g.fill()});
  const pp=(active?active.mesh:player.mesh),pr=pp.rotation.y;
  g.save();g.translate(X(pp.position.x),Z(pp.position.z));g.rotate(Math.PI-pr);g.fillStyle='#22c55e';g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();g.moveTo(0,-8);g.lineTo(6,7);g.lineTo(-6,7);g.closePath();g.fill();g.stroke();g.restore();
}
function updateHud(){
  const sp=active?Math.abs(active.speed):(keys.up||keys.down||keys.left||keys.right?6:0);
  setText($('vName'),active?active.name:'On foot');setText($('vSpeed'),String(Math.round(sp*3)));
  const pr=$('prompt');let msg='';
  const spot=active?null:nearSpot();
  if(active)msg='Get out of the vehicle';
  else if(nearNote())msg='Read the note';
  else if(nearVehicle())msg='Ride the '+nearVehicle().name;
  else if(spot)msg='Open '+spot.name;
  else if(player.mesh.position.distanceTo(marker.pos)<3.2)msg='Open the mission board';
  if(msg){setText(pr,msg);pr.classList.remove('hidden')}else pr.classList.add('hidden');
  const c=(active?active.mesh:player.mesh).position;drawWorld($('radar').getContext('2d'),128,128,c.x,c.z,1.1,false);
}
