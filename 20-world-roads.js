const ROADS=Object.freeze([
  [0,0,12,480,true],[0,-48,8,480,true],[0,96,8,480,true],[0,144,8,480,true],[0,192,8,480,true],
  [0,96,12,288,false],[48,96,8,288,false],[-48,96,8,288,false],[96,96,14,288,false],[-96,96,14,288,false],[144,96,8,288,false],[-144,96,8,288,false],[192,96,8,288,false],[-192,96,8,288,false]
]);
function buildGround(){
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(600,600),new THREE.MeshStandardMaterial({color:0x9c8f5a,roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
}
function buildRoads(){
  ROADS.forEach((r,i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(r[2],r[3]),new THREE.MeshStandardMaterial({map:roadTex(r[3]),roughness:.9}));m.rotation.set(-Math.PI/2,0,r[4]?Math.PI/2:0);m.position.set(r[0],.02+i*.004,r[1]);m.receiveShadow=true;scene.add(m)});
}
