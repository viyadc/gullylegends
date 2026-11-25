const JOB_TYPES=Object.freeze([
  {id:'taxi',name:'Taxi Fare',icon:'🚕',need:'taxi',unlock:2,contact:'Raju Bhai',text:'Pick up a passenger and drop them across the city. You need a taxi.'},
  {id:'auto',name:'Auto Fare',icon:'🛺',need:'auto',unlock:4,contact:'Pappan',text:'Take a passenger on a short ride. You need an auto.'},
  {id:'bus',name:'Bus Route',icon:'🚌',need:'bus',unlock:10,contact:'Kaveri Didi',text:'Carry passengers between stops. You need a city bus.'},
  {id:'courier',name:'Courier',icon:'📦',need:null,unlock:12,contact:'Tara',text:'Deliver a parcel anywhere in Nayapur, by any vehicle.'}
]);
function pickOne(a){return a[Math.floor(Math.random()*a.length)]}
function startJob(id){
  const t=JOB_TYPES.find(q=>q.id===id);
  if(!t||state.mission||state.done.size<t.unlock)return;
  const pool=ODDS.filter(o=>!o.z||state.zones[o.z]),a=pickOne(pool);let b=a;
  while(b===a)b=pickOne(pool);
  const dist=Math.hypot(a.p[0]-b.p[0],a.p[1]-b.p[1]),cour=t.id==='courier';
  begin({id:100,odd:true,icon:t.icon,name:t.name,need:t.need||undefined,time:Math.round(30+dist/8),pay:Math.round(120+dist*2.2),
    stages:[{p:a.p,t:(cour?'Pick up the parcel at ':'Pick up your passenger at ')+a.n},{p:b.p,t:(cour?'Deliver it to ':'Drop them at ')+b.n}]});
}
function renderJobs(list){
  const head=document.createElement('p');head.className='lead';head.style.margin='18px 0 0';head.textContent='Side jobs';list.append(head);
  JOB_TYPES.forEach(t=>{
    const open=state.done.size>=t.unlock,row=document.createElement('div');row.className='mission';
    const info=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p'),meta=document.createElement('div');
    h.textContent=t.icon+' '+t.name;p.textContent=open?t.text:'Finish Level '+t.unlock+' to meet '+t.contact+'.';meta.className='meta';meta.textContent=open?'Contact: '+t.contact:'Locked';
    info.append(h,p,meta);
    const b=document.createElement('button');b.className='btn small';b.textContent=open?'Take a job':'Locked';b.disabled=!open||!!state.mission;
    b.addEventListener('click',()=>startJob(t.id));row.append(info,b);list.append(row);
  });
}
