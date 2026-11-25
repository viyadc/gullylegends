'use strict';
const KEYS=[...CHARS.map(c=>[c.x,c.z]),...MISSIONS.flatMap(m=>m.stages.map(q=>q.p)),...SPOTS.map(q=>[q.x,q.z]),...ODDS.map(o=>o.p),[10,10],[17.5,10],HOSP_R,POLICE_R,...STREET_ART.map(a=>[a.x+(a.s==='w'?-a.w/2-3:a.w/2+3),a.z])];
const VIEWS=['Close view','Far view','First person'];
function updateCamera(){
  const tp=active?active.mesh.position:player.mesh.position,fp=state.cam===2;
  if(!drag&&active&&Math.abs(active.speed)>1){let d=(active.mesh.rotation.y+Math.PI)-camY;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;camY+=d*.05}
  if(player.mesh.visible===fp)player.mesh.visible=!fp;
  const fov=fp?75:60;if(Math.abs(camera.fov-fov)>.1){camera.fov=fov;camera.updateProjectionMatrix()}
  if(fp){
    const hx=player.mesh.position.x,hy=player.mesh.position.y+1.7,hz=player.mesh.position.z,yaw=camY+Math.PI,pitch=(.35-camX)*1.1;
    camera.position.set(hx,hy,hz);camTarget.set(hx+Math.sin(yaw)*Math.cos(pitch)*10,hy+Math.sin(pitch)*10,hz+Math.cos(yaw)*Math.cos(pitch)*10);camera.lookAt(camTarget);
  }else{
    const dist=(active?11:7)*(state.cam===1?1.9:1),h=dist*Math.sin(camX),hd=dist*Math.cos(camX);
    camera.position.lerp(V3(tp.x+hd*Math.sin(camY),tp.y+h+1.2,tp.z+hd*Math.cos(camY)),.12);
    camTarget.lerp(V3(tp.x,tp.y+1.4,tp.z),.15);camera.lookAt(camTarget);
  }
  sunL.position.set(tp.x+sunOff.x,sunOff.y,tp.z+sunOff.z);sunL.target.position.set(tp.x,0,tp.z);
}

function loop(){
  requestAnimationFrame(loop);
  const dt=Math.min(clock.getDelta(),.1),tm=clock.elapsedTime;
  if(gameOn&&!paused&&!document.hidden){
    state.crashCd-=dt;updatePlayer(dt);if(active)updateVehicle(active,dt);updatePolice(dt);updateMission(dt);updateLife(dt,tm);updateCamera();templeCheck();updateTime(dt);updateRain(dt);audio.setEngine(active?Math.abs(active.speed)/active.max:0,!!active);audio.tick(dt,!!state.mission&&state.mission.m.id===4);
    marker.icon.rotation.y+=dt*2;if(state.beam)state.beam.r.rotation.z+=dt*3;buildWorld.water.position.y=.06+Math.sin(tm)*.03;updateHud();
  }else{audio.setEngine(0,false);audio.setRain(0)}
  renderer.render(scene,camera);
}

function bindInput(){
  const map={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
  addEventListener('keydown',e=>{
    if(!gameOn)return;audio.init();const c=e.code;
    if(state.rebind){e.preventDefault();const k=state.rebind;state.rebind=null;if(c!=='Escape'&&!Object.values(binds).includes(c)&&!map[c])binds[k]=c;renderMenu();return}
    if(c==='Escape'){if(mode==='play')openScreen('menuScreen');else closeScreen(mode);return}
    if(mode==='play'&&cheatKey(c)){e.preventDefault();return}
    if(mode==='play'&&(map[c]||c===binds.jump)){keys[map[c]||'space']=true;if(c==='Space'||c.startsWith('Arrow'))e.preventDefault();return}
    if(c===binds.act&&mode==='play')interact();
    else if(c===binds.horn&&mode==='play'&&active)audio.horn();
    else if(c===binds.fire&&mode==='play')playerAttack();
    else if(c===binds.swap&&mode==='play')swapWeapon();
    else if(c===binds.jobs)toggleScreen('board');
    else if(c===binds.cam&&mode==='play')state.cam=(state.cam+1)%3;
    else if(c===binds.map)toggleScreen('mapScreen');
  });
  addEventListener('keyup',e=>{if(map[e.code])keys[map[e.code]]=false;if(e.code===binds.jump)keys.space=false});
  addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
  document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;if(!(k in keys))return;const on=e=>{e.preventDefault();if(mode==='play')keys[k]=true},off=e=>{e.preventDefault();keys[k]=false};b.addEventListener('pointerdown',on);['pointerup','pointerleave','pointercancel'].forEach(t=>b.addEventListener(t,off))});
  $('menuBtn').addEventListener('click',()=>{audio.init();if(mode==='play')openScreen('menuScreen')});
  $('mSound').addEventListener('click',()=>{audio.init();audio.toggle();renderMenu()});
  $('mRestartLevel').addEventListener('click',()=>{closeScreen('menuScreen');restartLevel()});
  $('mRestartGame').addEventListener('click',()=>{location.hash='go';location.reload()});
  $('mExit').addEventListener('click',()=>{location.hash='';location.reload()});
  const endTexts=['The lake rang with music, and the whole lane danced until midnight.','The bazaar cooked together, and every stall shared a plate with a neighbour.','Hundreds of lanterns floated over Mango Lake, and the city has never looked brighter.'];
  document.querySelectorAll('[data-end]').forEach(b=>b.addEventListener('click',()=>{const t=endTexts[Number(b.dataset.end)];if(!t)return;setText($('endText'),t+' Nayapur has a voice now, and Aru is home.');$('endChoices').classList.add('hidden');$('endClose').classList.remove('hidden')}));
  $('tbAction').addEventListener('click',interact);$('tbHorn').addEventListener('click',()=>{if(mode==='play'&&active)audio.horn()});$('tbView').addEventListener('click',()=>{if(mode==='play')state.cam=(state.cam+1)%3});$('tbHit').addEventListener('click',playerAttack);$('tbSwap').addEventListener('click',swapWeapon);bindStick();
  $('tbJobs').addEventListener('click',()=>toggleScreen('board'));$('tbMap').addEventListener('click',()=>toggleScreen('mapScreen'));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeScreen(b.dataset.close)));
  const cv=$('view');
  cv.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY;cv.setPointerCapture(e.pointerId)});
  cv.addEventListener('pointermove',e=>{if(!drag)return;camY-=(e.clientX-px)*.005;camX=clamp(camX+(e.clientY-py)*.004,.05,1.2);px=e.clientX;py=e.clientY});
  ['pointerup','pointercancel'].forEach(t=>cv.addEventListener(t,()=>{drag=false}));
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
  cv.addEventListener('contextmenu',e=>e.preventDefault());
}

