'use strict';
const audio={ctx:null,master:null,on:true,eng:null,rainG:null,sf:false,next:{bell:6,bird:3,step:0,siren:0},
init(){if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;this.ctx=new A();this.master=this.ctx.createGain();this.master.gain.value=this.on?.9:0;this.master.connect(this.ctx.destination);this.ambient()}if(this.ctx.state==='suspended')this.ctx.resume()},
noise(sec){const c=this.ctx,n=Math.floor(c.sampleRate*sec),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return b},
ambient(){const c=this.ctx;const crowd=c.createBufferSource(),cf=c.createBiquadFilter(),cg=c.createGain();crowd.buffer=this.noise(2);crowd.loop=true;cf.type='bandpass';cf.frequency.value=420;cg.gain.value=.05;crowd.connect(cf);cf.connect(cg);cg.connect(this.master);crowd.start();
const rn=c.createBufferSource(),rf=c.createBiquadFilter();this.rainG=c.createGain();rn.buffer=this.noise(2);rn.loop=true;rf.type='highpass';rf.frequency.value=1800;this.rainG.gain.value=0;rn.connect(rf);rf.connect(this.rainG);this.rainG.connect(this.master);rn.start();
const o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o.frequency.value=55;f.type='lowpass';f.frequency.value=380;g.gain.value=0;o.connect(f);f.connect(g);g.connect(this.master);o.start();this.eng={o,g}},
tone(fs,type,gap,dur,vol){const c=this.ctx;if(!c||!this.on)return;const t=c.currentTime;fs.forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),st=t+i*gap;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,st);g.gain.exponentialRampToValueAtTime(.001,st+dur);o.connect(g);g.connect(this.master);o.start(st);o.stop(st+dur)})},
burst(vol,dur,freq){const c=this.ctx;if(!c||!this.on)return;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise(dur);f.type='lowpass';f.frequency.value=freq;g.gain.setValueAtTime(vol,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);s.connect(f);f.connect(g);g.connect(this.master);s.start()},
horn(){this.tone([392,494],'sawtooth',0,.55,.25)},chime(){this.tone([523,659,784,1046],'sine',.07,.3,.2)},win(){this.tone([440,554,659,880],'triangle',.12,.5,.28)},
crash(){this.burst(.7,.3,900);this.tone([90],'sine',0,.3,.5)},shot(){this.burst(.5,.12,2500);this.tone([140],'square',0,.1,.2)},thud(){this.tone([180,110],'square',.05,.18,.18);this.burst(.3,.15,500)},step(){this.burst(.12,.07,260)},
bell(){this.tone([523,1046,1568],'sine',0,2.4,.08)},bird(){this.tone([2400,3100,2700],'sine',.08,.1,.05)},siren(){this.sf=!this.sf;this.tone([this.sf?950:700],'sine',0,.3,.09)},
setEngine(r,on){if(!this.eng)return;const t=this.ctx.currentTime;this.eng.g.gain.setTargetAtTime(on?.05+r*.1:0,t,.1);this.eng.o.frequency.setTargetAtTime(55+r*95,t,.1)},
setRain(a){if(this.rainG)this.rainG.gain.setTargetAtTime(a*.12,this.ctx.currentTime,.3)},
toggle(){this.on=!this.on;if(!this.on&&window.speechSynthesis)speechSynthesis.cancel();if(this.master)this.master.gain.value=this.on?.9:0},
tick(dt,raining){if(!this.ctx)return;this.next.bird-=dt;if(this.next.bird<=0){if(!raining)this.bird();this.next.bird=4+Math.random()*6}}};
