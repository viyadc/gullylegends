'use strict';
const ROAD_X=[-96,-48,0,48,96],ROAD_Z=[-48,0,96];
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
  ROAD_X.forEach(rx=>{const d=Math.abs(x-rx);if(d<bd){bd=d;best=[rx,clamp(z,-48,136)]}});
  ROAD_Z.forEach(rz=>{const d=Math.abs(z-rz);if(d<bd){bd=d;best=[clamp(x,-136,136),rz]}});
  return best;
}
function driveJeep(u,tp,d,dt){
  const m=u.m;u.pt=(u.pt||0)-dt;
  if(u.pt<=0){
    u.pt=.6;const rp=roadPoint(tp.x,tp.z),pth=roadPath(roadNode(m.position.x,m.position.z),roadNode(rp[0],rp[1]));
    if(pth.length>1&&Math.hypot(pth[1][0]-m.position.x,pth[1][1]-m.position.z)<Math.hypot(pth[1][0]-pth[0][0],pth[1][1]-pth[0][1]))pth.shift();
    u.wp=[...pth,rp];
  }
  let wp=null;
  while(u.wp&&u.wp.length){const q=u.wp[0];if(u.wp.length>1&&Math.hypot(q[0]-m.position.x,q[1]-m.position.z)<7)u.wp.shift();else{wp=q;break}}
  if(!wp)return;
  const wx=wp[0]-m.position.x,wz=wp[1]-m.position.z,l=Math.hypot(wx,wz)||1,tx=wp[0]+wz/l*2.8,tz=wp[1]-wx/l*2.8;
  let df=Math.atan2(tx-m.position.x,tz-m.position.z)-m.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));
  m.rotation.y+=clamp(df,-2.4*dt,2.4*dt);
  const spd=l<2?0:u.sp*(1-.55*Math.min(1,Math.abs(df)/1.2));
  m.position.x+=Math.sin(m.rotation.y)*spd*dt;m.position.z+=Math.cos(m.rotation.y)*spd*dt;pushOut(m.position,1.6);
}
function minCop(){const tp=(active?active.mesh:player.mesh).position;let d=1e9;units.forEach(u=>{if(!u.dead)d=Math.min(d,Math.hypot(tp.x-u.m.position.x,tp.z-u.m.position.z))});return d}
function dropUnits(){units.forEach(u=>scene.remove(u.m));units.length=0}
function giveGun(u){if(u.armed)return;u.armed=true;block(.08,.14,.5,0x111111,0,-.6,.28,u.h.aR);u.h.aR.rotation.x=-1.2}
function spawnAt(){return[POLICE_R[0]+(Math.random()-.5)*4,POLICE_R[1]+(Math.random()-.5)*4]}
function copFoot(armed,lv){
  const dark=lv>3,h=humanoid(dark?0x2b3a55:0xc8b37a,dark?0x2b3a55:0xc8b37a,0xa8683a,0x111111);block(.46,.14,.46,dark?0x111111:0x8a1c1c,0,1.95,0,h.g);
  const p=spawnAt();h.g.position.set(p[0],0,p[1]);scene.add(h.g);
  const u={k:'foot',m:h.g,h,armed:false,cd:1,ph:0,sp:dark?6.2:5.2,lv,hp:40+lv*10,dead:0};units.push(u);if(armed)giveGun(u);
}
function copJeep(lv){
  const g=new THREE.Group();block(1.8,.9,3.2,0x1e293b,0,.8,0,g);const r=block(.4,.2,.25,0xef4444,-.35,1.7,-.2,g,{roughness:.3}),b=block(.4,.2,.25,0x3b82f6,.35,1.7,-.2,g,{roughness:.3});
  [-.95,.95].forEach(x=>[-.9,.9].forEach(z=>{const w=cyl(.4,.4,.35,0x0f172a,x,.4,z,g,14);w.rotation.z=Math.PI/2}));
  g.position.set(POLICE_R[0],0,0);scene.add(g);units.push({k:'jeep',m:g,r,b,armed:true,cd:1.5,sp:lv>3?24:21,t:0,hit:0,lv,hp:130,dead:0});
}
function spawnLevel(lv){
  if(lv===1)copFoot(false,1);
  else if(lv===2){units.forEach(u=>{if(u.k==='foot')giveGun(u)});copFoot(true,2)}
  else if(lv===3)copJeep(3);
  else if(lv===4){copFoot(true,4);copFoot(true,4)}
  else{copJeep(5);copFoot(true,5);copFoot(true,5)}
}
function setWanted(n){
  n=clamp(n,0,5);
  if(n<=0){dropUnits();state.wanted=0;state.lost=0;stars();return}
  if(n>state.wanted){for(let lv=state.wanted+1;lv<=n;lv++)spawnLevel(lv)}
  else if(n<state.wanted){for(let i=units.length-1;i>=0;i--){if(units[i].lv>n){scene.remove(units[i].m);units.splice(i,1)}}}
  state.wanted=n;stars();
}
function hurt(n){if(state.vest)n=Math.ceil(n/2);state.health-=n;hp();audio.thud();if(state.health<=0)loseTo('You collapsed and woke up at City Hospital. Bill: ₹200.',HOSP_R,200,false)}
function loseTo(msg,pos,fee,seize){
  active=null;player.mesh.position.set(pos[0],0,pos[1]);player.mesh.rotation.y=Math.PI;player.mesh.rotation.z=0;swing(player.h,0,0);
  state.cash=Math.max(0,state.cash-fee);money();state.health=100;hp();setWanted(0);
  if(seize&&state.ammo>0){state.ammo=0;msg+=' The police took your bullets.'}
  hudWeapon();
  if(state.mission){endMission();msg+=' Mission failed.'}
  toast(msg,5200);
}
function tracer(a,b){
  const geo=new THREE.BufferGeometry().setFromPoints([V3(a.x,1.4,a.z),V3(b.x,1.1,b.z)]),ln=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xffe08a}));
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
  equipVisual();hudWeapon();;
}
function hitUnit(u,dmg){u.hp-=dmg;if(u.hp<=0)killUnit(u)}
function killUnit(u){
  u.dead=2;state.kills++;if(u.k==='foot')u.m.rotation.x=-1.4;audio.thud();
  if(u.armed)state.ammo=Math.min(99,state.ammo+6);state.cash+=u.k==='jeep'?150:60;money();hudWeapon();
  toast('Officer down! The police are sending more help.',3600);
  if(state.wanted>=5)copFoot(true,5);else setWanted(state.wanted+1);
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
  units.forEach(u=>{if(u.dead)return;const d=Math.hypot(u.m.position.x-p.x,u.m.position.z-p.z);if(d<bd){bd=d;best={o:u,m:u.m,c:true}}});
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
  for(let i=units.length-1;i>=0;i--){const u=units[i];if(u.dead){u.dead-=dt;if(u.dead<=0){scene.remove(u.m);units.splice(i,1)}}}
  if(!state.wanted)return;
  const tp=(active?active.mesh:player.mesh).position,sp=active?Math.abs(active.speed):0;let near=1e9;
  for(const u of units){
    if(u.dead)continue;
    const m=u.m,dx=tp.x-m.position.x,dz=tp.z-m.position.z,d=Math.hypot(dx,dz);near=Math.min(near,d);
    if(u.k==='foot'){
      if(d>1.4){const k=u.sp*dt/d;m.position.x+=dx*k;m.position.z+=dz*k;pushOut(m.position,.5)}
      m.rotation.y=Math.atan2(dx,dz);u.ph+=dt*8;u.h.lL.rotation.x=Math.sin(u.ph)*.7;u.h.lR.rotation.x=-Math.sin(u.ph)*.7;
      if(!u.armed){u.h.aL.rotation.x=-Math.sin(u.ph)*.7;u.h.aR.rotation.x=Math.sin(u.ph)*.7}
      if(d<1.7&&sp<4&&!u.armed){loseTo('The police caught you. Fine: ₹300. You are at the police station.',POLICE_R,300,true);return}
      if(d<1.7&&sp<4&&u.armed){loseTo('The police caught you. Fine: ₹300. You are at the police station.',POLICE_R,300,true);return}
    }else{
      if(d>3.4)driveJeep(u,tp,d,dt);
      else if(sp<5){loseTo('The police jeep stopped you. Fine: ₹300. You are at the police station.',POLICE_R,300,true);return}
      else{u.hit-=dt;if(u.hit<=0){u.hit=1;hurt(8);audio.crash();if(active)active.speed*=.6}}
      u.t+=dt*12;const f=Math.floor(u.t)%2===0;u.r.material.color.setHex(f?0xef4444:0x450a0a);u.b.material.color.setHex(f?0x1e3a8a:0x3b82f6);
      audio.next.siren-=dt;if(audio.next.siren<=0){audio.siren();audio.next.siren=.35}
    }
    if(u.armed){u.cd-=dt;if(u.cd<=0&&d<26){u.cd=1.1;audio.shot();tracer(m.position,tp);if(Math.random()<(sp>10?.3:.55)){hurt(u.lv>3?7:5);if(state.health<=0)return}}}
  }
  if(near>55){
    state.lost+=dt;
    if(state.lost>8){state.lost=0;setWanted(state.wanted-1);toast(state.wanted?'You are getting away. Some officers gave up.':'You lost the police. Stay out of trouble!',3600)}
  }else state.lost=0;
}
