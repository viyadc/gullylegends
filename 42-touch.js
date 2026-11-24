'use strict';
function bindStick(){
  const st=$('stick'),kn=$('knob'),R=46;let id=null;
  const set=(x,y)=>{const d=Math.hypot(x,y),k=d>R?R/d:1;kn.style.transform='translate('+x*k+'px,'+y*k+'px)';const on=mode==='play';keys.left=on&&x<-16;keys.right=on&&x>16;keys.up=on&&y<-16;keys.down=on&&y>16};
  const move=e=>{const r=st.getBoundingClientRect();set(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))};
  st.addEventListener('pointerdown',e=>{e.preventDefault();id=e.pointerId;st.setPointerCapture(id);move(e)});
  st.addEventListener('pointermove',e=>{if(e.pointerId===id)move(e)});
  const end=e=>{if(e.pointerId!==id)return;id=null;set(0,0)};
  ['pointerup','pointercancel','lostpointercapture'].forEach(t=>st.addEventListener(t,end));
}
