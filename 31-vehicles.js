'use strict';
const HANDLING=Object.freeze({auto:{L:1.8,lean:.04},taxi:{L:2.4,lean:.05},scooter:{L:1.2,lean:-.4},car:{L:2.6,lean:.05},bus:{L:5.6,lean:.03},bike:{L:1.4,lean:-.45}});
const VEHICLES=Object.freeze({
  auto:{name:'Kaali-Peeli Auto',max:22,acc:16,r:1.5,seat:[0,.15,.25],paint:[1],parts:[[1.6,.55,2.6,0x151515,0,.5,0],[1.7,.12,1.9,0xfacc15,0,2.35,-.3],[.08,1.7,.08,0xfacc15,-.8,1.4,.5],[.08,1.7,.08,0xfacc15,.8,1.4,.5],[.08,1.7,.08,0xfacc15,-.8,1.4,-1.1],[.08,1.7,.08,0xfacc15,.8,1.4,-1.1],[1.4,.5,.1,0xbfe3f0,0,1.3,.6,{transparent:true,opacity:.35}],[1.5,.5,.5,0x7c2d12,0,.95,-.7]],wheels:[[0,.35,1.1,.35],[-.85,.35,-.7,.35],[.85,.35,-.7,.35]]},
  taxi:{name:'Ambassador Taxi',max:28,acc:19,r:1.8,seat:[-.45,.2,.3],paint:[1,3],parts:[[1.8,.5,3.4,0x151515,0,.55,0],[1.8,.45,3.4,0xfacc15,0,1.03,0],[1.6,1.1,1.8,0xbfe3f0,0,1.75,-.2,{transparent:true,opacity:.3}],[1.7,.12,1.9,0xfacc15,0,2.35,-.2]],wheels:[[-.95,.38,-.95,.38],[.95,.38,-.95,.38],[-.95,.38,.95,.38],[.95,.38,.95,.38]]},
  scooter:{name:'Bajaj Scooter',max:26,acc:21,r:1.1,seat:[0,.12,-.15],paint:[0],parts:[[.6,.5,1.6,0x0d9488,0,.5,0],[.5,.15,.7,0x1f2937,0,.78,-.1],[.5,.7,.1,0x334155,0,.9,.6],[.5,.05,.05,0x111111,0,1.3,.6]],wheels:[[0,.25,.6,.25],[0,.25,-.6,.25]]},
  car:{name:'Hatchback Car',max:32,acc:22,r:1.9,seat:[-.45,.2,.2],paint:[0,3],parts:[[1.8,.6,3.8,0xd23c3c,0,.65,0],[1.6,1.1,2,0xbfe3f0,0,1.75,-.2,{transparent:true,opacity:.3}],[1.7,.12,2.1,0x1f2937,0,2.35,-.2],[1.8,.25,.2,0x111111,0,.45,1.85],[1.8,.25,.2,0x111111,0,.45,-1.85]],wheels:[[-.95,.38,-1.2,.38],[.95,.38,-1.2,.38],[-.95,.38,1.2,.38],[.95,.38,1.2,.38]]},
  bus:{name:'City Bus',max:18,acc:10,r:3.3,seat:[.6,1,3.3],paint:[0,2],plate:'BUS 108',parts:[[3,1.2,9,0xd32f2f,0,1.1,0],[3.02,1.2,8.4,0xbfe3f0,0,2.3,-.2,{transparent:true,opacity:.4}],[3,.15,9,0xd32f2f,0,3,0],[2.9,1.4,.2,0xbfe3f0,0,2.3,4.5,{transparent:true,opacity:.4}]],wheels:[[-1.4,.55,3,.55],[1.4,.55,3,.55],[-1.4,.55,-3,.55],[1.4,.55,-3,.55]]},
  bike:{name:'Royal Roadster Bike',max:30,acc:24,r:1.1,seat:[0,.12,-.2],paint:[1],parts:[[.45,.45,1.7,0x1f2937,0,.55,0],[.45,.35,.7,0x1d4ed8,0,.95,.3],[.4,.12,.8,0x111111,0,.8,-.4],[.12,.7,.12,0x9ca3af,0,.9,.85],[.8,.05,.05,0x111111,0,1.3,.85]],wheels:[[0,.32,.85,.32],[0,.32,-.8,.32]]}
});

