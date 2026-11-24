'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const setText=(n,t)=>{if(n.textContent!==t)n.textContent=t};
const HALF=136,NORTH=-62;

let scene,camera,renderer,clock,player,active=null,rain,hemi,puddleGroup,sunL,gameOn=false,paused=true,mode='start';
const vehicles=[],boxes=[],people=[],cows=[],chars=[],units=[],mats={};
let camY=0,camX=.35,drag=false,px=0,py=0;
const camTarget=V3(0,1,0);
const keys={up:false,down:false,left:false,right:false,space:false};
const state={cash:500,wanted:0,wantTimer:0,crashCd:0,mission:null,done:new Set(),beam:null,toastTimer:0,ended:false,health:100,lost:0,log:[],owned:new Set(),tuned:0,paintI:0,tab:'Levels',rebind:null,spot:null,lastId:1,inTemple:false,ammo:0,weapon:'bat',vest:false,kills:0,buf:'',atkCd:0};
const binds={act:'KeyF',horn:'KeyH',jobs:'KeyM',map:'KeyN',jump:'Space',fire:'KeyE',swap:'KeyQ'};
const marker={pos:V3(10,0,10),icon:null};