function init(){
  if(typeof THREE==='undefined'){$('startBtn').textContent='Could not load the game. Please refresh.';$('startBtn').disabled=true;return}
  try{renderer=new THREE.WebGLRenderer({canvas:$('view'),antialias:true})}catch(e){$('startBtn').textContent='Your browser cannot show 3D. Please try another one.';$('startBtn').disabled=true;return}
  renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,600);clock=new THREE.Clock();
  buildWorld();makeRain();makePlayer();CHARS.forEach(makeChar);speech.init();
  makeVehicle('taxi',-36,-14,0);makeVehicle('car',192,6,Math.PI);makeVehicle('bus',150,96,Math.PI/2);makeVehicle('bike',-192,8,0);makeVehicle('car',-150,96,Math.PI/2);makeVehicle('auto',24,150,0);makeVehicle('scooter',-72,150,0);makeVehicle('car',100,150,Math.PI/2);
  [[0x4263eb,152,-40,152,120],[0xd6336c,-152,-40,-152,120],[0x2f9e44,-110,154,110,154],[0xf08c00,200,20,200,140],[0x7048e8,-200,20,-200,140],[0x0ca678,-30,200,30,200]].forEach(p=>makePerson(p[0],p[1],p[2],p[3],p[4]));
  [[60,154],[-40,156],[154,40],[-154,30]].forEach(c=>makeCow(c[0],c[1]));
  makeVehicle('auto',3,13,Math.PI/2);makeVehicle('taxi',-6,11,0);makeVehicle('scooter',5,16,0);makeVehicle('scooter',-14,-12,0);makeVehicle('scooter',-3,-10,Math.PI);makeVehicle('auto',-48,-20,0);makeVehicle('taxi',30,-3,Math.PI/2);makeVehicle('scooter',-90,-3,0);makeVehicle('taxi',100,70,Math.PI);makeVehicle('auto',-100,70,0);makeVehicle('scooter',70,-8,Math.PI/2);makeVehicle('car',-16,8,0);makeVehicle('car',60,-8,Math.PI/2);makeVehicle('car',100,-10,0);makeVehicle('bike',12,18,0);makeVehicle('bike',-100,-10,0);makeVehicle('bus',80,40,0);makeVehicle('bus',-96,40,0);
  [[0xe4452b,8,-30,8,40],[0x2f9e44,-8,-6,-8,45],[0xf7b500,-40,8,40,8],[0x8e44ad,-40,-8,40,-8],[0x1c7ed6,-52,-45,52,-45],[0xe67700,52,-40,52,60],[0xc2255c,-52,60,-52,-40],[0x0b7285,20,-8,-20,-8],[0xd9480f,0,50,0,66],[0x5c7cfa,-92,-40,-92,90],[0xe8590c,92,-40,92,90],[0x7048e8,60,-8,130,-8],[0xd6336c,-60,8,-130,8],[0x12b886,-100,100,100,100],[0xf08c00,0,100,0,130],[0x2f9e44,100,10,100,80],[0xc2255c,-100,10,-100,80]].forEach(p=>makePerson(p[0],p[1],p[2],p[3],p[4]));
  [[-20,11],[16,-39],[10,28],[56,30],[-56,40],[84,28],[-84,8],[60,118],[-60,118],[12,120],[86,-12]].forEach(c=>makeCow(c[0],c[1]));
  if(location.hash==='#go')setTimeout(()=>$('startBtn').click(),50);
  bindInput();camera.position.set(0,6,76);camTarget.set(0,1,66);camera.lookAt(camTarget);loop();
  $('startBtn').addEventListener('click',()=>{audio.init();$('startScreen').classList.add('hidden');$('hud').classList.remove('hidden');gameOn=true;paused=false;mode='play';money();stars();hp();hudWeapon();startMission(1)});
  const sb=$('startBtn');sb.disabled=false;setText(sb,'Start the story');$('loadHelp').classList.add('hidden');
}
init();
