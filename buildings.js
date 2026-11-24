'use strict';
const SHOPS=Object.freeze([
  {t:'GULABI SWEETS',s:'Jalebi and Samosa',bg:'#9d174d',fg:'#fde047',x:-24,z:-24,w:16,st:4,c:0xe86a92},
  {t:'CHOWK SPARES',s:'Parts for every vehicle',bg:'#78350f',fg:'#fef08a',x:24,z:-24,w:16,st:3,c:0xf2a93b},
  {t:'TARA TRADERS',s:'We find anything',bg:'#14532d',fg:'#ffffff',x:-64,z:-24,w:14,st:3,c:0x2fb5a6},
  {t:'NAYA TIFFIN',s:'Home food, hot and fresh',bg:'#1e3a8a',fg:'#ffffff',x:64,z:-24,w:14,st:4,c:0x4c8df6},
  {t:'BUS DEPOT',s:'Buses to every lane',bg:'#7c2d12',fg:'#fde047',x:80,z:60,w:14,st:2,c:0xd4a373}
]);
const HOMES=Object.freeze([[24,24,16,3,0x3fbf8f],[-64,24,14,3,0xf0824a],[64,24,14,4,0x7c8ba1],[-24,60,16,3,0xe0a458],[24,60,16,4,0xd9648a],[-64,60,14,3,0x58a6c9],[64,60,14,3,0xb8c35a],[114,-24,18,6,0xb8c0cc],[114,24,18,5,0xc9b8a0],[114,60,18,6,0xa8c0c8],[-114,-24,18,3,0xf06292],[-114,24,18,3,0x4db6ac],[-114,60,18,4,0xffb74d]]);
const ALL_BUILDINGS=Object.freeze([...SHOPS,FLAT.building,POLICE_STATION.building,HOSPITAL.building,AMMO_SHOP.building]);
function building(x,z,w,st,color,shop,rand){
  const g=new THREE.Group(),d=16,H=st*3.5,dir=z<0?1:-1;
  block(w,H,d,color,0,H/2,0,g).receiveShadow=true;
  const f=new THREE.Mesh(new THREE.PlaneGeometry(w*.88,H*.9),new THREE.MeshBasicMaterial({map:facadeTex(st,rand),transparent:true}));
  f.position.set(0,H/2+.2,dir*(d/2+.05));if(dir<0)f.rotation.y=Math.PI;g.add(f);
  for(let i=1;i<st;i++){block(w*.7,.2,1.2,0x475569,0,i*3.5,dir*(d/2+.6),g);block(w*.7,.8,.1,0x94a3b8,0,i*3.5+.5,dir*(d/2+1.15),g)}
  block(w+.2,.8,.3,color,0,H+.4,dir*d/2,g);
  cyl(.8,.8,1.6,0x18181b,-w/4,H+.8,-d/4,g,16);
  const dish=new THREE.Mesh(new THREE.SphereGeometry(.5,12,12,0,Math.PI*2,0,Math.PI/3),new THREE.MeshStandardMaterial({color:0xf8fafc,side:THREE.DoubleSide}));dish.position.set(w/4,H+.6,d/4);dish.rotation.x=-Math.PI/4;g.add(dish);
  if(shop){const s=new THREE.Mesh(new THREE.PlaneGeometry(w*.8,2.2),new THREE.MeshBasicMaterial({map:signTex(shop.t,shop.bg,shop.fg,shop.s)}));s.position.set(0,1.9,dir*(d/2+.12));if(dir<0)s.rotation.y=Math.PI;g.add(s)}
  g.position.set(x,0,z);scene.add(g);addBox(x,z,w,d);
}

function buildBuildings(rand){
  ALL_BUILDINGS.forEach(s=>building(s.x,s.z,s.w,s.st,s.c,s,rand));HOMES.forEach(h=>building(h[0],h[1],h[2],h[3],h[4],null,rand));
  block(1.5,3.2,200,0xc9772c,-137,1.6,38);block(1.5,3.2,200,0xc9772c,137,1.6,38);block(274,3.2,1.5,0xc9772c,0,1.6,137);

}
