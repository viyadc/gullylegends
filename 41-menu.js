'use strict';
const HELP=Object.freeze([
  'Move: W A S D or the arrow keys. Drag the screen to turn the camera.',
  'Camera view: switch between close view, far view and first person.',
  'Use the Interact key to get in or out of a vehicle, shop, rest or pray.',
  'The horn works only when you are in a vehicle.',
  'You fight with your fists. Buy a pistol at the ammo shop, then use the switch key to change weapons. The pistol needs bullets.',
  'Spend money at Udaan Motors, the chai stall, Tara Traders, the temple, the hospital, the ammo shop and your flat.',
  'Finish story levels to unlock new vehicles, new neighbourhoods and new side jobs. Closed roads show a sign that tells you the level.',
  'Meet contacts like Raju Bhai, Pappan and Kaveri Didi to take taxi, auto and bus jobs.',
  'Police: hurting a person, or hitting one with a vehicle, brings the police. You can reach six stars. More stars bring armed officers, jeeps, roadblocks, helicopters and special squads.',
  'You can fight the police, but every officer you hurt makes the police send more help.',
  'To escape: run far away. You lose one star every few seconds while you stay far from the police. Resting at your flat helps too.',
  'If you are caught, you wake up at the police station and lose your bullets. If your health ends, you wake up at the hospital. A taxi will wait to take you back to your mission.',
  'The day turns into night, and the weather changes through the day.',
  'Once the story is done, keep earning with side jobs on the mission board.'
]);
const ACTS=Object.freeze([['act','Interact'],['cam','Camera view'],['fire','Attack'],['swap','Switch weapon'],['horn','Horn'],['jobs','Mission board'],['map','City map'],['jump','Jump or brake']]);
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
