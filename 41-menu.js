'use strict';
const HELP=Object.freeze([
  'Move: W A S D or the arrow keys. Drag the screen to turn the camera.',
  'Use the Interact key to get in or out of a vehicle, shop, rest, pray or read a note.',
  'The horn works only when you are in a vehicle.',
  'Attack with your weapon. Switch between the cricket bat and the pistol with the switch key. The pistol needs bullets.',
  'Spend money at Udaan Motors, the chai stall, Tara Traders, the temple, the hospital, the ammo shop and your flat.',
  'Police: hurting a person, or hitting one with a vehicle, brings the police. You can reach five stars. More stars bring armed officers, then jeeps, then special squads.',
  'You can fight the police, but every officer you hurt makes the police send more help.',
  'To escape: run far away. You lose one star every few seconds while you stay far from the police. Resting at your flat helps too.',
  'If you are caught, you wake up at the police station and lose your bullets. If your health ends, you wake up at the hospital. Either way the mission fails.',
  'Look around the city. Some people leave notes for those who look carefully.',
  'Once the story is done, take Odd Jobs on the mission board.'
]);
const ACTS=Object.freeze([['act','Interact'],['fire','Attack'],['swap','Switch weapon'],['horn','Horn'],['jobs','Mission board'],['map','City map'],['jump','Jump or brake']]);
const TABS=['Levels','Messages','Map','Help','Controls'];
const keyName=c=>c.replace('Key','').replace('Digit','').replace('Arrow','Arrow ');
function renderMenu(){
  const t=$('tabs'),p=$('panel');t.replaceChildren();p.replaceChildren();
  TABS.forEach(n=>{const b=document.createElement('button');b.className='tab'+(n===state.tab?' on':'');b.textContent=n;b.addEventListener('click',()=>{if(n==='Map'){closeScreen('menuScreen');openScreen('mapScreen');return}state.tab=n;state.rebind=null;renderMenu()});t.append(b)});
  if(state.tab==='Levels'){
    MISSIONS.forEach(m=>{const r=document.createElement('div');r.className='krow';const a=document.createElement('span');a.textContent=m.icon+' Level '+m.id+': '+m.name;const b=document.createElement('b');b.textContent=state.done.has(m.id)?'Done':(state.mission&&state.mission.m.id===m.id)?'In progress':state.done.size===m.id-1?'Ready':'Locked';r.append(a,b);p.append(r)});
  }else if(state.tab==='Messages'){
    if(!state.log.length)p.textContent='No messages yet.';
    state.log.forEach(l=>{const d=document.createElement('div');d.className='logline';d.textContent=l;p.append(d)});
  }else if(state.tab==='Help'){
    HELP.forEach(l=>{const d=document.createElement('div');d.className='logline';d.textContent=l;p.append(d)});
  }else{
    const f=document.createElement('div');f.className='krow';const fa=document.createElement('span');fa.textContent='Move';const fb=document.createElement('b');fb.textContent='W A S D or arrows';f.append(fa,fb);p.append(f);
    ACTS.forEach(a=>{const r=document.createElement('div');r.className='krow';const n=document.createElement('span');n.textContent=a[1];const b=document.createElement('button');b.textContent=state.rebind===a[0]?'Press a key':keyName(binds[a[0]]);b.addEventListener('click',()=>{state.rebind=a[0];renderMenu()});r.append(n,b);p.append(r)});
  }
  setText($('mSound'),'Sound: '+(audio.on?'on':'off'));
}
function openScreen(id){if(!gameOn)return;if(id==='board')renderBoard();if(id==='menuScreen')renderMenu();if(id==='mapScreen')drawWorld($('mapCanvas').getContext('2d'),440,420,0,40,1.55,true);$(id).classList.remove('hidden');paused=true;mode=id;Object.keys(keys).forEach(k=>keys[k]=false)}
function closeScreen(id){$(id).classList.add('hidden');paused=false;mode='play'}
function toggleScreen(id){if(mode===id)closeScreen(id);else if(mode==='play')openScreen(id)}
