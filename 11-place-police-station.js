const POLICE_R=[80,-11];
const BAYS=[[74,-38],[80,-38],[86,-38]],PADS=[[76.5,-24],[83.5,-24]],PAD_Y=10.3;
const POLICE_STATION=Object.freeze({
  building:{t:'NAYAPUR POLICE',s:'Station and Lockup',bg:'#1e3a8a',fg:'#ffffff',x:80,z:-24,w:14,st:3,c:0x9aa7c7},
  respawn:POLICE_R
});
function makeJeepMesh(){
  const g=new THREE.Group();block(1.8,.9,3.2,0x1e293b,0,.8,0,g);block(1.6,.5,1.6,0x334155,0,1.5,-.2,g);
  const r=block(.4,.2,.25,0xef4444,-.35,1.95,-.2,g,{roughness:.3}),b=block(.4,.2,.25,0x3b82f6,.35,1.95,-.2,g,{roughness:.3});
  [-.95,.95].forEach(x=>[-.9,.9].forEach(z=>{const w=cyl(.4,.4,.35,0x0f172a,x,.4,z,g,14);w.rotation.z=Math.PI/2}));
  return{g,r,b};
}
function makeHeliMesh(){
  const g=new THREE.Group();
  block(1.7,1.5,3.6,0x1d4ed8,0,1.3,0,g);block(1.5,.6,1.4,0xbfe3f0,0,1.7,1.4,g,{transparent:true,opacity:.6});
  block(.35,.35,3.4,0x1d4ed8,0,1.5,-3.2,g);block(.1,1,.5,0xf8fafc,0,1.9,-4.8,g);
  [-.8,.8].forEach(x=>{block(.1,.1,3.2,0x111827,x,.35,0,g);[-1,1].forEach(z=>block(.1,.7,.1,0x111827,x,.7,z,g))});
  const rotor=new THREE.Group();rotor.position.set(0,2.15,0);block(9,.06,.3,0x111827,0,0,0,rotor);block(.3,.06,9,0x111827,0,0,0,rotor);g.add(rotor);
  block(.3,.3,.3,0xe4452b,0,2.05,0,g);
  return{g,rotor};
}
function padTex(){
  const c=document.createElement('canvas');c.width=128;c.height=128;const g=c.getContext('2d');
  g.fillStyle='#374151';g.fillRect(0,0,128,128);g.strokeStyle='#fde047';g.lineWidth=6;g.beginPath();g.arc(64,64,54,0,7);g.stroke();
  g.fillStyle='#fde047';g.font='bold 72px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('H',64,68);
  return new THREE.CanvasTexture(c);
}
function buildPoliceYard(){
  const lot=new THREE.Mesh(new THREE.PlaneGeometry(22,10),new THREE.MeshStandardMaterial({color:0x3a3d44,roughness:.95}));
  lot.rotation.x=-Math.PI/2;lot.position.set(80,.03,-38);scene.add(lot);
  [71,77,83,89].forEach(x=>block(.2,.02,8,0xf8fafc,x,.05,-38));
  PADS.forEach(p=>{const m=new THREE.Mesh(new THREE.CircleGeometry(2.6,32),new THREE.MeshBasicMaterial({map:padTex()}));m.rotation.x=-Math.PI/2;m.position.set(p[0],PAD_Y+.27,p[1]);scene.add(m)});
  BAYS.forEach((b,i)=>{
    const j=makeJeepMesh();j.g.position.set(b[0],0,b[1]);j.g.rotation.y=Math.PI;scene.add(j.g);
    units.push({k:'jeep',m:j.g,r:j.r,b:j.b,armed:true,cd:1.5,sp:21,t:0,hit:0,lv:[3,5,6][i],hp:130,dead:0,mode:'parked',bay:b,fleet:true});
  });
  PADS.forEach((p,i)=>{
    const h=makeHeliMesh();h.g.position.set(p[0],PAD_Y,p[1]);scene.add(h.g);
    units.push({k:'heli',m:h.g,rotor:h.rotor,armed:true,cd:2,sp:i?26:22,lv:[5,6][i],hp:200,dead:0,mode:'parked',pad:p,fleet:true,ang:i*3});
  });
}
