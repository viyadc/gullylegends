'use strict';
function buildGate(){
  [-8,8].forEach(x=>{block(2.4,7,2.4,0xb91c1c,x,3.5,76);addBox(x,76,2.4,2.4)});
  block(18,1.2,1.4,0xb91c1c,0,6.6,76);
  const gate=new THREE.Mesh(new THREE.PlaneGeometry(14,1.8),new THREE.MeshBasicMaterial({map:signTex('NAYAPUR','#7f1d1d','#fde047','Welcome to our city')}));gate.position.set(0,6.6,75.25);gate.rotation.y=Math.PI;scene.add(gate);
  for(let i=-7;i<=7;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.28,8,8),new THREE.MeshBasicMaterial({color:i%2?0xff8c1a:0xf7b500}));b.position.set(i*1.1,5.6-Math.abs(i)*.03,75.2);scene.add(b)}

}
function buildTemple(){
  const T=new THREE.Group(),W=0xf4d9b0;
  block(12,.5,10,0xf1e2c4,0,.25,-56,T);block(9,4,.6,W,0,2.5,-60.7,T);block(.6,4,8.6,W,-4.2,2.5,-56.4,T);block(.6,4,8.6,W,4.2,2.5,-56.4,T);block(3,4,.6,W,-2.9,2.5,-52.3,T);block(3,4,.6,W,2.9,2.5,-52.3,T);block(9,.5,9,0xf0cf9c,0,4.75,-56.4,T);
  block(6,2,6,0xf0cf9c,0,6,-56.4,T);block(4,1.8,4,0xedc78a,0,7.9,-56.4,T);block(2.4,1.6,2.4,0xe8bd78,0,9.6,-56.4,T);
  const tip=new THREE.Mesh(new THREE.ConeGeometry(1.2,2.2,10),mat(0xf7b500,{metalness:.6,roughness:.3}));tip.position.set(0,11.3,-56.4);T.add(tip);cyl(.05,.05,2.5,0x6b3a12,0,13,-56.4,T,6);block(1.4,.9,.05,0xe4452b,.7,13.6,-56.4,T);
  block(1.2,.5,1.2,0xd9d2c0,0,.75,-58.4,T);block(.7,1.2,.5,0xf7b500,0,1.6,-58.4,T,{metalness:.6,roughness:.3});block(.4,.4,.4,0xf7b500,0,2.4,-58.4,T);block(1.1,.15,.5,0xff8c1a,0,1.55,-58.1,T);
  [-1.6,1.6].forEach(x=>{cyl(.15,.15,.5,0xf7b500,x,.75,-57.5,T,8);const fl=new THREE.Mesh(new THREE.SphereGeometry(.12,8,8),new THREE.MeshBasicMaterial({color:0xffd166}));fl.position.set(x,1.1,-57.5);T.add(fl)});
  const tl=new THREE.PointLight(0xffc16a,1.2,14);tl.position.set(0,3,-56);T.add(tl);scene.add(T);
  addBox(0,-60.7,9,.6);addBox(-4.2,-56.4,.6,8.6);addBox(4.2,-56.4,.6,8.6);addBox(-2.9,-52.3,3,.6);addBox(2.9,-52.3,3,.6);addBox(0,-58.4,1.2,1.2);
  for(let i=0;i<4;i++)block(14-i*1.5,.4,2,0xd8c9a8,0,-.1-i*.1,-64-i*1.6);

}
function buildGarage(){
  const gar=new THREE.Group();block(7,3.6,.4,0x3b5bdb,0,1.8,-2,gar);block(.4,3.6,4.4,0x3b5bdb,-3.3,1.8,0,gar);block(.4,3.6,4.4,0x3b5bdb,3.3,1.8,0,gar);block(7.4,.3,4.8,0xe4452b,0,3.7,0,gar);cyl(.4,.4,1,0xe4452b,-2.2,.5,-1,gar,12);
  const gs=new THREE.Mesh(new THREE.PlaneGeometry(6,1.3),new THREE.MeshBasicMaterial({map:signTex('UDAAN MOTORS','#1e3a8a','#ffd166','Repairs and Paint')}));gs.position.set(0,4.5,2.35);gar.add(gs);
  gar.position.set(17.5,0,10);gar.rotation.y=-Math.PI/2;scene.add(gar);addBox(17.5,10,4.8,7.4);
  const ring=new THREE.Mesh(new THREE.RingGeometry(1.8,2.4,32),new THREE.MeshBasicMaterial({color:0xf7b500,side:THREE.DoubleSide,transparent:true,opacity:.85}));ring.rotation.x=-Math.PI/2;ring.position.set(10,.09,10);scene.add(ring);
  marker.icon=new THREE.Mesh(new THREE.OctahedronGeometry(.6),new THREE.MeshStandardMaterial({color:0xf7b500,emissive:0xd97706,emissiveIntensity:.8}));marker.icon.position.set(10,2.2,10);scene.add(marker.icon);

}
function buildMarket(){
  [[25,9,0xe4452b],[40,9,0xf7b500],[20,-9,0x2f9e44],[40,-9,0x8e44ad],[-6,-15,0xf59e0b]].forEach(q=>{const st=new THREE.Group();block(2.8,.9,1.6,0x7c4a1e,0,.45,0,st);block(3.2,.18,2.2,q[2],0,2.5,0,st);[-1.4,1.4].forEach(a=>cyl(.07,.07,2.5,0x444444,a,1.25,.8,st,6));[0xff8c1a,0xe4452b,0x2f9e44].forEach((c,i)=>block(.5,.35,.5,c,-.9+i*.9,1.05,0,st));st.position.set(q[0],0,q[1]);scene.add(st);addBox(q[0],q[1],3.2,2.2,'stall')});
  

}
function buildLamps(){
  const lamps=[[-9,9],[9,-9],[-9,-9],[9,9],[-30,9],[30,-9],[-30,-9],[30,9],[-9,40],[9,-40],[-52,6],[52,-6]];
  lamps.forEach((l,i)=>{cyl(.12,.15,6,0x334155,l[0],3,l[1],scene,8);const b=new THREE.Mesh(new THREE.SphereGeometry(.35,10,10),new THREE.MeshBasicMaterial({color:0xffe08a}));b.position.set(l[0],6.1,l[1]);scene.add(b);addBox(l[0],l[1],.5,.5);if(i<5){const p=new THREE.PointLight(0xffd27a,.8,18);p.position.set(l[0],5.8,l[1]);scene.add(p);lampLights.push(p)}});

}
function templeCheck(){
  const p=(active?active.mesh:player.mesh).position,inn=Math.abs(p.x)<3.6&&p.z<-52.8&&p.z>-60.2;
  if(inn!==state.inTemple){state.inTemple=inn;audio.bell()}
}
function buildFarLamps(){
  for(let x=-216;x<=216;x+=36)for(const z of [-9,9]){
    if(Math.abs(x)<60||onRoad(x,z,1.5))continue;
    cyl(.12,.15,6,0x334155,x,3,z,scene,8);
    const b=new THREE.Mesh(new THREE.SphereGeometry(.35,10,10),new THREE.MeshBasicMaterial({color:0xffe08a}));b.position.set(x,6.1,z);scene.add(b);
  }
}
