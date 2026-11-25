'use strict';
const MISSIONS=Object.freeze([
  {id:1,icon:'🚶',name:'Back to Nayapur',story:'Walk from the city gate to the family garage. Say hello to your neighbours on the way.',time:0,pay:300,stages:[
    {p:[-12,42],t:'Say hello to Meera',w:'Meera',s:'Welcome back, Aru! The garage is straight ahead, past the bazaar.'},
    {p:[12,36],t:'Say hello to Dev',w:'Dev',s:'I drive past your garage every day. Iqbal Uncle has been waiting for you.'},
    {p:[8,13],t:'Meet Iqbal Uncle at the garage',w:'Iqbal Uncle',s:'Arre Aru! Come in. The garage needs you.'}]},
  {id:2,icon:'⚙️',name:'Parts on the Run',story:'A customer is waiting for a gear part. Get it from Tara in Chowk Bazaar and return before the garage closes.',time:70,pay:600,stages:[
    {p:[30,-12],t:'Get the gear part from Tara',w:'Tara',s:'Here you go! Watch out for cows on the road.'},
    {p:[8,13],t:'Bring the part to Iqbal Uncle',w:'Iqbal Uncle',s:'Perfect timing. You saved the day!'}]},
  {id:3,icon:'🍱',name:'The Missing Tiffin',story:'Meera lost her lunchbox on the way home. Follow the clues and find it.',time:0,pay:500,stages:[
    {p:[-12,42],t:'Ask Meera what happened',w:'Meera',s:'I lost my tiffin near the lanes. Can you help me find it?'},
    {p:[-24,-12],t:'Ask at Gulabi Sweets',w:'Sweet seller',s:'A steel tiffin? Try the west road. A cow was nearby.'},
    {p:[-48,40],t:'Look near the cow on the west road',w:'Aru',s:'Found it! The cow was guarding it.'},
    {p:[-12,42],t:'Return the tiffin to Meera',w:'Meera',s:'My tiffin! Thank you, Aru!'}]},
  {id:4,icon:'🛺',name:'Auto Fare',story:'Pappan fixed the old auto. Drive Mrs. Verma to the hospital, then to the temple.',time:100,pay:700,need:'auto',stages:[
    {p:[-24,-12],t:'Pick up Mrs. Verma at Gulabi Sweets',w:'Mrs. Verma',s:'Thank you for coming, beta. Please take me to the hospital.'},
    {p:[-80,-12],t:'Take her to City Hospital',w:'Mrs. Verma',s:'My knee check-up! Now please take me to the temple.'},
    {p:[0,-50],t:'Take her to the lake temple',w:'Mrs. Verma',s:'Strange men with maps came to our gully last week. Nobody told us why.'}]},
  {id:5,icon:'🌧️',name:'Monsoon Rescue',story:'Heavy rain has flooded the lanes. Ride a scooter, avoid the puddles, and deliver supplies to neighbours.',time:80,pay:900,need:'scooter',rain:true,stages:[
    {p:[-38,10],t:'Deliver blankets to the first home',w:'Neighbour',s:'Thank you! We were getting cold.'},
    {p:[-56,44],t:'Deliver hot chai on the west side',w:'Neighbour',s:'Chai in this rain? You are an angel.'},
    {p:[-12,42],t:'Deliver food to Meera\'s family',w:'Meera',s:'Mummy says thank you!'}]},
  {id:6,icon:'🏁',name:'Race Around the Chowk',story:'Bunty is hosting a friendly scooter race. Ride clean, pick good shortcuts, and finish first.',time:55,pay:1000,need:'scooter',stages:[
    {p:[48,0],t:'Race to the east crossing'},{p:[48,-48],t:'Race to the lake road'},{p:[0,-48],t:'Race along the lake road'},
    {p:[-12,-9],t:'Finish at Bunty',w:'Bunty',s:'Not bad, mechanic! Let us race again soon.'}]},
  {id:7,icon:'🪔',name:'Festival Lights',story:'Collect decorations, fix the string lights, and hang them at the lake temple for the festival.',time:90,pay:1100,stages:[
    {p:[34,10],t:'Get garlands from the bazaar',w:'Tara',s:'Take these marigold garlands!'},
    {p:[-36,-10],t:'Get lights from the gully',w:'Meera',s:'Here are our old lights. They just need fixing.'},
    {p:[8,13],t:'Fix the lights at the garage',w:'Iqbal Uncle',s:'All fixed. Now go hang them at the lake temple.'},
    {p:[0,-54],t:'Hang the lights at the lake temple',w:'Everyone',s:'The temple looks magical!'}]},
  {id:8,icon:'🚕',name:'Night Taxi',story:'Zoya, a young reporter, needs a quiet ride. She says she knows a secret about the city plan.',time:110,pay:1200,need:'taxi',stages:[
    {p:[64,-12],t:'Pick up Zoya at Naya Tiffin',w:'Zoya',s:'Quick, Aru! Drive to the lake road. I have news.'},
    {p:[0,-50],t:'Drive Zoya to the lake road',w:'Zoya',s:'The plan was changed last month. The new papers hide our gully!'},
    {p:[10,10],t:'Drop Zoya at the garage',w:'Zoya',s:'Keep this quiet until we have proof.'}]},
  {id:9,icon:'📜',name:'A Plan for the Gully',story:'The new building plan leaves out many local shops. Gather stories from your neighbours.',time:0,pay:800,stages:[
    {p:[30,-12],t:'Listen to Tara',w:'Tara',s:'The plan shows no bazaar at all. Where do we go?'},
    {p:[-12,42],t:'Listen to Meera',w:'Meera',s:'Our lane is missing from the plan too.'},
    {p:[12,36],t:'Listen to Dev',w:'Dev',s:'Nobody asked the bus drivers either.'},
    {p:[8,13],t:'Share the stories with Iqbal Uncle',w:'Iqbal Uncle',s:'Good work. Now we need the real papers from Rajmahal Heights.'}]},
  {id:10,icon:'🚌',name:'Bus Route 108',story:'Dev lends you his city bus. Pick up neighbours and bring them to the meeting at the lake.',time:140,pay:1400,need:'bus',stages:[
    {p:[80,48],t:'Start the route at the bus depot',w:'Kaveri Didi',s:'Route 108 is yours today. Bring everyone to the lake.'},
    {p:[48,30],t:'Pick up neighbours at the east stop',w:'Neighbour',s:'Wait for us! We are coming.'},
    {p:[-48,30],t:'Pick up neighbours at the west stop',w:'Neighbour',s:'Is there space for the children?'},
    {p:[0,-50],t:'Drive everyone to the lake meeting',w:'Everyone',s:'Thank you for the ride, Aru!'}]},
  {id:11,icon:'🗂️',name:'The Missing Papers',story:'Iqbal Uncle needs the real plan. Visit Rajmahal Heights, find the clerk and bring a copy home.',time:170,pay:1500,stages:[
    {p:[192,24],t:'Visit the guard at Rajmahal Heights',w:'Guard',s:'The office is closed. But the clerk left a copy at the market.'},
    {p:[144,60],t:'Meet the clerk at Heights Market',w:'Clerk',s:'Here is the real plan. Take it to Iqbal Uncle. Hurry.'},
    {p:[8,13],t:'Bring the papers to the garage',w:'Iqbal Uncle',s:'This proves it. The plan was changed in secret!'}]},
  {id:12,icon:'🎉',name:'Nayapur Day',story:'The whole neighbourhood is gathering at Mango Lake. Help with the last tasks and speak up.',time:130,pay:2500,stages:[
    {p:[-24,-12],t:'Pick up sweets for everyone',w:'Sweet seller',s:'Sweets for the whole city!'},
    {p:[30,-12],t:'Collect the bazaar banners',w:'Tara',s:'The banners are ready!'},
    {p:[0,-54],t:'Set up the stage at Mango Lake',w:'Everyone',s:'The stage is ready!'},
    {p:[8,13],t:'Bring Iqbal Uncle to the event',w:'Iqbal Uncle',s:'Aru, it is time to speak. Go on.'}]}
]);
const ODDS=Object.freeze([{n:'Tara Traders',p:[-64,-12]},{n:'Gulabi Sweets',p:[-24,-12]},{n:'Chowk Spares',p:[24,-12]},{n:'Naya Tiffin',p:[64,-12]},{n:'the Bus Depot',p:[80,48]},{n:'the Naya Nagar flats',p:[114,-10]},{n:'the Lake Temple',p:[0,-50]},{n:'the farm road',p:[-60,112]},
  {n:'Rajmahal Plaza',p:[192,24],z:'east'},{n:'Heights Market',p:[144,60],z:'east'},{n:'Old Fort Gate',p:[-192,24],z:'west'},{n:'Basti Chowk',p:[-144,60],z:'west'},{n:'Farm Mart',p:[24,144],z:'south'},{n:'the Grain Store',p:[-72,192],z:'south'}]);
