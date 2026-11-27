'use strict';
const SPOTS=Object.freeze([
  {id:'garage',name:'Udaan Motors',x:10,z:10,items:[{id:'paint',label:'Repaint a vehicle',desc:'A fresh colour for the vehicle you are near.',cost:100},{id:'tune',label:'Engine tune-up',desc:'Makes every vehicle a little faster. Up to 2 times.',cost:500,max:2}]},
  {id:'chai',name:'Chowk Chai Stall',x:-10,z:-12,items:[{id:'chai',label:'Cutting chai and snack',desc:'Hot and tasty. Gives you some health back.',cost:30}]},
  {id:'clothes',name:'Tara Traders',x:-64,z:-12,items:[{id:'jacket',label:'Blue jacket',desc:'A smart new look for Aru.',cost:250,once:true}]},
  {id:'temple',name:'Lake Temple',x:0,z:-61,items:[{id:'pray',label:'Offer prayers and a donation',desc:'Feel calm and strong again.',cost:50}]},
  HOSPITAL.spot,FLAT.spot,AMMO_SHOP.spot
]);
const PAINTS=Object.freeze([0xe4452b,0x2563eb,0x16a34a,0x7c3aed,0xf59e0b,0x111827]);
function hp(){$('hpBar').style.width=Math.max(0,state.health)+'%'}
function heal(n){state.health=Math.min(100,state.health+n);hp()}
function nearSpot(){const p=player.mesh.position;return SPOTS.find(q=>Math.hypot(p.x-q.x,p.z-q.z)<3.6)}
function interact(){
  if(paused)return;
  if(active){const r=active.mesh.rotation.y,p=active.mesh.position;player.mesh.position.set(p.x+Math.cos(r)*2.2,0,p.z-Math.sin(r)*2.2);pushOut(player.mesh.position,.5);swing(player.h,0,0);player.pose={};active.speed=0;active=null;player.mesh.rotation.z=0;return}
  const v=nearVehicle(),sp=nearSpot();
  if(v&&v.rescue&&state.retry){startRide(v);return}
  if(sp&&!(v&&player.mesh.position.distanceTo(v.mesh.position)<2.8)){state.spot=sp;renderShop();openScreen('shopScreen');return}
  if(v){if(vehLocked(v)){toast('The '+v.name+' unlocks after Level '+VEH_UNLOCK[v.kind]+'.');return}active=v}
}
function renderShop(){
  const sp=state.spot;setText($('shopTitle'),sp.name);setText($('shopCash'),'You have ₹'+state.cash.toLocaleString('en-IN'));
  const l=$('shopList');l.replaceChildren();
  sp.items.forEach(it=>{
    const row=document.createElement('div');row.className='mission';const info=document.createElement('div');
    const h=document.createElement('h3');h.textContent=it.label;const p=document.createElement('p');p.textContent=it.desc;info.append(h,p);
    const owned=it.once&&state.owned.has(it.id),maxed=(it.max&&state.tuned>=it.max)||(it.id==='ammo'&&state.ammo>=99),locked=it.needs&&!state.owned.has(it.needs);
    const b=document.createElement('button');b.className='btn small';b.textContent=owned?'Owned':maxed?'Maxed':locked?'Locked':it.cost?'Pay ₹'+it.cost:'Free';
    b.disabled=owned||maxed||locked||state.cash<it.cost;b.addEventListener('click',()=>buy(it));row.append(info,b);l.append(row);
  });
}
function buy(it){
  if(state.cash<it.cost)return;
  if(it.id==='paint'){
    let best=active,bd=12;if(!best)vehicles.forEach(v=>{const d=player.mesh.position.distanceTo(v.mesh.position);if(d<bd){bd=d;best=v}});
    if(!best){toast('Bring a vehicle close to the garage first.');return}
    const c=PAINTS[state.paintI++%PAINTS.length];best.pm.forEach(m=>{m.material=m.material.clone();m.material.color.setHex(c)});
  }else if(it.id==='tune'){state.tuned++;vehicles.forEach(v=>{v.max*=1.1;v.acc*=1.1});}
  else if(it.id==='pistol'){state.owned.add('pistol');state.ammo=Math.min(99,state.ammo+12);state.weapon='pistol';equipVisual();hudWeapon();}
  else if(it.id==='ammo'){state.ammo=Math.min(99,state.ammo+12);hudWeapon();}
  else if(it.id==='vest'){state.vest=true;}
  else if(it.id==='chai'){heal(25);}
  else if(it.id==='jacket'){player.h.cloth.forEach(m=>{m.material=mat(0x2563eb)});}
  else if(it.id==='pray'){heal(40);}
  else if(it.id==='heal'){heal(100);}
  else if(it.id==='rent'){}
  else if(it.id==='rest'){heal(100);if(state.wanted&&minCop()>25){setWanted(0);toast('You rested at home. The police lost you.')}}
  state.cash-=it.cost;if(it.once||it.id==='rent')state.owned.add(it.id);money();audio.chime();renderShop();
}