function makeVehicle(kind,x,z,rot){
  const d=VEHICLES[kind],g=new THREE.Group();
  const ms=d.parts.map(p=>block(p[0],p[1],p[2],p[3],p[4],p[5],p[6],g,p[7]));
  const wh=[];d.wheels.forEach(w=>{const pv=new THREE.Group();pv.position.set(w[0],w[1],w[2]);const sp=new THREE.Group(),m=cyl(w[3],w[3],.3,0x1f2937,0,0,0,sp,14);m.rotation.z=Math.PI/2;block(.34,.12,.1,0x9ca3af,0,w[3]*.75,0,sp);pv.add(sp);g.add(pv);wh.push({pv,sp,r:w[3],front:w[2]>0})});
  if(d.plate)[-1,1].forEach(s=>{const pl=new THREE.Mesh(new THREE.PlaneGeometry(3,.8),new THREE.MeshBasicMaterial({map:signTex(d.plate,'#7f1d1d','#fde047')}));pl.position.set(s*1.53,1.6,0);pl.rotation.y=s*Math.PI/2;g.add(pl)});
  g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);
  const v={mesh:g,kind,wheels:wh,steer:0,L:HANDLING[kind].L,lean:HANDLING[kind].lean,seat:d.seat,pm:d.paint.map(i=>ms[i]),name:d.name,max:d.max,acc:d.acc,r:d.r,speed:0};vehicles.push(v);return v;
}
function nearVehicle(){let best=null,bd=4;vehicles.forEach(v=>{const d=player.mesh.position.distanceTo(v.mesh.position);if(d<bd){bd=d;best=v}});return best}
function seatPlayer(){
  const r=active.mesh.rotation.y,o=V3(active.seat[0],0,active.seat[2]).applyAxisAngle(V3(0,1,0),r),p=active.mesh.position;
  player.mesh.position.set(p.x+o.x,active.seat[1],p.z+o.z);player.mesh.rotation.y=r;player.mesh.rotation.z=active.mesh.rotation.z;
  player.h.lL.rotation.x=player.h.lR.rotation.x=-1.2;player.h.aL.rotation.x=player.h.aR.rotation.x=-.9;
}
function updateVehicle(v,dt){
  if(keys.up)v.speed=Math.min(v.speed+v.acc*dt,v.max);
  else if(keys.down)v.speed=Math.max(v.speed-v.acc*(v.speed>0?1.8:.6)*dt,-v.max*.35);
  else v.speed*=Math.pow(.55,dt);
  if(keys.space)v.speed*=Math.pow(.05,dt);
  const want=(keys.left?1:0)-(keys.right?1:0);
  v.steer+=(want-v.steer)*Math.min(1,7*dt);
  const ratio=Math.min(1,Math.abs(v.speed)/v.max),ang=v.steer*(.62-.42*ratio);
  v.mesh.rotation.y+=v.speed*Math.tan(ang)/v.L*dt;
  v.speed*=1-Math.abs(ang)*.25*dt;
  v.wheels.forEach(w=>{w.sp.rotation.x+=v.speed*dt/w.r;if(w.front)w.pv.rotation.y=ang});
  v.mesh.rotation.z+=(v.lean*v.steer*ratio-v.mesh.rotation.z)*Math.min(1,6*dt);
  const r=v.mesh.rotation.y;v.mesh.position.x+=Math.sin(r)*v.speed*dt;v.mesh.position.z+=Math.cos(r)*v.speed*dt;
  const sp=Math.abs(v.speed);hitBox=null;
  if(pushOut(v.mesh.position,v.r)&&state.crashCd<=0&&sp>4){
    state.crashCd=1;v.speed*=-.3;audio.crash();
    const b=hitBox;
    if(b&&b.shop&&sp>6){const fee=b.shop==='stall'?40:100,who=b.shop==='stall'?'a stall':b.shop;state.cash=Math.max(0,state.cash-fee);money();toast('You damaged '+who+'. You paid ₹'+fee+' to the owner.',3600)}
  }
  people.forEach(p=>{if(p.down<=0&&sp>3&&Math.hypot(v.mesh.position.x-p.m.position.x,v.mesh.position.z-p.m.position.z)<v.r+.5){p.down=3;audio.thud();v.speed*=.5;setWanted(state.wanted+1);toast('You hit a pedestrian! Someone called the police.',3600)}});
  if(puddleGroup.visible)PUDDLES.forEach(q=>{if(Math.hypot(v.mesh.position.x-q[0],v.mesh.position.z-q[1])<2.4)v.speed*=Math.max(0,1-2*dt)});
  v.mesh.position.x=clamp(v.mesh.position.x,-HALF,HALF);v.mesh.position.z=clamp(v.mesh.position.z,NORTH,HALF);
}
