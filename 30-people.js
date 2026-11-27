'use strict';
const CHARS=Object.freeze([
  {n:'Meera',hi:'Hi Aru! Mind the cows today.',x:-12,z:42,c:0x2f9e9e,p:0x1e3a8a,s:0xc58a5a,h:0x1a1a1a},
  {n:'Iqbal Uncle',hi:'The garage is busy today, Aru.',x:10,z:14,c:0xd9d4c5,p:0x4b5563,s:0xa8683a,h:0xdddddd},
  {n:'Tara',hi:'Need anything? I can find it for you.',x:30,z:-12,c:0xe4452b,p:0x7c2d12,s:0xc58a5a,h:0x1a1a1a},
  {n:'Dev',hi:'Route 108 never sleeps!',x:12,z:36,c:0x3b82f6,p:0x1f2937,s:0xa8683a,h:0x1a1a1a},
  {n:'Bunty',hi:'Race me any time, mechanic.',x:-12,z:-9,c:0x8e44ad,p:0x111827,s:0xd9a577,h:0x3b2412},
  {n:'Raju Bhai',hi:'Need a taxi job? Just ask me.',x:-34,z:-8,c:0xf59e0b,p:0x1f2937,s:0xa8683a,h:0x1a1a1a,unlock:2},
  {n:'Pappan',hi:'That old auto still runs like a dream.',x:15,z:13,c:0x1d4ed8,p:0x374151,s:0xa8683a,h:0x555555,unlock:4},
  {n:'Kaveri Didi',hi:'Buses are my second home.',x:77,z:49,c:0x16a34a,p:0x1f2937,s:0xc58a5a,h:0x1a1a1a,unlock:10},
  {n:'Gopal',hi:'The fields are green this year.',x:24,z:150,c:0xe5e7eb,p:0x8b5a2b,s:0xa8683a,h:0xdddddd,unlock:9}
]);
function ball(parent,r,c,x,y,z){const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,10),mat(c));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
function pivot(parent,x,y,z){const p=new THREE.Group();p.position.set(x,y,z);parent.add(p);return p}
function humanoid(shirt,pants,skin,hair){
  const g=new THREE.Group(),hips=pivot(g,0,.7,0),spine=pivot(hips,0,0,0),cloth=[];
  cloth.push(block(.6,.75,.32,shirt,0,.35,0,spine));
  const hem=pivot(hips,0,.04,0);cloth.push(block(.64,.3,.36,shirt,0,-.15,0,hem));
  const head=pivot(spine,0,.73,0);block(.4,.4,.4,skin,0,.2,0,head);block(.42,.16,.42,hair,0,.42,-.02,head);
  block(.08,.06,.02,0x111111,-.1,.24,.21,head);block(.08,.06,.02,0x111111,.1,.24,.21,head);
  const arm=s=>{const a=pivot(spine,s*.4,.68,0);cloth.push(block(.18,.34,.18,shirt,0,-.17,0,a));const e=pivot(a,0,-.34,0);cloth.push(block(.17,.3,.17,shirt,0,-.15,0,e));ball(e,.12,skin,0,-.33,0);return[a,e]};
  const leg=s=>{const l=pivot(hips,s*.15,0,0);block(.25,.35,.25,pants,0,-.175,0,l);const k=pivot(l,0,-.35,0);block(.22,.35,.22,pants,0,-.175,0,k);block(.24,.1,.34,0x2b2118,0,-.3,.05,k);return[l,k]};
  const[aL,eL]=arm(-1),[aR,eR]=arm(1),[lL,kL]=leg(-1),[lR,kR]=leg(1);
  return{g,hips,spine,head,hem,aL,aR,eL,eR,lL,lR,kL,kR,cloth};
}
function gunMesh(parent){const w=new THREE.Group();block(.09,.32,.11,0x111111,0,-.5,.03,w);block(.08,.16,.08,0x111111,0,-.38,-.06,w);parent.add(w);return w}
function legsWalk(h,t,k){h.lL.rotation.x=Math.sin(t)*k;h.lR.rotation.x=-Math.sin(t)*k;h.kL.rotation.x=Math.max(0,-Math.cos(t))*k*1.3;h.kR.rotation.x=Math.max(0,Math.cos(t))*k*1.3}
function armsWalk(h,t,k){h.aL.rotation.x=-Math.sin(t)*k;h.aR.rotation.x=Math.sin(t)*k;h.eL.rotation.x=-.15-k*.35;h.eR.rotation.x=-.15-k*.35}
function swing(h,t,k){legsWalk(h,t,k);armsWalk(h,t,k);h.hips.rotation.y=Math.sin(t)*.1*k;h.spine.rotation.y=-Math.sin(t)*.14*k;h.hem.rotation.x=-(h.lL.rotation.x-h.lR.rotation.x)*.18}
function label(text,y){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle='rgba(27,19,38,.82)';g.fillRect(0,8,256,48);g.fillStyle='#ffd166';g.font='bold 28px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,128,33);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(3,.75,1);s.position.y=y;return s}
function makePerson(color,x,z,x2,z2){
  const r=a=>a[Math.floor(Math.random()*a.length)],h=humanoid(color,r([0xf5f0e6,0x2b3a67,0x6b2d2d]),r([0xc58a5a,0xa8683a,0xd9a577]),0x1a1a1a);
  h.g.position.set(x,0,z);scene.add(h.g);
  people.push({m:h.g,h,a:V3(x,0,z),b:V3(x2,0,z2),len:Math.hypot(x2-x,z2-z),t:Math.random()*2,spd:1.2+Math.random()*.6,ph:Math.random()*6,down:0});
}
function makeChar(c){
  const h=humanoid(c.c,c.p,c.s,c.h);h.g.position.set(c.x,0,c.z);h.g.add(label(c.n,2.5));scene.add(h.g);chars.push({m:h.g,h,o:Math.random()*6,n:c.n,hi:c.hi,x:c.x,z:c.z,u:c.unlock||0});h.g.visible=false;
}
function makeCow(x,z){
  const g=new THREE.Group();block(1,.9,1.9,0xf3efe6,0,1.1,0,g);block(.5,.5,.6,0xf3efe6,0,1.4,1.2,g);block(.52,.3,.3,0x1a1a1a,0,1.5,1.45,g);block(.45,.3,.1,0x6b4a2a,.3,1.2,.2,g);[[-.3,-.7],[.3,-.7],[-.3,.7],[.3,.7]].forEach(l=>block(.18,.7,.18,0xd9d2c0,l[0],.35,l[1],g));
  g.position.set(x,0,z);g.rotation.y=Math.random()*6;scene.add(g);cows.push({m:g,home:V3(x,0,z),t:Math.random()*10});
}
function makePlayer(){
  const h=humanoid(0xf7b500,0x1e3a8a,0xc58a5a,0x1a1a1a);h.g.position.set(0,0,66);h.g.rotation.y=Math.PI;scene.add(h.g);
  player={mesh:h.g,h,ph:0,vy:0,ground:true,atk:0,wm:null,vel:0,turn:0,phase:0,pose:{},combo:0,move:null,fightIdle:9,land:0,dir:V3(0,0,-1)};equipVisual();
}
function animateAru(dt){
  const p=player,h=p.h,P=p.pose,m=p.move,sp=Math.abs(p.vel),air=p.ground?0:1,tm=clock.elapsedTime;
  const walk=clamp(sp/6,0,1),run=clamp((sp-6)/3.5,0,1),fight=clamp(1-p.fightIdle/3.5,0,1)*(1-air),aim=state.weapon==='pistol'?clamp(1-p.fightIdle/3,0,1):0;
  p.phase+=dt*(walk*7.5+run*4.5);
  const t=p.phase,s=Math.sin(t),c=Math.cos(t),amp=(.38+.34*run)*walk,mx=(k,a,b)=>a+(b-a)*k,T={};
  T.lL=s*amp;T.lR=-s*amp;T.kL=Math.max(0,-c)*(.45+.9*run)*walk;T.kR=Math.max(0,c)*(.45+.9*run)*walk;
  T.aL=-s*amp*1.1;T.aR=s*amp*1.1;T.eL=-(.18+.95*run)*(.4+.6*walk);T.eR=T.eL;
  T.lean=.03*walk+.2*run+Math.sin(tm*1.7)*.012*(1-walk);T.twist=-s*.2*walk;T.hip=s*.14*walk;T.bob=Math.abs(c)*(.02+.05*run)*walk;
  T.roll=-clamp(p.turn,-7,7)*.03*(.3+walk);T.head=-T.lean*.5;T.aLz=.06;T.aRz=-.06;
  T.aL=mx(fight,T.aL,-.95);T.eL=mx(fight,T.eL,-1.55);T.aR=mx(fight,T.aR,-.85);T.eR=mx(fight,T.eR,-1.65);
  T.lL=mx(fight,T.lL,.3);T.lR=mx(fight,T.lR,-.28);T.kL=mx(fight,T.kL,.25);T.kR=mx(fight,T.kR,.3);
  T.lean=mx(fight,T.lean,.12);T.twist=mx(fight,T.twist,.3);T.bob=mx(fight,T.bob,Math.abs(Math.sin(tm*6))*.025);
  T.aR=mx(aim,T.aR,-1.45-p.atk*1.2);T.eR=mx(aim,T.eR,-.05);T.aL=mx(aim,T.aL,-1.2);T.eL=mx(aim,T.eL,-.8);T.twist=mx(aim,T.twist,.12);
  T.lL=mx(air,T.lL,-.9);T.lR=mx(air,T.lR,-.35);T.kL=mx(air,T.kL,1.2);T.kR=mx(air,T.kR,.8);
  T.aL=mx(air,T.aL,-2.1);T.aR=mx(air,T.aR,-1.9);T.eL=mx(air,T.eL,-.25);T.eR=mx(air,T.eR,-.25);T.lean=mx(air,T.lean,.1);
  if(p.land>0){p.land-=dt;const l=p.land/.25;T.kL+=.7*l;T.kR+=.7*l;T.lL-=.35*l;T.lR-=.35*l;T.lean+=.18*l;T.bob-=.12*l}
  const k=1-Math.exp(-16*dt);for(const key in T)P[key]=P[key]===undefined?T[key]:P[key]+(T[key]-P[key])*k;
  h.lL.rotation.x=P.lL;h.lR.rotation.x=P.lR;h.kL.rotation.x=P.kL;h.kR.rotation.x=P.kR;
  h.aL.rotation.x=P.aL;h.aR.rotation.x=P.aR;h.aL.rotation.z=P.aLz;h.aR.rotation.z=P.aRz;h.eL.rotation.x=P.eL;h.eR.rotation.x=P.eR;
  h.spine.rotation.x=P.lean;h.spine.rotation.y=P.twist;h.spine.rotation.z=P.roll;h.hips.rotation.y=P.hip;h.hips.position.y=.7+P.bob;
  h.head.rotation.x=P.head;h.hem.rotation.x=-(h.lL.rotation.x-h.lR.rotation.x)*.18;
  if(m)applyMove(dt,m,P);
}
function applyMove(dt,m,P){
  m.t+=dt;const pr=clamp(m.t/m.dur,0,1),s=Math.sin(Math.PI*pr),h=player.h,mx=(k,a,b)=>a+(b-a)*k,pos=player.mesh.position;
  if(m.k==='jab'){h.aR.rotation.x=mx(s,P.aR,-1.55);h.eR.rotation.x=mx(s,P.eR,-.08);h.spine.rotation.y=P.twist-.3*s}
  else if(m.k==='cross'){h.aL.rotation.x=mx(s,P.aL,-1.6);h.eL.rotation.x=mx(s,P.eL,-.06);h.spine.rotation.y=P.twist+.55*s;h.hips.rotation.y=-.3*s}
  else if(m.k==='hook'){h.aR.rotation.x=mx(s,P.aR,-1.45);h.eR.rotation.x=mx(s,P.eR,-1.6);h.spine.rotation.y=P.twist+(-.6+1.2*pr)*s}
  else{h.lR.rotation.x=mx(s,P.lR,-1.7);h.kR.rotation.x=mx(s,P.kR,.15);h.lL.rotation.x=mx(s,P.lL,.2);h.kL.rotation.x=mx(s,P.kL,.35);h.spine.rotation.x=P.lean-.3*s;h.aL.rotation.z=P.aLz-.9*s;h.aR.rotation.z=P.aRz+.9*s}
  const b=m.target;
  if(b&&pr<.5){const dx=b.m.position.x-pos.x,dz=b.m.position.z-pos.z,d=Math.hypot(dx,dz);if(d>1.1){pos.x+=dx/d*3.5*dt;pos.z+=dz/d*3.5*dt}}
  if(pr>.45&&!m.hit){
    m.hit=true;
    if(b&&!(b.c&&(b.o.dead||b.o.mode!=='active'))&&Math.hypot(b.m.position.x-pos.x,b.m.position.z-pos.z)<3.4){audio.thud();if(b.c)hitUnit(b.o,m.dmg);else hitPerson(b.o)}
  }
  if(pr>=1)player.move=null;
}
function updatePlayer(dt){
  state.atkCd-=dt;player.atk=Math.max(0,player.atk-dt);player.fightIdle+=dt;
  if(active){seatPlayer();if(player.wm)player.wm.visible=false;player.vel=0;return}
  if(player.wm)player.wm.visible=true;
  const d=V3((keys.right?1:0)-(keys.left?1:0),0,(keys.down?1:0)-(keys.up?1:0)),want=d.lengthSq()>0;
  if(want){d.normalize().applyAxisAngle(V3(0,1,0),camY);player.dir.lerp(d,Math.min(1,10*dt));if(player.dir.lengthSq()<.01)player.dir.copy(d);player.dir.normalize()}
  const target=want?(keys.run?9.5:6):0;player.vel+=(target-player.vel)*Math.min(1,(want?8:12)*dt);
  const oldYaw=player.mesh.rotation.y;
  if(player.vel>.4&&!player.move){let df=Math.atan2(player.dir.x,player.dir.z)-oldYaw;df=Math.atan2(Math.sin(df),Math.cos(df));player.mesh.rotation.y=oldYaw+df*Math.min(1,12*dt)}
  let dy=player.mesh.rotation.y-oldYaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));player.turn+=(dy/Math.max(dt,.001)-player.turn)*Math.min(1,8*dt);
  player.mesh.position.x+=player.dir.x*player.vel*dt;player.mesh.position.z+=player.dir.z*player.vel*dt;
  if(player.vel>1&&player.ground){audio.next.step-=dt*player.vel/6;if(audio.next.step<=0){audio.step();audio.next.step=.36}}
  if(keys.space&&player.ground){player.vy=7.5;player.ground=false}
  const was=player.ground;
  player.vy-=22*dt;player.mesh.position.y+=player.vy*dt;if(player.mesh.position.y<=0){player.mesh.position.y=0;player.vy=0;player.ground=true}
  if(!was&&player.ground)player.land=.25;
  animateAru(dt);
  pushOut(player.mesh.position,.6);
  bounds(player.mesh.position,2);
}
function updateLife(dt,tm){
  people.forEach(p=>{
    if(p.down>0){p.down-=dt;p.m.rotation.x=-1.4;p.m.position.y=.25;return}
    p.m.rotation.x=0;p.t+=p.spd*dt/p.len;const u=((p.t%2)+2)%2,k=u<1?u:2-u,sg=u<1?1:-1;
    p.m.position.lerpVectors(p.a,p.b,k);p.m.rotation.y=Math.atan2((p.b.x-p.a.x)*sg,(p.b.z-p.a.z)*sg);
    p.ph+=dt*p.spd*4.5;swing(p.h,p.ph,.6);p.m.position.y=Math.abs(Math.sin(p.ph))*.04;
  });
  const pp=(active?active.mesh:player.mesh).position;
  chars.forEach(c=>{const vis=(c.u>0&&state.done.size>=c.u)||state.met.has(c.n);if(c.m.visible!==vis)c.m.visible=vis;const dx=pp.x-c.m.position.x,dz=pp.z-c.m.position.z;if(Math.hypot(dx,dz)<9)c.m.rotation.y=Math.atan2(dx,dz);const w=Math.sin(tm*2+c.o)*.08;c.h.aR.rotation.x=w;c.h.aL.rotation.x=-w});
  cows.forEach(c=>{
    c.t+=dt;const a=c.t*.15;let tx=c.home.x+Math.sin(a)*2.2,tz=c.home.z+Math.cos(a*.8)*1.6;
    const dx=tx-pp.x,dz=tz-pp.z,d=Math.hypot(dx,dz);
    if(d<10&&d>.1){tx+=dx/d*(10-d);tz+=dz/d*(10-d)}
    const k=Math.min(1,1.5*dt),ex=tx-c.m.position.x,ez=tz-c.m.position.z;
    c.m.position.x+=ex*k;c.m.position.z+=ez*k;
    if(Math.hypot(ex,ez)>.08)c.m.rotation.y=Math.atan2(ex,ez);
  });
}
