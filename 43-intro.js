const intro={bus:null,phase:0,t:0,bs:0,wps:[],wi:0,said:0,subT:0,eng:0};
function setSub(text,ms){const e=$('sub');e.textContent=text;e.classList.remove('hidden');clearTimeout(intro.subT);intro.subT=setTimeout(()=>e.classList.add('hidden'),ms)}
function spinWheels(v,spd,dt){v.wheels.forEach(w=>{w.sp.rotation.x+=spd*dt/w.r})}
function titleCam(tm){camera.position.set(Math.sin(tm*.15)*16,5+Math.sin(tm*.1),104);camera.lookAt(0,3.4,70)}
function startIntro(){
  state.intro=true;
  if(location.hash==='#go'){endIntro();return}
  intro.phase=0;intro.t=0;intro.bs=0;intro.said=0;intro.eng=.3;
  const b=makeVehicle('bus',-3,170,Math.PI);b.free=true;intro.bus=b;
  player.mesh.visible=false;$('bars').classList.add('on');$('skip').classList.remove('hidden');
  camera.position.set(14,3.8,118);camTarget.set(-3,2,150);
}
function endIntro(){
  if(!state.intro)return;state.intro=false;intro.eng=0;
  if(intro.bus){scene.remove(intro.bus.mesh);const i=vehicles.indexOf(intro.bus);if(i>=0)vehicles.splice(i,1);intro.bus=null}
  const p=player;p.mesh.visible=true;p.mesh.position.set(0,0,66);p.mesh.rotation.y=Math.PI;p.dir.set(0,0,-1);p.vel=0;p.turn=0;p.pose={};
  camY=0;camX=.35;
  $('bars').classList.remove('on');$('sub').classList.add('hidden');$('skip').classList.add('hidden');
  $('hud').classList.remove('hidden');mode='play';paused=false;money();stars();hp();hudWeapon();startMission(1);
}
function updateIntro(dt){
  const b=intro.bus,m=b.mesh,p=player.mesh.position;intro.t+=dt;
  if(intro.phase===0){
    const dist=m.position.z-88,spd=Math.max(.5,Math.min(14,Math.sqrt(Math.max(0,6.8*dist))));
    b.speed=spd;m.position.z-=spd*dt;spinWheels(b,spd,dt);intro.eng=.15+spd/20;
    setE(b.lamps.tail,dist<30?3:0);setE(b.lamps.sigL,dist<50&&Math.floor(intro.t*3.2)%2===0?3.2:0);
    if(dist<35&&!intro.said){intro.said=1;speech.say('Kaveri Didi','Nayapur Gate! Last stop. Everyone off, please.');setSub('Conductor: Nayapur Gate! Last stop. Everyone off, please.',4200)}
    if(dist<=.12){m.position.z=88;b.speed=0;intro.phase=1;intro.t=0;intro.eng=.1;setE(b.lamps.sigL,0);audio.burst(.25,.6,2200)}
    camTarget.lerp(V3(m.position.x,2,m.position.z),.12);camera.lookAt(camTarget);
    return;
  }
  if(intro.phase===1){
    camTarget.lerp(V3(m.position.x,2,m.position.z),.12);camera.lookAt(camTarget);
    if(intro.t>=1.2){
      p.set(-6.2,0,85.4);player.mesh.visible=true;player.mesh.rotation.y=Math.PI;player.dir.set(0,0,-1);player.vel=0;player.pose={};
      intro.wps=[[-5.9,80],[-5.9,73],[-2,67.5],[0,66]];intro.wi=0;intro.phase=2;intro.t=0;
      speech.say('Aru','Nayapur. I am home at last.');setSub('Aru: Nayapur. I am home at last.',4200);audio.chime();
    }
    return;
  }
  if(intro.t>2.2&&intro.bus){
    intro.bs=Math.min(13,intro.bs+3.4*dt);b.speed=intro.bs;m.position.z-=intro.bs*dt;spinWheels(b,intro.bs,dt);intro.eng=.2+intro.bs/20;setE(b.lamps.tail,0);
    if(m.position.z<12){scene.remove(m);const i=vehicles.indexOf(b);if(i>=0)vehicles.splice(i,1);intro.bus=null;intro.eng=0}
  }
  const wp=intro.wps[intro.wi],dx=wp[0]-p.x,dz=wp[1]-p.z,l=Math.hypot(dx,dz);
  if(l<.7){intro.wi++;if(intro.wi>=intro.wps.length){endIntro();return}}
  else{player.dir.lerp(V3(dx/l,0,dz/l),Math.min(1,6*dt)).normalize();player.vel+=(3.6-player.vel)*Math.min(1,6*dt)}
  const oy=player.mesh.rotation.y;let df=Math.atan2(player.dir.x,player.dir.z)-oy;df=Math.atan2(Math.sin(df),Math.cos(df));
  player.mesh.rotation.y=oy+df*Math.min(1,10*dt);player.turn=df*3;
  p.x+=player.dir.x*player.vel*dt;p.z+=player.dir.z*player.vel*dt;player.ground=true;
  audio.next.step-=dt*player.vel/6;if(audio.next.step<=0){audio.step();audio.next.step=.36}
  animateAru(dt);
  camera.position.lerp(V3(p.x+5,2.6,p.z+9),.03);camTarget.lerp(V3(p.x,1.4,p.z-3),.08);camera.lookAt(camTarget);
}