function setBeam(p){
  if(state.beam){scene.remove(state.beam.g);state.beam=null}
  if(!p)return;
  const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,30,16,1,true),new THREE.MeshBasicMaterial({color:0xf7b500,transparent:true,opacity:.4,side:THREE.DoubleSide}));b.position.y=15;g.add(b);
  const r=new THREE.Mesh(new THREE.RingGeometry(1.5,2.2,32),new THREE.MeshBasicMaterial({color:0xf7b500,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.y=.12;g.add(r);g.position.set(p[0],0,p[1]);scene.add(g);state.beam={g,r,x:p[0],z:p[1]};
}
function fmtTime(s){return '00:'+String(Math.max(0,Math.ceil(s))).padStart(2,'0')}
function showStep(){const s=state.mission,m=s.m;setText($('mText'),(m.odd?'':'Level '+m.id+' • ')+'Step '+(s.i+1)+' of '+m.stages.length+': '+m.stages[s.i].t)}
function begin(m){
  state.mission={m,i:0,t:m.time||Infinity};state.lastId=m.id;closeScreen('board');
  $('tracker').classList.remove('hidden');$('steps').classList.remove('hidden');setText($('mTitle'),m.odd?m.name:'Level '+m.id+' • '+m.name);showStep();
  setText($('timer'),m.time?fmtTime(m.time):'No rush');setBeam(m.stages[0].p);
}
function startMission(id){const m=MISSIONS.find(q=>q.id===id);if(!m||state.mission||state.done.has(id)||state.done.size!==id-1)return;begin(m)}
function endMission(){state.mission=null;setBeam(null);$('tracker').classList.add('hidden');$('steps').classList.add('hidden')}
function restartLevel(){
  const id=state.mission?state.mission.m.id:state.lastId,m=MISSIONS.find(q=>q.id===id);
  if(state.mission)endMission();
  if(m&&!state.done.has(id))begin(m);else toast('There is no level to restart right now.');
}
function updateMission(dt){
  const s=state.mission;if(!s)return;
  if(s.m.time){s.t-=dt;setText($('timer'),fmtTime(s.t));if(s.t<=0){toast('Time is up! Mission failed. Try again from the Menu or the mission board.',4200);endMission();return}}
  const st=s.m.stages[s.i];
  if(s.m.need&&!(active&&active.kind===s.m.need)){setText($('mText'),'Get in the '+NEED_NAME[s.m.need]+' first');return}
  showStep();
  const pos=(active?active.mesh:player.mesh).position;
  if(Math.hypot(pos.x-st.p[0],pos.z-st.p[1])<3.4){
    audio.chime();s.i++;
    const line=st.s?st.w+': '+st.s:'';if(st.s)speech.say(st.w,st.s);
    if(s.i>=s.m.stages.length){
      state.cash+=s.m.pay;money();audio.win();
      let extra='';
      if(!s.m.odd){state.done.add(s.m.id);setText($('progress'),state.done.size+' / '+MISSIONS.length+' DONE');extra=checkUnlocks()}
      toast((line?line+'  •  ':'')+'Mission complete! +₹'+s.m.pay.toLocaleString('en-IN')+(extra?'  •  '+extra:''),6400);
      endMission();
      if(state.done.size===MISSIONS.length&&!state.ended){state.ended=true;setTimeout(()=>openScreen('endScreen'),2400)}
    }else{setBeam(s.m.stages[s.i].p);showStep();toast(line||'Good! Head to the next spot.',5200)}
  }
}

function renderBoard(){
  const list=$('missionList');list.replaceChildren();
  setText($('debtLine'),'Story progress: '+state.done.size+' of '+MISSIONS.length+' missions done');
  MISSIONS.forEach(m=>{
    const done=state.done.has(m.id),locked=!done&&state.done.size!==m.id-1;
    const row=document.createElement('div');row.className='mission'+(done?' done':'');
    const info=document.createElement('div');
    const h=document.createElement('h3');h.textContent=m.icon+' '+m.name;
    const p=document.createElement('p');p.textContent=m.story;
    const meta=document.createElement('div');meta.className='meta';meta.textContent='Pay ₹'+m.pay.toLocaleString('en-IN')+'  •  '+(m.time?m.time+' seconds':'No time limit');
    info.append(h,p,meta);
    const btn=document.createElement('button');btn.className='btn small';btn.textContent=done?'Done':locked?'Locked':'Accept';btn.disabled=done||locked||!!state.mission;
    btn.addEventListener('click',()=>startMission(m.id));
    row.append(info,btn);list.append(row);
  });
  renderJobs(list);
}
