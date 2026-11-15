// ==SIM-START==
const LAPS=10, TD=1, PIT_LIMIT=30, DIRTY=.30, PEN_SIM=8;
const PARTS=['engine','aero','tires','brakes','gearbox','chassis'];
const PW={engine:.22,aero:.22,tires:.14,brakes:.12,gearbox:.12,chassis:.18};
let TMULT={engine:1,aero:1,tires:1,brakes:1,gearbox:1,chassis:1};
const COMP={S:{name:'Soft',grip:-.014,wear:16,id:0},M:{name:'Medium',grip:0,wear:11,id:0},H:{name:'Hard',grip:.009,wear:7.8,id:0},I:{name:'Inter',grip:.004,wear:9,id:.5},W:{name:'Wet',grip:.010,wear:7,id:1}};
let WX=[],WL=1;
const wetAt=l=>WX[clamp(l,1,LAPS)]||0;
const ruleMet=c=>c.used.size>=2||c.wetUsed;
const idealComp=w=>w<.2?null:w<.62?'I':'W';
const HPPART={engine:.07,gearbox:.05,brakes:.035,tires:.03,aero:.04,chassis:.045};
function makeWx(seed,theme){const ch=({desert:.06,coast:.42,forest:.5,city:.36,dusk:.5,park:.4,speedway:.28})[theme]||.3,w=Array(LAPS+1).fill(0);
  if(hr(seed,0,0,95)>=ch)return w;
  const a=1+Math.floor(hr(seed,0,0,96)*6),len=2+Math.floor(hr(seed,0,0,97)*5),pk=.6+hr(seed,0,0,98)*.4;
  for(let l=1;l<=LAPS;l++){const x=l-a;if(x>=0&&x<len)w[l]=pk*Math.pow(Math.sin(Math.PI*(x+.5)/len),.7);else if(x>=len&&x<len+2)w[l]=pk*(x===len?.3:.12);}
  return w;}
