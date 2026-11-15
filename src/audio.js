// ================= AUDIO (all synthesized, no files) =================
const AU=(()=>{
  let c=null,master,bus,noiseBuf,on=localStorage.getItem('apex_snd')!=='0',N={},gear=1,thr=0,shiftT=0,revT=0,wasLive=false;
  const ready=()=>c&&c.state==='running'&&on;
  function noiseSrc(loop){const s=c.createBufferSource();s.buffer=noiseBuf;s.loop=!!loop;return s;}
  function pan(v){if(!c.createStereoPanner)return master;const p=c.createStereoPanner();p.pan.value=v;p.connect(master);return p;}
  function build(){
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;c=new AC();
    master=c.createGain();master.gain.value=on?.85:0;
    const comp=c.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=12;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.18;
    master.connect(comp);comp.connect(c.destination);
    const len=c.sampleRate*2;noiseBuf=c.createBuffer(1,len,c.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    // engine: clean additive harmonic stack + soft saw body, rpm-following lowpass, no hard clipping
    const eg=c.createGain();eg.gain.value=0;
    const sh=c.createWaveShaper(),cv=new Float32Array(256);for(let i=0;i<256;i++){const x=i/127.5-1;cv[i]=Math.tanh(x*1.25)/Math.tanh(1.25);}sh.curve=cv;
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;lp.Q.value=.6;
    const HM=[.5,1,2,3,4,5,6,8],HW=[.55,1,.8,.6,.42,.3,.2,.1],hs=[],hg=[];
    HM.forEach((m,k)=>{const o=c.createOscillator();o.type='sine';const g=c.createGain();g.gain.value=0;o.connect(g);g.connect(sh);o.start();hs.push(o);hg.push(g);});
    const sw=c.createOscillator(),sf2=c.createBiquadFilter(),sgn=c.createGain();sw.type='sawtooth';sw.detune.value=7;sf2.type='lowpass';sf2.frequency.value=1200;sf2.Q.value=.5;sgn.gain.value=.16;sw.connect(sf2);sf2.connect(sgn);sgn.connect(sh);sw.start();
    sh.connect(lp);lp.connect(eg);eg.connect(master);
    const rn=noiseSrc(true),rb=c.createBiquadFilter();rb.type='bandpass';rb.frequency.value=1800;rb.Q.value=.7;const rg=c.createGain();rg.gain.value=0;rn.connect(rb);rb.connect(rg);rg.connect(master);rn.start();
    N.eng={eg,lp,hs,hg,HM,HW,sw,sf2,rg,rb};
    // wind
    const wn=noiseSrc(true),wf=c.createBiquadFilter();wf.type='lowpass';wf.frequency.value=400;const wg=c.createGain();wg.gain.value=0;wn.connect(wf);wf.connect(wg);wg.connect(master);wn.start();N.wind={wg,wf};
    const pn=noiseSrc(true),pf=c.createBiquadFilter();pf.type='highpass';pf.frequency.value=2400;const pg=c.createGain();pg.gain.value=0;pn.connect(pf);pf.connect(pg);pg.connect(master);pn.start();N.rain={pg};
    // tire squeal
    const sn=noiseSrc(true),sf=c.createBiquadFilter();sf.type='bandpass';sf.frequency.value=2600;sf.Q.value=6;const sg=c.createGain();sg.gain.value=0;
    const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=11;lg.gain.value=380;lfo.connect(lg);lg.connect(sf.frequency);lfo.start();
    sn.connect(sf);sf.connect(sg);sg.connect(master);sn.start();N.skid={sg,sf};
    // crowd
    const cn=noiseSrc(true),cf=c.createBiquadFilter();cf.type='bandpass';cf.frequency.value=650;cf.Q.value=.45;const cg=c.createGain();cg.gain.value=0;cn.connect(cf);cf.connect(cg);cg.connect(master);cn.start();N.crowd={cg};
  }
  function unlock(){if(!c)build();if(c&&c.state!=='running')c.resume();}
  const tc=(p,v,k=.05)=>{if(p)p.setTargetAtTime(v,c.currentTime,k);};
  function tone(f,t0,dur,type,g,f2,dest){const o=c.createOscillator(),gn=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+dur);
    gn.gain.setValueAtTime(.0001,t0);gn.gain.exponentialRampToValueAtTime(g||.15,t0+.008);gn.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(gn);gn.connect(dest||master);o.start(t0);o.stop(t0+dur+.05);}
  function burst(t0,dur,o){o=o||{};const s=noiseSrc(false),fl=c.createBiquadFilter();fl.type=o.type||'bandpass';fl.frequency.setValueAtTime(o.f||1000,t0);if(o.f2)fl.frequency.exponentialRampToValueAtTime(o.f2,t0+dur);fl.Q.value=o.q||1;
    const gn=c.createGain();gn.gain.setValueAtTime(.0001,t0);gn.gain.exponentialRampToValueAtTime(o.g||.3,t0+Math.min(o.a||.02,dur/2));gn.gain.exponentialRampToValueAtTime(.0001,t0+dur);s.connect(fl);fl.connect(gn);gn.connect(o.dest||master);s.start(t0,Math.random()*.7);s.stop(t0+dur+.05);}
  const S=fn=>(...a)=>{if(ready())fn(c.currentTime,...a);};
  const api={
    unlock,
    get on(){return on;},
    setOn(v){on=v;localStorage.setItem('apex_snd',v?'1':'0');if(c){master.gain.setTargetAtTime(v?.85:0,c.currentTime,.03);if(v)unlock();}},
    click:S(t=>{tone(1250,t,.045,'triangle',.1,760);}),
    tab:S(t=>{tone(520,t,.07,'sine',.1,780);}),
    err:S(t=>{tone(190,t,.22,'square',.1,120);}),
    wrench:S(t=>{for(let i=0;i<5;i++)burst(t+i*.065,.05,{f:2100,q:2.5,g:.32});tone(330,t+.34,.09,'square',.05);tone(988,t+.42,.5,'sine',.14);tone(1480,t+.46,.6,'sine',.09);burst(t+.42,.5,{type:'highpass',f:6000,g:.04});}),
    cash:S(t=>{tone(1568,t,.5,'sine',.13);tone(2093,t+.07,.7,'sine',.11);for(let i=0;i<5;i++)tone(2600+i*260,t+.12+i*.045,.18,'triangle',.04);}),
    level:S(t=>{[523,659,784,1046].forEach((f,i)=>{tone(f,t+i*.1,.5,'triangle',.12);tone(f*2,t+i*.1,.4,'sine',.04);});}),
    beep:S((t,n)=>{tone(n===4?980:760,t,.2,'square',.09);}),
    go:S(t=>{tone(1560,t,.5,'triangle',.12);tone(780,t,.5,'triangle',.07);burst(t,.5,{f:300,f2:2400,q:.7,g:.25});api.cheer(.5);}),
    launch:S(t=>{const p=pan(0);tone(70,t,1.1,'triangle',.14,420,p);tone(140,t,1.1,'triangle',.09,840,p);tone(210,t,1.1,'sine',.05,1260,p);
      burst(t,1.2,{f:300,f2:3600,q:.7,g:.28,a:.5,dest:p});[392,523,659,784].forEach((f,i)=>tone(f,t+.55+i*.07,.9,'triangle',.07));burst(t+.55,.4,{type:'highpass',f:5000,g:.06});api.cheer(.6);}),
    revs(){if(!ready())return;revT=performance.now()+1500;},
    radio:S(t=>{burst(t,.07,{type:'highpass',f:2800,g:.1});tone(1900,t+.05,.04,'sine',.05);burst(t+.5,.05,{type:'highpass',f:3200,g:.06});}),
    gun:S(t=>{for(const o of[0,.75]){for(let i=0;i<4;i++)burst(t+o+i*.085,.06,{f:2800,q:3,g:.38});tone(110,t+o,.12,'square',.06);}burst(t+.4,.35,{f:700,f2:300,q:.7,g:.12});}),
    lap:S(t=>{tone(1400,t,.05,'triangle',.05);}),
    purple:S(t=>{tone(880,t,.12,'sine',.1);tone(1320,t+.11,.3,'sine',.1);}),
    boost:S(t=>{const p=pan(0);tone(160,t,.9,'triangle',.1,720,p);burst(t,.9,{f:400,f2:3200,q:.8,g:.1,dest:p});tone(1900,t+.1,.8,'sine',.03,3400);}),
    flyby(side,spd){if(!ready())return;const t=c.currentTime,p=pan(Math.max(-1,Math.min(1,side))),k=Math.min(1,Math.max(.25,spd/70));
      tone(560,t,1.1,'triangle',.09*k,300,p);tone(280,t,1.1,'sine',.07*k,150,p);burst(t,1.1,{f:500,f2:1700,q:.9,g:.1*k,a:.35,dest:p});},
    cheer(v){if(!ready())return;const g=N.crowd.cg.gain,t=c.currentTime;g.cancelScheduledValues(t);g.setTargetAtTime(.2*(v||1),t,.12);g.setTargetAtTime(.045,t+.9,.8);},
    finish:S((t,pos)=>{if(pos<=3){[523,659,784,1046,1318].forEach((f,i)=>{tone(f,t+i*.12,.7,'triangle',.12);});burst(t,2,{f:900,q:.4,g:.3,a:.4});}else{tone(392,t,.4,'triangle',.1);tone(330,t+.18,.6,'triangle',.1);burst(t,1.4,{f:700,q:.4,g:.14,a:.3});}}),
    raceStart(){if(!ready())return;N.crowd&&tc(N.crowd.cg.gain,.045,.6);},
    rain(w){if(!c||!N.rain)return;tc(N.rain.pg.gain,w*.05,.4);},
    raceEnd(){if(!c)return;N.rain&&tc(N.rain.pg.gain,0,.3);const e=N.eng;tc(e.eg.gain,0,.15);tc(e.rg.gain,0,.15);tc(N.wind.wg.gain,0,.15);tc(N.skid.sg.gain,0,.05);tc(N.crowd.cg.gain,0,.5);},
    // per-frame driving sound: mph, acceleration (m/s2), lateral load 0..1, braking flag, in pit, time-rate, running
    drive(mph,acc,lat,brk,inPit,rate,run){
      if(!ready())return;const e=N.eng,t=c.currentTime;
      const G=[0,45,75,105,135,165,195,225,999];let g=1;while(mph>=G[g])g++;
      let rpm;if(!run){rpm=performance.now()<revT?9500+Math.sin(performance.now()/55)*900:3600;}
      else if(g===1)rpm=4200+Math.min(1,mph/45)*7600;else rpm=7600+((mph-G[g-1])/(G[g]-G[g-1]))*4900;
      if(run&&g!==gear&&performance.now()>shiftT){shiftT=performance.now()+250;if(g>gear)burst(t,.06,{f:900,q:1,g:.22});else burst(t,.08,{f:500,q:1,g:.1});}
      gear=g;
      const want=!run?(performance.now()<revT?1:.18):brk?.12:acc>1.5?1:.55;thr+=(want-thr)*.18;
      const f=rpm/60*3,sc=rate>1?.35:1;
      e.HM.forEach((m,k)=>{tc(e.hs[k].frequency,f*m,.03);const br=k<2?1:(.3+.7*thr)*(1-k*.02);tc(e.hg[k].gain,e.HW[k]*br*.3,.05);});
      tc(e.sw.frequency,f,.03);tc(e.sf2.frequency,f*(2.5+thr*2),.05);
      tc(e.lp.frequency,1400+rpm*.25+thr*1400,.06);
      tc(e.eg.gain,(.07+.17*thr)*sc*(inPit?.7:1),.05);
      tc(e.rg.gain,(.004+.016*thr)*sc,.06);tc(e.rb.frequency,1400+rpm*.08,.08);
      const w=(mph/230);tc(N.wind.wg.gain,w*w*.11*sc,.1);tc(N.wind.wf.frequency,250+mph*5,.1);
      const sq=run&&!inPit?Math.max(brk&&mph>90?Math.min(1,(mph-90)/90)*.55:0,lat>.9?Math.min(1,(lat-.9)*9):0):0;
      tc(N.skid.sg.gain,sq*.16*sc,.04);tc(N.skid.sf.frequency,2200+mph*5,.1);
      if(thr<.2&&!brk&&run)tc(e.eg.gain,.05*sc,.08);
    },
    live(v){if(v&&!wasLive)api.boost();wasLive=v;}
  };
  const first=()=>{unlock();};
  ['pointerdown','touchend','click','keydown'].forEach(ev=>document.addEventListener(ev,first,{passive:true}));
  document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('button,.mk,.part,[data-act]'))api.click();},true);
  return api;
})();
