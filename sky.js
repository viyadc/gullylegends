'use strict';
function buildSky(){
  const sky=document.createElement('canvas');sky.width=4;sky.height=256;const sg=sky.getContext('2d'),gr=sg.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#5b4a9c');gr.addColorStop(.55,'#f08a5d');gr.addColorStop(1,'#ffd9a0');sg.fillStyle=gr;sg.fillRect(0,0,4,256);
  scene.background=new THREE.CanvasTexture(sky);scene.fog=new THREE.FogExp2(0xf3b57a,.0045);
  hemi=new THREE.HemisphereLight(0xffe8c8,0x6b5a3a,.9);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffc27a,1.3);sun.position.set(50,60,-30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{near:1,far:200,left:-90,right:90,top:90,bottom:-90});scene.add(sun);scene.add(sun.target);sunL=sun;

}
