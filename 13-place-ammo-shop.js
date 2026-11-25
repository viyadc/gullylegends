'use strict';
const AMMO_SHOP=Object.freeze({
  building:{shop:true,t:'AMMO SHOP',s:'Arms and Safety Gear',bg:'#3f3f46',fg:'#fde047',x:-80,z:60,w:14,st:2,c:0x71717a},
  spot:{id:'ammo',name:'Nayapur Ammo Shop',x:-80,z:48,items:[
    {id:'pistol',label:'Pistol with 12 bullets',desc:'A strong weapon for hard times. Use it wisely.',cost:800,once:true},
    {id:'ammo',label:'Box of 12 bullets',desc:'Needs a pistol. You can carry up to 99.',cost:150,needs:'pistol'},
    {id:'vest',label:'Safety vest',desc:'You take half the damage from hits.',cost:400,once:true}]}
});
