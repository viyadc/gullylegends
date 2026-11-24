'use strict';
const VOICE_STYLES=Object.freeze({
  'Meera':{f:1,p:1.55,r:1.12},'Iqbal Uncle':{f:0,p:.6,r:.8},'Tara':{f:1,p:1.15,r:1},'Dev':{f:0,p:.95,r:1.05},'Bunty':{f:0,p:1.35,r:1.2},
  'Sweet seller':{f:0,p:.8,r:.92},'Neighbour':{f:1,p:1,r:1},'Aru':{f:0,p:1.1,r:1.05},'Everyone':{f:1,p:1.25,r:1.05}
});
const speech={
  voices:[],
  init(){if(!window.speechSynthesis)return;const load=()=>{this.voices=speechSynthesis.getVoices()};load();speechSynthesis.onvoiceschanged=load},
  pick(female){
    const all=this.voices,local=all.filter(v=>/^(en|hi)[-_]IN/i.test(v.lang)),pool=local.length?local:all.filter(v=>/^en/i.test(v.lang));
    const re=female?/female|woman|zira|samantha|susan|hazel|heera|aditi|raveena|priya|veena|karen|tessa|fiona|moira|kalpana|swara/i:/\bmale\b|david|mark|ravi|hemant|rishi|daniel|alex|fred|george|james|prabhat|madhur/i;
    return pool.find(v=>re.test(v.name))||pool[0]||null;
  },
  say(who,text){
    if(!window.speechSynthesis||!audio.on)return;
    const st=VOICE_STYLES[who]||VOICE_STYLES.Neighbour,u=new SpeechSynthesisUtterance(text),v=this.pick(!!st.f);
    speechSynthesis.cancel();u.pitch=st.p;u.rate=st.r;u.volume=1;
    if(v){u.voice=v;u.lang=v.lang}else u.lang='en-IN';
    speechSynthesis.speak(u);
  }
};