const MODE={push:{t:-.008,w:1.5,f:1.28},normal:{t:0,w:1,f:1},save:{t:.010,w:.62,f:.74}};
const FUEL_BURN=8.5,FUEL_W=.00022,PITW={aggressive:56,cautious:50,saver:66,sloppy:60,balanced:58};
function fuelRate(car,mode){const eff=1-.012*(car.lv.engine-3)-.008*(car.lv.gearbox-3);return FUEL_BURN*MODE[mode].f*Math.max(.8,eff)*(TR.fuel||1)*(car.fuelMul||1);}
let TR=null, SEED=1;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function hr(...a){let h=0x9e3779b9;for(const x of a){h^=Math.imul((x|0)+0x7f4a7c15,0x85ebca6b);h=Math.imul(h^(h>>>15),0xc2b2ae35);h^=h>>>13;}return ((h>>>0)%100000)/100000;}
function carCP(lv){let s=0,w=0;for(const k of PARTS){const m=PW[k]*TMULT[k];s+=m*lv[k];w+=m;}return s/w;}
function wearRate(car,mode,comp){const c=COMP[comp||car.tire.comp];const wm=car.wearMul||1;const care=1.3-car.drv.care/100*.6;const part=Math.max(.7,1-.025*(car.lv.tires-3));const ch=Math.max(.8,1-.012*(car.lv.chassis-3));const mm=Math.abs(wetAt(WL)-c.id);return c.wear*MODE[mode].w*care*part*ch*wm*(TR.wear||1)*(1+mm*mm*3);}
function tirePen(w){return .012*(w/100)+(w>55?Math.pow((w-55)/45,2)*.085:0);}
function baseFactor(car,lap,mode,wg,fu){
  let f=1-(carCP(car.lv)-6)*.005;
  f-=(car.drv.pace-60)*.00018;f-=car.engB||0;
  f+=COMP[car.tire.comp].grip+tirePen(car.tire.wear+wg/2)+MODE[mode].t+(fu||0)*FUEL_W;
  const wt=wetAt(WL),mm=Math.abs(wt-COMP[car.tire.comp].id);
  f+=wt*.05+mm*mm*.16*(1-(car.wetB||0))-wt*(car.drv.wet-55)*.00022+(car.dmg?car.dmg.pen:0);
  f+=(LAPS-lap)/LAPS*.01;
  const cons=car.drv.cons;
  f+=((hr(SEED,car.id,lap,1)+hr(SEED,car.id,lap,2))-1)*(.0012+(100-cons)*.00007);
  if(hr(SEED,car.id,lap,3)<(100-cons)/100*.045+wt*.03) f+=.035+hr(SEED,car.id,lap,4)*.03;
  return f;
}
function invCum(cum,tau){const n=cum.length-1;if(tau<=0)return 0;if(tau>=cum[n])return n;let lo=0,hi=n;while(hi-lo>1){const m=(lo+hi)>>1;if(cum[m]<=tau)lo=m;else hi=m;}return lo+(tau-cum[lo])/(cum[hi]-cum[lo]);}
function segNode(seg,t){
  if(t<=0)return seg.j0;
  if(seg.kind==='norm')return invCum(TR.cumT,t/seg.factor);
  let tt=t;if(seg.hold){if(tt>seg.arrT+seg.hold)tt-=seg.hold;else if(tt>seg.arrT)tt=seg.arrT;}
  return seg.jStart+invCum(seg.cum,tt);
}
function rdAt(c,t){if(c.finished)return c.finalRd;return c.lapsDone*TR.N+segNode(c.seg,clamp(t-c.seg.t0,0,c.seg.dur));}
function passes(v,jb){const N=TR.N,dl=TR.dl;for(let j=1;j<v.length;j++)v[j]=Math.min(v[j],Math.sqrt(v[j-1]*v[j-1]+2*TR.ACC*dl));for(let j=v.length-2;j>=0;j--)v[j]=Math.min(v[j],Math.sqrt(v[j+1]*v[j+1]+2*TR.BRK*dl));}
function cumOf(v){const dl=TR.dl,c=new Float64Array(v.length);for(let j=0;j<v.length-1;j++)c[j+1]=c[j]+2*dl/(v[j]+v[j+1]);return c;}
function buildPit(f,boxD,hold){
  const N=TR.N,dl=TR.dl,v=new Float64Array(N+1);
  for(let j=0;j<=N;j++)v[j]=TR.V[j%N]/f;
  const jb=Math.round(boxD/dl),j1=Math.floor(45/dl),j2=Math.ceil(155/dl);
  for(let j=j1;j<=j2;j++)v[j]=Math.min(v[j],PIT_LIMIT);
  v[jb]=0;passes(v);
  const cum=cumOf(v);
  return {kind:'pit',jStart:0,j0:0,cum,hold,arrT:cum[jb],dur:cum[N]+hold};
}
function buildStart(f,slotM){
  const N=TR.N,dl=TR.dl,jS=-Math.ceil(slotM/dl),M=N-jS,v=new Float64Array(M+1);
  for(let k=0;k<=M;k++){const j=jS+k;v[k]=TR.V[((j%N)+N)%N]/f;}
  v[0]=0;passes(v);
  const cum=cumOf(v);
  return {kind:'start',jStart:jS,j0:jS,cum,hold:0,arrT:0,dur:cum[M]};
}
function wearOf(car,comp,mode){return wearRate(car,mode||'normal',comp);}
function aiComp(car,laps){
  const need2=!ruleMet(car),cand=['S','M','H'].filter(c=>!need2||!car.used.has(c)),lim=({aggressive:90,cautious:70,saver:78,sloppy:84,balanced:80})[car.team.pers]||80;
  for(const c of cand)if(wearOf(car,c)*laps*.92<=lim)return c;
  return cand[cand.length-1];
}
function aiPit(car,lap,gap){
  const rem=LAPS-lap+1,w=car.tire.wear,r=wearOf(car,car.tire.comp),fr=fuelRate(car,'normal'),need2=!ruleMet(car),pw=(PITW[car.team.pers]||58)+(hr(SEED,car.id,0,70)-.5)*10,dryIn=car.fuel/fr;
  {const wn=(wetAt(lap)+wetAt(lap+1))/2,idc=idealComp(wn),cm=COMP[car.tire.comp].id,mis=Math.abs(wn-cm),
    react=.28+hr(SEED,car.id,0,71)*.4+(car.team.pers==='sloppy'?.1:0)-(car.team.pers==='cautious'?.06:0),recent=lap-(car.lastPit||0)<=2;
   if(mis>react&&lap>=2&&!(rem<=2&&mis<.6)&&!(recent&&mis<.65)){const want=idc||aiComp(car,rem-1);if(want!==car.tire.comp)return want;}}
  if(w+r>=92)return aiComp(car,rem-1);                                  // tires about to fall off a cliff
  if(wetAt(lap)>.2)return null;
  if(lap<3)return null;                                                  // nobody stops early without a reason
  let go=false;
  if(w>=pw&&rem>=3&&w+r*rem*.92>82)go=true;                              // past the window and could not finish cleanly
  else if(need2&&lap>=4&&w>=pw*.72&&rem>=3)go=true;                      // rule stop, once tires have some wear
  else if(need2&&rem<=3)go=true;                                         // last chance for the two-tire rule
  else if(dryIn<rem&&(dryIn<1.7||w>=40))go=true;                         // fuel will not last
  else if(car.team.pers==='aggressive'&&gap<.5&&need2&&w>=40&&rem>=4)go=true; // undercut the car ahead
  return go?aiComp(car,rem-1):null;
}
function pickPit(car,lap,gap){
  if(lap<2||lap>=LAPS)return null;
  if(car.arm)return car.armComp;
  if(car.isPlayer){const pl=car.plan;if(car.stops<pl.length&&lap>=pl[car.stops].lap)return pl[car.stops].comp;return null;}
  return aiPit(car,lap,gap);
}
function aiMode(car,lap,gap){
  const p=car.team.pers,w=car.tire.wear,left=LAPS-lap+1,r=hr(SEED,car.id,lap,7),fr=fuelRate(car,'normal');
  if(car.fuel<fr*left*.9&&car.stops>=1)return 'save';
  if(car.fuel<fr*left*1.03&&car.stops>=1&&p!=='aggressive')return 'normal';
  if(p==='aggressive')return ((w<68&&r<.7)||(gap<.5&&w<80))?'push':'normal';
  if(p==='cautious')return (w>55||r<.25)?'save':'normal';
  if(p==='saver')return left<=2?'push':(w>40?'save':'normal');
  if(p==='sloppy')return r<.5?'push':'normal';
  return left<=2?'push':'normal';
}
function failP(car){
  if(!car.isPlayer)return .004;
  let p=0;for(const k of PARTS){const h=(car.hp&&car.hp[k]!=null)?car.hp[k]:100;if(h<60)p+=Math.pow((60-h)/60,1.5)*.05;}return p*(car.relMul||1);}
