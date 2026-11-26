function buildSky(){
  scene.background=new THREE.Color(0x87b8e8);scene.fog=new THREE.FogExp2(0x87b8e8,.0045);
  hemi=new THREE.HemisphereLight(0xffe8c8,0x6b5a3a,.9);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xffc27a,1.3);sun.position.set(50,60,-30);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{near:1,far:200,left:-90,right:90,top:90,bottom:-90});scene.add(sun);scene.add(sun.target);sunL=sun;
  headSpot=new THREE.SpotLight(0xfff0cc,0,70,.55,.6,1);scene.add(headSpot);scene.add(headSpot.target);
}
