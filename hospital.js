'use strict';
const HOSP_R=[-80,-11];
const HOSPITAL=Object.freeze({
  building:{t:'CITY HOSPITAL',s:'Care for everyone',bg:'#0f766e',fg:'#ffffff',x:-80,z:-24,w:14,st:4,c:0xeaf4f4},
  respawn:HOSP_R,
  spot:{id:'hospital',name:'City Hospital',x:-80,z:-12,items:[{id:'heal',label:'Full check-up',desc:'Brings your health back to full.',cost:150}]}
});
