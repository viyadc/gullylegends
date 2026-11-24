'use strict';
const CHARS=Object.freeze([
  {n:'Meera',x:-12,z:42,c:0x2f9e9e,p:0x1e3a8a,s:0xc58a5a,h:0x1a1a1a},
  {n:'Iqbal Uncle',x:8,z:13,c:0xd9d4c5,p:0x4b5563,s:0xa8683a,h:0xdddddd},
  {n:'Tara',x:30,z:-12,c:0xe4452b,p:0x7c2d12,s:0xc58a5a,h:0x1a1a1a},
  {n:'Dev',x:12,z:36,c:0x3b82f6,p:0x1f2937,s:0xa8683a,h:0x1a1a1a},
  {n:'Bunty',x:-12,z:-9,c:0x8e44ad,p:0x111827,s:0xd9a577,h:0x3b2412}
]);
function limb(p,x,y,w,h,c,hand){const pv=new THREE.Group();pv.position.set(x,y,0);const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),mat(c));m.position.y=-h/2;m.castShadow=true;pv.add(m);if(hand){const k=new THREE.Mesh(new THREE.SphereGeometry(w*.75,8,8),mat(hand));k.position.y=-h-w*.2;pv.add(k)}p.add(pv);return pv}
function humanoid(shirt,pants,skin,hair){const g=new THREE.Group();block(.6,.75,.32,shirt,0,1.05,0,g);block(.4,.4,.4,skin,0,1.62,0,g);block(.42,.16,.42,hair,0,1.84,-.02,g);block(.08,.06,.02,0x111111,-.1,1.65,.21,g);block(.08,.06,.02,0x111111,.1,1.65,.21,g);return{g,aL:limb(g,-.4,1.38,.18,.65,shirt,skin),aR:limb(g,.4,1.38,.18,.65,shirt,skin),lL:limb(g,-.15,.7,.24,.7,pants),lR:limb(g,.15,.7,.24,.7,pants)}}
function swing(h,a,k){h.aL.rotation.x=a*k;h.aR.rotation.x=-a*k;h.lL.rotation.x=-a*k;h.lR.rotation.x=a*k}
function label(text,y){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle='rgba(27,19,38,.82)';g.fillRect(0,8,256,48);g.fillStyle='#ffd166';g.font='bold 28px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,128,33);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(3,.75,1);s.position.y=y;return s}
function makePerson(color,x,z,x2,z2){
  const r=a=>a[Math.floor(Math.random()*a.length)],h=humanoid(color,r([0xf5f0e6,0x2b3a67,0x6b2d2d]),r([0xc58a5a,0xa8683a,0xd9a577]),0x1a1a1a);
  h.g.position.set(x,0,z);scene.add(h.g);
  people.push({m:h.g,h,a:V3(x,0,z),b:V3(x2,0,z2),len:Math.hypot(x2-x,z2-z),t:Math.random()*2,spd:1.2+Math.random()*.6,ph:Math.random()*6,down:0});
}
function makeChar(c){
  const h=humanoid(c.c,c.p,c.s,c.h);h.g.position.set(c.x,0,c.z);h.g.add(label(c.n,2.5));scene.add(h.g);chars.push({m:h.g,h,o:Math.random()*6,n:c.n,x:c.x,z:c.z});addBox(c.x,c.z,.8,.8);
}
function makeCow(x,z){
  const g=new THREE.Group();block(1,.9,1.9,0xf3efe6,0,1.1,0,g);block(.5,.5,.6,0xf3efe6,0,1.4,1.2,g);block(.52,.3,.3,0x1a1a1a,0,1.5,1.45,g);block(.45,.3,.1,0x6b4a2a,.3,1.2,.2,g);[[-.3,-.7],[.3,-.7],[-.3,.7],[.3,.7]].forEach(l=>block(.18,.7,.18,0xd9d2c0,l[0],.35,l[1],g));
  g.position.set(x,0,z);g.rotation.y=Math.random()*6;scene.add(g);cows.push({m:g,home:V3(x,0,z),t:Math.random()*10});
}
function makePlayer(){
  const h=humanoid(0xf7b500,0x1e3a8a,0xc58a5a,0x1a1a1a);h.g.position.set(0,0,66);h.g.rotation.y=Math.PI;scene.add(h.g);
  player={mesh:h.g,h,ph:0,vy:0,ground:true,atk:0,wm:null};equipVisual();
}
function updatePlayer(dt){
  state.atkCd-=dt;player.atk=Math.max(0,player.atk-dt);
  if(active){seatPlayer();if(player.wm)player.wm.visible=false;return}
  if(player.wm)player.wm.visible=true;
  const d=V3((keys.right?1:0)-(keys.left?1:0),0,(keys.down?1:0)-(keys.up?1:0));
  if(d.lengthSq()>0){d.normalize().applyAxisAngle(V3(0,1,0),camY);player.mesh.rotation.y=Math.atan2(d.x,d.z);player.mesh.position.x+=d.x*6.5*dt;player.mesh.position.z+=d.z*6.5*dt;player.ph+=dt*9;swing(player.h,Math.sin(player.ph),.7);audio.next.step-=dt;if(audio.next.step<=0&&player.ground){audio.step();audio.next.step=.36}}else{swing(player.h,0,0)}
  if(keys.space&&player.ground){player.vy=7.5;player.ground=false}
  player.vy-=22*dt;player.mesh.position.y+=player.vy*dt;if(player.mesh.position.y<=0){player.mesh.position.y=0;player.vy=0;player.ground=true}
  player.h.aR.rotation.x=-.7-player.atk*5;
  pushOut(player.mesh.position,.6);
  player.mesh.position.x=clamp(player.mesh.position.x,-HALF,HALF);player.mesh.position.z=clamp(player.mesh.position.z,NORTH-2,HALF);
}
function updateLife(dt,tm){
  people.forEach(p=>{
    if(p.down>0){p.down-=dt;p.m.rotation.x=-1.4;p.m.position.y=.25;return}
    p.m.rotation.x=0;p.t+=p.spd*dt/p.len;const u=((p.t%2)+2)%2,k=u<1?u:2-u,sg=u<1?1:-1;
    p.m.position.lerpVectors(p.a,p.b,k);p.m.rotation.y=Math.atan2((p.b.x-p.a.x)*sg,(p.b.z-p.a.z)*sg);
    p.ph+=dt*p.spd*4.5;swing(p.h,Math.sin(p.ph),.6);p.m.position.y=Math.abs(Math.sin(p.ph))*.04;
  });
  const pp=(active?active.mesh:player.mesh).position;
  chars.forEach(c=>{const dx=pp.x-c.m.position.x,dz=pp.z-c.m.position.z;if(Math.hypot(dx,dz)<9)c.m.rotation.y=Math.atan2(dx,dz);const w=Math.sin(tm*2+c.o)*.08;c.h.aR.rotation.x=w;c.h.aL.rotation.x=-w});
  cows.forEach(c=>{c.t+=dt;const a=c.t*.15;c.m.position.x=c.home.x+Math.sin(a)*2.2;c.m.position.z=c.home.z+Math.cos(a*.8)*1.6;c.m.rotation.y=Math.atan2(Math.cos(a)*.33,-Math.sin(a*.8)*.13)});
}
