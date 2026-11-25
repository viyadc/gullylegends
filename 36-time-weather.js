const DAY_SECONDS=720;
const SKY_KEYS=[[0,0x0b1026,.12],[5,0x1a2347,.14],[6.5,0xf59e6c,.5],[8,0x87b8e8,.9],[16,0x87b8e8,.9],[18,0xf08a5d,.55],[19.5,0x1a2347,.2],[24,0x0b1026,.12]];
const WX=Object.freeze({clear:{fog:.0045,rain:0,dim:1},cloudy:{fog:.007,rain:0,dim:.78},rain:{fog:.012,rain:1,dim:.58},fog:{fog:.02,rain:0,dim:.72}});
const WX_ICON=Object.freeze({clear:'☀',cloudy:'☁',rain:'🌧',fog:'🌫'});
const sunOff=V3(50,60,-30);
function skyAt(h){
  for(let i=0;i<SKY_KEYS.length-1;i++){
    const a=SKY_KEYS[i],b=SKY_KEYS[i+1];
    if(h>=a[0]&&h<=b[0]){const t=(h-a[0])/(b[0]-a[0]);return{c:new THREE.Color(a[1]).lerp(new THREE.Color(b[1]),t),l:a[2]+(b[2]-a[2])*t}}
  }
  return{c:new THREE.Color(0x0b1026),l:.12};
}
function pickWeather(h){
  const r=Math.random();
  if(h>=4&&h<8)return r<.45?'fog':r<.7?'cloudy':'clear';
  if(h>=8&&h<14)return r<.65?'clear':r<.9?'cloudy':'rain';
  if(h>=14&&h<19)return r<.4?'rain':r<.7?'cloudy':'clear';
  if(h>=19&&h<24)return r<.55?'clear':r<.8?'cloudy':'rain';
  return r<.6?'clear':r<.8?'fog':'cloudy';
}
function updateTime(dt){
  state.hour=(state.hour+dt*24/DAY_SECONDS)%24;
  const h=state.hour,hi=Math.floor(h);
  if(hi!==state.lastHour){state.lastHour=hi;if(Math.random()<.55)state.wxT=pickWeather(h)}
  const forced=!!state.mission&&!!state.mission.m.rain,tw=WX[forced?'rain':state.wxT],k=Math.min(1,dt*.4);
  state.rainK+=(tw.rain-state.rainK)*k;state.fogD+=(tw.fog-state.fogD)*k;state.dim+=(tw.dim-state.dim)*k;
  const s=skyAt(h),night=1-clamp((s.l-.12)/.6,0,1),col=s.c.multiplyScalar(.4+.6*state.dim);
  scene.background.copy(col);scene.fog.color.copy(col);scene.fog.density=state.fogD*(1+night*.3);
  hemi.intensity=Math.max(.32,s.l*state.dim*1.05);
  const ang=(h-6)/12*Math.PI,up=Math.sin(ang);
  sunL.intensity=Math.max(0,up)*1.4*state.dim;sunL.color.setHex(h<8||h>17?0xffb070:0xfff0d8);
  sunOff.set(Math.cos(ang)*60,Math.max(10,Math.abs(up)*60),-30);
  lampLights.forEach(p=>{p.intensity=night*1.6});
  const mm=Math.floor((h-hi)*60),icon=night>.6&&state.wxT==='clear'&&!forced?'🌙':WX_ICON[forced?'rain':state.wxT];
  setText($('timeTag'),icon+' '+String(hi).padStart(2,'0')+':'+String(Math.floor(mm/10)*10).padStart(2,'0'));
}
