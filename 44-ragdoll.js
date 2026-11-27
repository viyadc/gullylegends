'use strict';
const RAG_JOINTS=[['aL','x',-2.6,2.6],['aL','z',-1.3,1.3],['aR','x',-2.6,2.6],['aR','z',-1.3,1.3],['eL','x',-2.2,0],['eR','x',-2.2,0],['lL','x',-1.5,1],['lR','x',-1.5,1],['lL','z',-.6,.6],['lR','z',-.6,.6],['kL','x',0,2.2],['kR','x',0,2.2],['spine','x',-.6,.9],['spine','z',-.5,.5],['head','x',-.7,.7],['head','z',-.5,.5]];
function knock(e,dir,force){
  if(e.rag)return;
  const m=e.m,l=Math.hypot(dir.x,dir.z)||1,nx=dir.x/l,nz=dir.z/l,yaw=m.rotation.y;
  const fwd=nx*Math.sin(yaw)+nz*Math.cos(yaw),side=nx*Math.cos(yaw)-nz*Math.sin(yaw),sign=fwd>=0?1:-1;
  m.rotation.order='YXZ';
  e.rag={v:V3(nx*force,3+force*.45,nz*force),wx:sign*Math.min(6,1.5+force*.3),wz:-side*force*.4,lx:sign*1.45,t:0,rest:false,up:false,hit:false,
    j:RAG_JOINTS.map(q=>({o:e.h[q[0]],ax:q[1],lo:q[2],hi:q[3],a:e.h[q[0]].rotation[q[1]],w:(Math.random()-.5)*10,tg:q[2]+(q[3]-q[2])*(.3+Math.random()*.4)}))};
}
function stepRagdoll(e,dt){
  const r=e.rag,m=e.m;if(!r)return;
  r.t+=dt;
  if(!r.up){
    r.v.y-=22*dt;m.position.x+=r.v.x*dt;m.position.y+=r.v.y*dt;m.position.z+=r.v.z*dt;
    if(!r.rest){m.rotation.x+=r.wx*dt;m.rotation.z+=r.wz*dt}
    const lie=clamp(Math.abs(Math.sin(m.rotation.x))+Math.abs(Math.sin(m.rotation.z)),0,1),floor=.05+.2*lie;
    if(m.position.y<floor){
      m.position.y=floor;
      if(r.v.y<-2.5){const k=Math.min(8,-r.v.y);r.j.forEach(q=>{q.w+=(Math.random()-.5)*k*1.6});if(!r.hit){r.hit=true;audio.thud()}}
      r.v.y=-r.v.y*.3;if(Math.abs(r.v.y)<1.2)r.v.y=0;
      const f=Math.exp(-6*dt);r.v.x*=f;r.v.z*=f;r.wx*=f;r.wz*=f;
      if(Math.hypot(r.v.x,r.v.z)<1.2&&!r.rest){r.rest=true;m.rotation.x=r.lx+Math.atan2(Math.sin(m.rotation.x-r.lx),Math.cos(m.rotation.x-r.lx));m.rotation.z=Math.atan2(Math.sin(m.rotation.z),Math.cos(m.rotation.z))}
    }
    if(r.rest){const k=Math.min(1,6*dt);m.rotation.x+=(r.lx-m.rotation.x)*k;m.rotation.z+=(0-m.rotation.z)*k;m.position.y+=(.24-m.position.y)*k}
    pushOut(m.position,.5);
  }else{
    const k=Math.min(1,7*dt);m.rotation.x*=1-k;m.rotation.z*=1-k;m.position.y*=1-k;
  }
  r.j.forEach(q=>{
    if(r.up){q.a*=1-Math.min(1,7*dt);q.w=0}
    else{q.w+=(-28*(q.a-q.tg)-3.2*q.w)*dt;q.a+=q.w*dt;if(q.a<q.lo){q.a=q.lo;q.w*=-.3}else if(q.a>q.hi){q.a=q.hi;q.w*=-.3}}
    q.o.rotation[q.ax]=q.a;
  });
  if(!r.up&&e.down!==undefined&&e.down<.7)r.up=true;
}
function endRagdoll(e){
  const m=e.m,r=e.rag;if(!r)return;
  r.j.forEach(q=>{q.o.rotation[q.ax]=0});
  m.rotation.order='XYZ';m.rotation.x=0;m.rotation.z=0;m.position.y=0;e.rag=null;
  if(e.a){e.a.set(m.position.x,0,m.position.z);e.len=Math.max(4,e.a.distanceTo(e.b));e.t=0}
}
