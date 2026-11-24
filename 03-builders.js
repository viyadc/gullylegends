'use strict';
function mat(c,o){const k=c+(o?JSON.stringify(o):'');return mats[k]||(mats[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.65},o||{})))}
function block(w,h,d,c,x,y,z,parent,o){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c,o));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m}
function cyl(rt,rb,h,c,x,y,z,parent,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||14),mat(c));m.position.set(x,y,z);m.castShadow=true;(parent||scene).add(m);return m}
function addBox(x,z,w,d){boxes.push({x,z,hw:w/2,hd:d/2})}
function pushOut(p,r){let hit=false;for(const b of boxes){const cx=clamp(p.x,b.x-b.hw,b.x+b.hw),cz=clamp(p.z,b.z-b.hd,b.z+b.hd);let dx=p.x-cx,dz=p.z-cz,d=Math.hypot(dx,dz);if(d<r){if(d<1e-4){dx=1;dz=0;d=1}p.x=cx+dx/d*r;p.z=cz+dz/d*r;hit=true}}return hit}
function onRoad(x,z,m){m=m||0;return Math.abs(x)<6+m||Math.abs(z)<6+m||Math.abs(z+48)<4+m||Math.abs(Math.abs(x)-48)<4+m||Math.abs(Math.abs(x)-96)<7+m||Math.abs(z-96)<4+m}
function rng(seed){return()=>(seed=(seed*16807)%2147483647)/2147483647}

function signTex(text,bg,fg,sub){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,512,128);g.lineWidth=8;g.strokeStyle='#f7b500';g.strokeRect(6,6,500,116);g.fillStyle=fg;g.font='bold 40px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,sub?50:64);if(sub){g.fillStyle='#fff';g.font='italic 20px sans-serif';g.fillText(sub,256,94)}return new THREE.CanvasTexture(c)}
function facadeTex(st,rand){const c=document.createElement('canvas');c.width=256;c.height=64*st;const g=c.getContext('2d');for(let r=0;r<st;r++)for(let k=0;k<4;k++){g.fillStyle=rand()>.45?'#ffd98a':'#27324a';g.fillRect(20+k*58,14+r*64,36,34)}return new THREE.CanvasTexture(c)}
function roadTex(l){const c=document.createElement('canvas');c.width=128;c.height=128;const g=c.getContext('2d');g.fillStyle='#34363b';g.fillRect(0,0,128,128);g.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<260;i++)g.fillRect(Math.random()*128,Math.random()*128,2,2);g.fillStyle='#f7b500';g.fillRect(61,12,6,50);g.fillStyle='#fff';g.fillRect(5,0,3,128);g.fillRect(120,0,3,128);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,l/16);return t}
