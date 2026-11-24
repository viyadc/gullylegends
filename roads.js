'use strict';
const ROADS=Object.freeze([[0,0,12,280,true],[0,-48,8,280,true],[0,96,8,280,true],[0,45,12,186,false],[48,45,8,186,false],[-48,45,8,186,false],[96,45,14,186,false],[-96,45,14,186,false]]);
function buildGround(){
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(340,340),new THREE.MeshStandardMaterial({color:0x9c8f5a,roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

}
function buildRoads(){
  ROADS.forEach((r,i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(r[2],r[3]),new THREE.MeshStandardMaterial({map:roadTex(r[3]),roughness:.9}));m.rotation.set(-Math.PI/2,0,r[4]?Math.PI/2:0);m.position.set(r[0],.02+i*.005,r[1]);m.receiveShadow=true;scene.add(m)});

}
