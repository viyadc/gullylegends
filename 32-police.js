const ROAD_X=[-192,-144,-96,-48,0,48,96,144,192],ROAD_Z=[-48,0,96,144,192];
const blocks=[];
function roadNode(x,z){let b=null,bd=1e9;ROAD_X.forEach((rx,i)=>ROAD_Z.forEach((rz,j)=>{const d=Math.hypot(x-rx,z-rz);if(d<bd){bd=d;b=[i,j]}}));return b}
function roadPath(a,b){
  const key=n=>n[0]+','+n[1],prev={},q=[a];prev[key(a)]=null;
  while(q.length){
    const n=q.shift();if(n[0]===b[0]&&n[1]===b[1])break;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(s=>{const i=n[0]+s[0],j=n[1]+s[1];if(i<0||j<0||i>=ROAD_X.length||j>=ROAD_Z.length||(key([i,j]) in prev))return;prev[key([i,j])]=n;q.push([i,j])});
  }
  const out=[];let c=b;while(c){out.unshift(c);c=prev[key(c)]}
  return out.map(n=>[ROAD_X[n[0]],ROAD_Z[n[1]]]);
}
function roadPoint(x,z){
  let best=null,bd=1e9;
  ROAD_X.forEach(rx=>{const d=Math.abs(x-rx);if(d<bd){bd=d;best=[rx,clamp(z,-48,HALF)]}});
  ROAD_Z.forEach(rz=>{const d=Math.abs(z-rz);if(d<bd){bd=d;best=[clamp(x,-HALF,HALF),rz]}});
  return best;
}
function steerTo(u,tx,tz,spd,dt){
  const m=u.m;let df=Math.atan2(tx-m.position.x,tz-m.position.z)-m.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));
  m.rotation.y+=clamp(df,-2.4*dt,2.4*dt);
  const s=spd*(1-.55*Math.min(1,Math.abs(df)/1.2));
  m.position.x+=Math.sin(m.rotation.y)*s*dt;m.position.z+=Math.cos(m.rotation.y)*s*dt;pushOut(m.position,1.6);
}
function chaseJeep(u,tp,dt){
  const m=u.m;u.pt=(u.pt||0)-dt;
  if(u.pt<=0){
    u.pt=.6;const rp=roadPoint(tp.x,tp.z),pth=roadPath(roadNode(m.position.x,m.position.z),roadNode(rp[0],rp[1]));
    if(pth.length>1&&Math.hypot(pth[1][0]-m.position.x,pth[1][1]-m.position.z)<Math.hypot(pth[1][0]-pth[0][0],pth[1][1]-pth[0][1]))pth.shift();
    u.wp=[...pth,rp];
  }
  let wp=null;
  while(u.wp&&u.wp.length){const q=u.wp[0];if(u.wp.length>1&&Math.hypot(q[0]-m.position.x,q[1]-m.position.z)<7)u.wp.shift();else{wp=q;break}}
  if(!wp)return;
  const wx=wp[0]-m.position.x,wz=wp[1]-m.position.z,l=Math.hypot(wx,wz)||1;
  steerTo(u,wp[0]+wz/l*2.8,wp[1]-wx/l*2.8,l<2?0:u.sp,dt);
}
function flyHeli(u,tp,dt){
  const m=u.m;u.ang+=dt*.45;u.rotor.rotation.y+=dt*30;
  const tx=tp.x+Math.cos(u.ang)*16,tz=tp.z+Math.sin(u.ang)*16;
  m.position.y+=clamp(22-m.position.y,-6*dt,6*dt);
  const dx=tx-m.position.x,dz=tz-m.position.z,d=Math.hypot(dx,dz);
  if(m.position.y>PAD_Y+3&&d>.5){const k=Math.min(u.sp*dt,d)/d;m.position.x+=dx*k;m.position.z+=dz*k}
  m.rotation.y=Math.atan2(tp.x-m.position.x,tp.z-m.position.z);
}
function returnUnit(u,dt){
  const m=u.m;
  if(u.k==='heli'){
    const dx=u.pad[0]-m.position.x,dz=u.pad[1]-m.position.z,d=Math.hypot(dx,dz);u.rotor.rotation.y+=dt*30;
    if(d>1){const k=Math.min(u.sp*dt,d)/d;m.position.x+=dx*k;m.position.z+=dz*k;m.position.y+=clamp(22-m.position.y,-6*dt,6*dt)}
    else{m.position.y-=5*dt;if(m.position.y<=PAD_Y){m.position.y=PAD_Y;m.rotation.y=0;u.mode='parked'}}
    return;
  }
  if(!u.rw)u.rw=[...roadPath(roadNode(m.position.x,m.position.z),roadNode(80,-48)),[80,-48],[u.bay[0],u.bay[1]]];
  const wp=u.rw[0];
  if(!wp){u.mode='parked';return}
  const last=u.rw.length===1,d=Math.hypot(wp[0]-m.position.x,wp[1]-m.position.z);
  if(d<(last?1.5:6)){u.rw.shift();if(last){m.position.set(u.bay[0],0,u.bay[1]);m.rotation.y=Math.PI;u.mode='parked'}return}
  const ex=wp[0]-m.position.x,ez=wp[1]-m.position.z,l=Math.hypot(ex,ez)||1,off=u.rw.length>2?2.8:0;
  steerTo(u,wp[0]+ez/l*off,wp[1]-ex/l*off,12,dt);
}
function minCop(){
  const tp=(active?active.mesh:player.mesh).position;let d=1e9;
  units.forEach(u=>{if(u.mode==='active'&&!u.dead)d=Math.min(d,Math.hypot(tp.x-u.m.position.x,tp.z-u.m.position.z))});
  return d;
}
function giveGun(u){if(u.armed)return;u.armed=true;block(.08,.14,.5,0x111111,0,-.6,.28,u.h.aR);u.h.aR.rotation.x=-1.2}
function spawnAt(){return[POLICE_R[0]+(Math.random()-.5)*4,POLICE_R[1]+(Math.random()-.5)*4]}
function copFoot(armed,lv,pos,stat){
  const dark=lv>3,swat=lv>=6,col=swat?0x1f2937:dark?0x2b3a55:0xc8b37a,h=humanoid(col,col,0xa8683a,0x111111);
  block(.46,.14,.46,swat?0x000000:dark?0x111111:0x8a1c1c,0,1.95,0,h.g);
  const p=pos||spawnAt();h.g.position.set(p[0],0,p[1]);scene.add(h.g);
  const u={k:'foot',m:h.g,h,armed:false,cd:1,ph:0,sp:swat?6.8:dark?6.2:5.2,lv,hp:40+lv*12,dead:0,mode:'active',stat:!!stat};
  units.push(u);if(armed)giveGun(u);return u;
}
function dispatch(k,lv){
  const u=units.find(q=>q.fleet&&q.k===k&&q.lv===lv&&q.mode==='parked');
  if(!u)return;
  u.mode='active';u.hp=k==='heli'?200:130;u.dead=0;u.wp=null;u.pt=0;u.rw=null;
}
function resetFleet(){
  units.forEach(u=>{
    if(!u.fleet||u.mode!=='wreck')return;
    const b=u.k==='heli'?u.pad:u.bay;u.m.position.set(b[0],u.k==='heli'?PAD_Y:0,b[1]);u.m.rotation.set(0,u.k==='heli'?0:Math.PI,0);
    u.m.visible=true;u.hp=u.k==='heli'?200:130;u.dead=0;u.mode='parked';
  });
}
function removeUnit(u,i){scene.remove(u.m);units.splice(i,1)}
function clearBlocks(n){
  for(let i=blocks.length-1;i>=0;i--){
    const b=blocks[i];
    if(b.lv>n){scene.remove(b.g);const bi=boxes.indexOf(b.box);if(bi>=0)boxes.splice(bi,1);blocks.splice(i,1)}
  }
}
function makeRoadblock(lv){
  const tp=(active?active.mesh:player.mesh).position,r=active?active.mesh.rotation.y:player.mesh.rotation.y;
  const rp=roadPoint(tp.x+Math.sin(r)*70,tp.z+Math.cos(r)*70);
  if(inLocked(rp[0],rp[1])||Math.hypot(rp[0]-tp.x,rp[1]-tp.z)<30)return;
  const vert=ROAD_X.includes(rp[0]),g=new THREE.Group();
  [-3.4,3.4].forEach(o=>{const j=makeJeepMesh();j.g.position.set(o,0,0);g.add(j.g)});
  block(4,1.1,.5,0xf97316,0,.55,0,g);block(4,.18,.52,0xffffff,0,.75,0,g);
  g.position.set(rp[0],0,rp[1]);g.rotation.y=vert?0:Math.PI/2;scene.add(g);
  if(vert)addBox(rp[0],rp[1],12,2.4);else addBox(rp[0],rp[1],2.4,12);
  const box=boxes[boxes.length-1];
  [-2,2].forEach(o=>copFoot(true,lv,vert?[rp[0]+o,rp[1]+3]:[rp[0]+3,rp[1]+o],true));
  blocks.push({g,box,lv});
}
function spawnLevel(lv){
  if(lv===1)copFoot(false,1);
  else if(lv===2){units.forEach(u=>{if(u.k==='foot')giveGun(u)});copFoot(true,2)}
  else if(lv===3)dispatch('jeep',3);
  else if(lv===4){copFoot(true,4);copFoot(true,4);makeRoadblock(4)}
  else if(lv===5){dispatch('heli',5);dispatch('jeep',5)}
  else{dispatch('heli',6);dispatch('jeep',6);copFoot(true,6);copFoot(true,6);makeRoadblock(6)}
}
function retire(n){
  for(let i=units.length-1;i>=0;i--){
    const u=units[i];if(u.lv<=n)continue;
    if(u.fleet){if(u.mode==='active'){u.mode='return';u.rw=null}}else removeUnit(u,i);
  }
  clearBlocks(n);if(n===0)resetFleet();
}
function setWanted(n){
  n=clamp(n,0,6);
  if(n>state.wanted){for(let lv=state.wanted+1;lv<=n;lv++)spawnLevel(lv)}
  else if(n<state.wanted)retire(n);
  state.wanted=n;if(!n)state.lost=0;stars();
}
function hurt(n){
  if(state.vest)n=Math.ceil(n/2);
  state.health-=n;hp();audio.thud();
  if(state.health<=0)loseTo('You collapsed and woke up at City Hospital. Bill: ₹200.',HOSP_R,200,false);
}
function spawnRescue(pos){
  for(let i=vehicles.length-1;i>=0;i--){if(vehicles[i].rescue){scene.remove(vehicles[i].mesh);vehicles.splice(i,1)}}
  const t=makeVehicle('taxi',pos[0]+5,pos[1]+2,Math.PI/2);t.rescue=true;t.free=true;
}
function loseTo(msg,pos,fee,seize){
  active=null;player.mesh.position.set(pos[0],0,pos[1]);player.mesh.rotation.y=Math.PI;player.mesh.rotation.z=0;swing(player.h,0,0);
  state.cash=Math.max(0,state.cash-fee);money();state.health=100;hp();setWanted(0);
  if(seize&&state.ammo>0){state.ammo=0;msg+=' The police took your bullets.'}
  hudWeapon();
  const failed=state.mission?state.mission.m:null;
  if(failed){endMission();state.retry={m:failed};spawnRescue(pos);msg+=' Mission failed. A taxi is waiting to take you back.'}
  toast(msg,5600);
}
function startRide(v){
  const m=state.retry.m;state.retry=null;paused=true;$('fade').classList.add('on');
  setTimeout(()=>{
    const p=m.stages[0].p,i=vehicles.indexOf(v);if(i>=0)vehicles.splice(i,1);scene.remove(v.mesh);
    active=null;player.mesh.position.set(p[0]+2.5,0,p[1]+2.5);pushOut(player.mesh.position,.6);swing(player.h,0,0);
    camera.position.set(p[0],6,p[1]+10);camTarget.set(p[0],1,p[1]);
    paused=false;begin(m);$('fade').classList.remove('on');speech.say('Raju Bhai','Here is your stop, Aru. Good luck!');
  },900);
}
function tracer(a,b,ay){
  const geo=new THREE.BufferGeometry().setFromPoints([V3(a.x,ay||1.4,a.z),V3(b.x,b.y>2?b.y:1.1,b.z)]),ln=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xffe08a}));
  scene.add(ln);setTimeout(()=>{scene.remove(ln);geo.dispose()},90);
}
function equipVisual(){
  const aR=player.h.aR;if(player.wm){aR.remove(player.wm);player.wm=null}
  player.wm=state.weapon==='pistol'?block(.08,.14,.4,0x111111,0,-.62,.25,aR):block(.1,.1,.9,0x8b5a2b,0,-.55,.35,aR);
}
function hudWeapon(){setText($('weap'),state.weapon==='bat'?'🏏 Cricket bat':'🔫 Pistol • '+state.ammo)}
function swapWeapon(){
  if(paused||active)return;
  state.weapon=state.weapon==='bat'&&state.owned.has('pistol')?'pistol':'bat';
  equipVisual();hudWeapon();
}
function hitUnit(u,dmg){u.hp-=dmg;if(u.hp<=0)killUnit(u)}
function killUnit(u){
  u.dead=u.k==='foot'?2:3;state.kills++;if(u.k==='foot')u.m.rotation.x=-1.4;audio.thud();
  if(u.armed)state.ammo=Math.min(99,state.ammo+6);
  state.cash+=u.k==='foot'?60:u.k==='jeep'?150:300;money();hudWeapon();
  toast('Officer down! The police are sending more help.',3600);
  const was=state.wanted;setWanted(was+1);if(was>=6)copFoot(true,6);
}
function hitPerson(q){
  if(q.down>0)return;q.down=4;audio.thud();setWanted(state.wanted+1);
  toast('You hurt a person! Someone called the police.',3600);
}
function playerAttack(){
  if(paused||active||state.atkCd>0)return;
  const pistol=state.weapon==='pistol';
  if(pistol&&state.ammo<=0){toast('Out of bullets. Buy more at the ammo shop.');return}
  const p=player.mesh.position;let best=null,bd=pistol?38:2.8;
  units.forEach(u=>{
    if(u.dead||u.mode!=='active'||(u.k==='heli'&&!pistol))return;
    const d=Math.hypot(u.m.position.x-p.x,u.m.position.z-p.z);if(d<bd){bd=d;best={o:u,m:u.m,c:true}}
  });
  people.forEach(q=>{if(q.down>0)return;const d=Math.hypot(q.m.position.x-p.x,q.m.position.z-p.z);if(d<bd){bd=d;best={o:q,m:q.m,c:false}}});
  state.atkCd=pistol?.35:.6;player.atk=.25;
  if(pistol){state.ammo--;hudWeapon();audio.shot()}else audio.burst(.2,.1,1800);
  const fx=Math.sin(player.mesh.rotation.y),fz=Math.cos(player.mesh.rotation.y);
  if(best){
    player.mesh.rotation.y=Math.atan2(best.m.position.x-p.x,best.m.position.z-p.z);
    if(pistol)tracer(p,best.m.position);else audio.thud();
    if(best.c)hitUnit(best.o,pistol?28:14);else hitPerson(best.o);
  }else if(pistol)tracer(p,V3(p.x+fx*20,0,p.z+fz*20));
}
function updatePolice(dt){
  for(let i=units.length-1;i>=0;i--){
    const u=units[i];
    if(u.dead>0){
      u.dead-=dt;if(u.k==='heli'&&u.m.position.y>1)u.m.position.y=Math.max(1,u.m.position.y-dt*9);
      if(u.dead<=0){if(u.fleet){u.m.visible=false;u.mode='wreck'}else removeUnit(u,i)}
      continue;
    }
    if(u.mode==='return')returnUnit(u,dt);
  }
  if(!state.wanted)return;
  const tp=(active?active.mesh:player.mesh).position,sp=active?Math.abs(active.speed):0;let near=1e9,heli=false;
  for(const u of units){
    if(u.mode!=='active'||u.dead>0)continue;
    const m=u.m,dx=tp.x-m.position.x,dz=tp.z-m.position.z,d=Math.hypot(dx,dz);near=Math.min(near,u.k==='heli'?d+10:d);
    if(u.k==='foot'){
      if(!u.stat&&d>1.4){const k=u.sp*dt/d;m.position.x+=dx*k;m.position.z+=dz*k;pushOut(m.position,.5);u.ph+=dt*8}
      m.rotation.y=Math.atan2(dx,dz);u.h.lL.rotation.x=Math.sin(u.ph)*.7;u.h.lR.rotation.x=-Math.sin(u.ph)*.7;
      if(!u.armed){u.h.aL.rotation.x=-Math.sin(u.ph)*.7;u.h.aR.rotation.x=Math.sin(u.ph)*.7}
      if(d<1.7&&sp<4){loseTo('The police caught you. Fine: ₹300. You are at the police station.',POLICE_R,300,true);return}
    }else if(u.k==='jeep'){
      if(d>3.4)chaseJeep(u,tp,dt);
      else if(sp<5){loseTo('The police jeep stopped you. Fine: ₹300. You are at the police station.',POLICE_R,300,true);return}
      else{u.hit-=dt;if(u.hit<=0){u.hit=1;hurt(8);audio.crash();if(active)active.speed*=.6}}
      u.t+=dt*12;const f=Math.floor(u.t)%2===0;u.r.material.color.setHex(f?0xef4444:0x450a0a);u.b.material.color.setHex(f?0x1e3a8a:0x3b82f6);
      audio.next.siren-=dt;if(audio.next.siren<=0){audio.siren();audio.next.siren=.35}
    }else{flyHeli(u,tp,dt);heli=true}
    if(u.armed){
      u.cd-=dt;const range=u.k==='heli'?45:26;
      if(u.cd<=0&&d<range){
        u.cd=u.k==='heli'?1.6:1.1;audio.shot();tracer(m.position,tp,u.k==='heli'?m.position.y:1.4);
        if(Math.random()<(sp>10?.3:.55)){hurt(u.lv>=6?9:u.lv>3?7:5);if(state.health<=0)return}
      }
    }
  }
  if(heli){audio.next.heli-=dt;if(audio.next.heli<=0){audio.burst(.14,.1,260);audio.next.heli=.2}}
  if(near>55){
    state.lost+=dt;
    if(state.lost>8){state.lost=0;setWanted(state.wanted-1);toast(state.wanted?'You are getting away. Some of the police gave up.':'You lost the police. Stay out of trouble!',3600)}
  }else state.lost=0;
}
