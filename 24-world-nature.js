'use strict';
const PUDDLES=Object.freeze([[-14,2],[22,-3],[-3,28],[4,-30],[-48,20],[48,-20],[-30,4],[0,50]]);
function buildNature(rand){
  const water=new THREE.Mesh(new THREE.PlaneGeometry(600,60),new THREE.MeshStandardMaterial({color:0x2b86b0,roughness:.2,metalness:.2}));water.rotation.x=-Math.PI/2;water.position.set(0,.06,-92);scene.add(water);buildWorld.water=water;
  for(let i=0;i<14;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(30+rand()*20,24+rand()*16,6),new THREE.MeshStandardMaterial({color:0x5c7a4a,flatShading:true}));h.position.set(-290+i*45,6,-135);scene.add(h)}
  const crops=[0x7cb342,0xc0ca33,0x558b2f,0xd4b84a,0x689f38];for(let i=0;i<10;i++){const f=new THREE.Mesh(new THREE.PlaneGeometry(26,24),new THREE.MeshStandardMaterial({color:crops[i%5],roughness:1}));f.rotation.x=-Math.PI/2;f.position.set(-117+i*26,.015,120);scene.add(f)}
  for(let i=0;i<8;i++){const f=new THREE.Mesh(new THREE.PlaneGeometry(34,36),new THREE.MeshStandardMaterial({color:crops[(i+2)%5],roughness:1}));f.rotation.x=-Math.PI/2;f.position.set(-168+i*48,.015,168);scene.add(f)}
  const canal=new THREE.Mesh(new THREE.PlaneGeometry(600,4),new THREE.MeshStandardMaterial({color:0x4aa3c7,roughness:.2}));canal.rotation.x=-Math.PI/2;canal.position.set(0,.01,104);scene.add(canal);
  puddleGroup=new THREE.Group();PUDDLES.forEach(q=>{const d=new THREE.Mesh(new THREE.CircleGeometry(2.2,20),new THREE.MeshBasicMaterial({color:0x3b82a8,transparent:true,opacity:.7}));d.rotation.x=-Math.PI/2;d.position.set(q[0],.06,q[1]);puddleGroup.add(d)});puddleGroup.visible=false;scene.add(puddleGroup);
  let n=0,tries=0;while(n<240&&tries<5200){tries++;const x=(rand()-.5)*470,z=-60+rand()*300;if(onRoad(x,z,3)||boxes.some(b=>Math.abs(x-b.x)<b.hw+3&&Math.abs(z-b.z)<b.hd+3)||(Math.abs(x)<14&&z<-48)||KEYS.some(k=>Math.hypot(x-k[0],z-k[1])<4))continue;
    const big=rand()>.5,s=.8+rand()*.6;cyl(.25*s,.35*s,2.4*s,0x5a3a1e,x,1.2*s,z,scene,6);const k=new THREE.Mesh(new THREE.IcosahedronGeometry((big?2.3:1.7)*s,1),mat(big?0x2f7d32:0x4c9a2a,{flatShading:true}));k.position.set(x,(big?3.6:3.2)*s,z);k.castShadow=true;scene.add(k);addBox(x,z,.8,.8);n++}
}
function makeRain(){
  const n=500,pos=new Float32Array(n*6);
  for(let i=0;i<n;i++){const x=(Math.random()-.5)*50,y=Math.random()*25,z=(Math.random()-.5)*50;pos.set([x,y,z,x,y+.9,z],i*6)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  rain=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xcfe6ff,transparent:true,opacity:.55}));rain.frustumCulled=false;rain.visible=false;scene.add(rain);
}
function updateRain(dt){
  const on=state.rainK>.05;
  rain.visible=on;puddleGroup.visible=on;rain.material.opacity=.55*state.rainK;audio.setRain(state.rainK);
  if(!on)return;
  rain.position.set(camTarget.x,0,camTarget.z);const a=rain.geometry.attributes.position;
  for(let i=0;i<500;i++){let y=a.array[i*6+1]-dt*30;if(y<0)y+=25;a.array[i*6+1]=y;a.array[i*6+4]=y+.9}
  a.needsUpdate=true;
}
