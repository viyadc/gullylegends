'use strict';
const SMOKE_MAX=90,smoke=[],exPos=V3(0,0,0);
function buildSmoke(){
  const c=document.createElement('canvas');c.width=64;c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,2,32,32,30);
  gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);
  const tex=new THREE.CanvasTexture(c);
  for(let i=0;i<SMOKE_MAX;i++){
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,opacity:0,color:0xd0d0d0}));
    s.visible=false;scene.add(s);smoke.push({s,life:0,max:1,vx:0,vy:0,vz:0,size:.3,grow:1,free:true});
  }
}
function puff(x,y,z,vx,vz,strong){
  const p=smoke.find(q=>q.free);if(!p)return;
  p.free=false;p.life=0;p.max=.9+Math.random()*.6;p.vx=vx+(Math.random()-.5)*.5;p.vz=vz+(Math.random()-.5)*.5;p.vy=.5+Math.random()*.4;
  p.size=strong?.34:.22;p.grow=strong?1.6:1;p.s.position.set(x,y,z);p.s.visible=true;p.s.scale.set(p.size,p.size,1);
}
function updateSmoke(dt){
  smoke.forEach(p=>{
    if(p.free)return;
    p.life+=dt;if(p.life>=p.max){p.free=true;p.s.visible=false;return}
    const k=p.life/p.max,sz=p.size+p.grow*k;
    p.s.position.x+=p.vx*dt;p.s.position.y+=p.vy*dt;p.s.position.z+=p.vz*dt;p.vy*=1-.6*dt;
    p.s.scale.set(sz,sz,1);p.s.material.opacity=.42*(1-k)*(1-k*.3);
  });
}
function emitExhaust(v,dt){
  const act=v===active,moving=Math.abs(v.speed)>.8;
  if(!act&&!moving)return;
  v.exT=(v.exT||0)-dt;if(v.exT>0)return;
  const thr=act&&keys.up?1:0;v.exT=moving?.07-thr*.03:.28;
  const e=HANDLING[v.kind].ex;v.mesh.updateMatrixWorld();exPos.set(e[0],e[1],e[2]);v.mesh.localToWorld(exPos);
  const r=v.mesh.rotation.y,back=-(1.2+Math.min(3,Math.abs(v.speed)*.15))*.4;
  puff(exPos.x,exPos.y,exPos.z,Math.sin(r)*back,Math.cos(r)*back,thr>0||Math.abs(v.speed)>12);
}