function rollDmg(R,car,lap){
  if(car.dmg||car.finished||lap<1)return;
  if(hr(SEED,car.id,lap,20)>=failP(car))return;
  let part;
  if(car.isPlayer){const ws=PARTS.map(k=>{const h=(car.hp&&car.hp[k]!=null)?car.hp[k]:100;return h<60?Math.pow((60-h)/60,1.5):0;}),tot=ws.reduce((a,b)=>a+b,0);let r=hr(SEED,car.id,lap,21)*tot,i=0;while(i<5&&r>ws[i]){r-=ws[i];i++;}part=PARTS[i];}
  else part=PARTS[Math.floor(hr(SEED,car.id,lap,21)*6)];
  car.dmg={part,pen:HPPART[part]*(.8+hr(SEED,car.id,lap,22)*.5)*(car.dmgMul||1),lap};
  if(part==='tires')car.tire.wear=Math.min(100,car.tire.wear+35);
}
function startLap(R,car,tb){
  const N=TR.N;
  if(car.finished){const f=1.4;car.seg={kind:'norm',t0:tb,factor:f,dur:TR.P0*f,j0:0,wg:0};return;}
  const lap=car.lapsDone+1;WL=lap;rollDmg(R,car,lap);
  if(lap===1){
    const mode=car.mode,wg=wearRate(car,mode)*(.92+.16*hr(SEED,car.id,1,5)),fg=fuelRate(car,mode)*(.97+.06*hr(SEED,car.id,1,8));
    const f=baseFactor(car,1,mode,wg,car.fuel-fg/2)+(car.fuel<fg?.05*(1-car.fuel/fg):0)-(car.launchB||0),s=buildStart(f,8+7.5*car.slot);
    Object.assign(s,{t0:tb,factor:f,mode,wg,fg,add:0,first:true});car.seg=s;car.lf=f;return;
  }
  const rdMe=car.lapsDone*N;let ahead=null,best=1e9;
  for(const o of R.cars){if(o===car)continue;const d=rdAt(o,tb)-rdMe;if(d>=-.5&&d<best){best=d;ahead=o;}}
  const gap=ahead?Math.max(0,best)*(TR.P0/N)*car.lf:99;
  const mode=car.isPlayer?car.mode:aiMode(car,lap,gap);car.mode=mode;
  const wg=wearRate(car,mode)*(.92+.16*hr(SEED,car.id,lap,5));
  const pitComp=pickPit(car,lap,gap);if(car.arm&&pitComp)car.arm=false;
  const fg=fuelRate(car,mode)*(.97+.06*hr(SEED,car.id,lap,8));
  const add=pitComp?clamp(100-car.fuel,0,100):0,fav=car.fuel+add;
  let f=baseFactor(car,lap,mode,wg*(pitComp?.5:1),fav-fg/2)+(fav<fg?.05*(1-fav/fg):0);
  let boost=false;
  if(!pitComp){
    if(car.isPlayer){if(car.boostReq&&car.ers>=34)boost=true;}
    else{const p=car.team.pers,r=hr(SEED,car.id,lap,11);boost=car.ers>=34&&((gap<.6&&r<(p==='aggressive'?.85:p==='cautious'?.3:.55))||(LAPS-lap<1&&r<.9));}
  }
  car.boostReq=false;
  if(boost){car.ers-=34;f-=.0075;}else car.ers=Math.min(100,car.ers+(mode==='save'?22:mode==='normal'?12:6)+(car.ersB||0));
  if(!pitComp&&ahead&&!ahead.finished&&gap<DIRTY){
    const adv=ahead.lf-f;
    const pp=clamp((.22+6*adv+(car.drv.ovr-55)/180+(car.lv.brakes-5)*.025-.18)*(TR.ovk||1),.03,.92);
    if(hr(SEED,car.id,lap,6)>=pp)f=Math.max(f,ahead.lf+.0015);
  }
  let s;
  if(pitComp){
    const crew=car.team.crew,hold=Math.max(1,1.5-(car.pitB||0)+(1-crew)*.9)+(hr(SEED,car.id,lap,9)<(1-crew)*.15?2.2:0)+add*.012;
    s=buildPit(f,50+11*car.team.idx,hold);s.pit={comp:pitComp};s.wg=wg*.5;
  }else s={kind:'norm',j0:0,dur:TR.P0*f,wg};
  s.t0=tb;s.factor=f;s.mode=mode;s.boost=boost;s.fg=fg;s.add=add;car.seg=s;car.lf=f;
}
function completeLap(R,car){
  const s=car.seg,tb=s.t0+s.dur;
  if(car.finished){startLap(R,car,tb);return;}
  car.lapTimes.push(s.dur);car.lapsDone++;car.totalT=tb;
  let fl=false;
  car.fuel=Math.max(0,car.fuel+(s.add||0)-(s.fg||0)*(s.pit?.55:1));
  if(s.pit){car.tire={comp:s.pit.comp,wear:0};car.used.add(s.pit.comp);car.stops++;car.lastPit=car.lapsDone;if(COMP[s.pit.comp].id>0)car.wetUsed=true;}
  else car.tire.wear=Math.min(100,car.tire.wear+s.wg);
  if(!s.first&&!s.pit&&s.dur<car.best){car.best=s.dur;if(s.dur<R.fl.t){R.fl={t:s.dur,car};fl=true;}}
  let fin=false;
  if(car.lapsDone>=LAPS||R.winnerDone){fin=true;car.finished=true;car.finishT=tb;car.finalRd=car.lapsDone*TR.N;car.pen=ruleMet(car)?0:PEN_SIM;R.winnerDone=true;}
  startLap(R,car,tb);
  if(car.dmg&&!car.dmgSent){car.dmgSent=1;if(R.hook)R.hook('fail',car,tb,car.dmg);}
  if(R.hook){R.hook('lap',car,tb,s);if(s.pit)R.hook('pit',car,tb,s);if(fl)R.hook('fl',car,tb,s);if(fin)R.hook('finish',car,tb,s);}
}
function stepRace(R,t){
  for(;;){let bi=-1,be=Infinity;
    for(let i=0;i<R.cars.length;i++){const c=R.cars[i],e=c.seg.t0+c.seg.dur;if(e<=t&&e<be){be=e;bi=i;}}
    if(bi<0)break;completeLap(R,R.cars[bi]);}
  R.t=t;
}
function orderAt(R,t){
  const a=R.cars.map(c=>({c,rd:rdAt(c,t),ft:c.finished?c.finishT+c.pen:1e9}));
  a.sort((x,y)=>(y.rd-x.rd)||(x.ft-y.ft)||(x.c.id-y.c.id));return a;
}
function finalOrder(R){return [...R.cars].sort((a,b)=>(b.lapsDone-a.lapsDone)||((a.finishT+a.pen)-(b.finishT+b.pen))||(a.id-b.id));}
function aiLevels(t){const lv={};PARTS.forEach((k,i)=>lv[k]=clamp(Math.round(t.avg+(t.tierAi||0)+(t.boost||0)+(hr(1000,t.id,i,0)-.5)*3),1,12));return lv;}
function newRace(seed,teams,lv,cfg){
  SEED=seed;WX=cfg.wx||Array(LAPS+1).fill(0);WL=1;
  const cars=teams.map(t=>{
    const isP=t.id===0,w1=wetAt(1),start=isP?cfg.start:(idealComp(w1)||t.start);
    const plan=isP?cfg.stops.map(s=>({lap:s.lap,comp:s.comp})).sort((a,b)=>a.lap-b.lap):[];
    const fuel0=isP?clamp(cfg.fuel||100,40,100):clamp(({aggressive:84,cautious:100,saver:100,sloppy:90,balanced:94})[t.pers]+(hr(seed,t.id,0,61)-.5)*6,60,100);
    return {id:t.id,team:t,isPlayer:isP,lv:isP?{...lv}:aiLevels(t),drv:isP?cfg.drv:t.drv,engB:isP?(cfg.engB||0):0,wearMul:isP?(cfg.wearMul||1):1,ers:60,fuel:fuel0,boostReq:false,
      tire:{comp:start,wear:0},used:new Set([start]),wetUsed:COMP[start].id>0,hp:isP?cfg.hp:null,relMul:isP?(cfg.relMul||1):1,dmgMul:isP?(cfg.dmgMul||1):1,fuelMul:isP?(cfg.fuelMul||1):1,wetB:isP?(cfg.wetB||0):0,ersB:isP?(cfg.ersB||0):0,pitB:isP?(cfg.pitB||0):0,launchB:isP?(cfg.launchB||0):0,dmg:null,mode:isP?cfg.mode:'normal',plan,stops:0,lapsDone:0,
      lapTimes:[],best:Infinity,lf:1,finished:false,finishT:0,finalRd:0,pen:0,arm:false,armComp:'M',seg:null,slot:0,totalT:0,lat:0};
  });
  const score=c=>carCP(c.lv)+c.drv.pace/12+(hr(seed,c.id,0,50)-.5)*2.4;
  if(cfg.grid)cfg.grid.forEach((id,i)=>{const c=cars.find(x=>x.id===id);if(c)c.slot=i;});else [...cars].sort((a,b)=>score(b)-score(a)).forEach((c,i)=>c.slot=i);
  const R={cars,t:0,winnerDone:false,hook:null,fl:{t:1e9,car:null}};
  cars.forEach(c=>startLap(R,c,0));return R;
}
function qualify(seed,teams,lv,cfg){
  const sv=SEED,svw=WX;SEED=seed+777;WX=cfg.wx||Array(LAPS+1).fill(0);WL=1;
  const w=wetAt(1),cp=idealComp(w)||'S';
  const res=teams.map(t=>{const isP=t.id===0,car={id:t.id,lv:isP?lv:aiLevels(t),drv:isP?cfg.drv:t.drv,engB:isP?(cfg.engB||0):0,wetB:isP?(cfg.wetB||0):0,tire:{comp:cp,wear:0},dmg:null};
    const f=baseFactor(car,LAPS,'push',0,24)-(isP?(cfg.qualB||0):0);return{id:t.id,t:TR.P0*f};});
  SEED=sv;WX=svw;return res.sort((a,b)=>a.t-b.t);
}
function setTrack(t){TR=t;TMULT=Object.assign({engine:1,aero:1,tires:1,brakes:1,gearbox:1,chassis:1},t.tm||{});}
// ==SIM-END==
