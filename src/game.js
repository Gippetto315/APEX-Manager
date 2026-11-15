// ================= GAME DATA =================
const PIT_FAST=HW+5,PIT_WORK=HW+7.6;
const TEAMS=[
 {id:0,idx:0,name:'',tag:'APX',pers:'player',c1:0x0e2452,c2:0xff5a1f,num:'07',crew:.5},
 {id:1,idx:1,name:'Vortex Racing',tag:'VOR',pers:'aggressive',c1:0xd62828,c2:0x15161a,num:'11',avg:7.4,crew:.7,start:'S',plan:[[4,'M']],drv0:{name:'Marco Valenti',pace:84,cons:70,care:55,ovr:82,wet:70}},
 {id:2,idx:2,name:'Silverline Motorsport',tag:'SIL',pers:'cautious',c1:0xc3c9d2,c2:0x00a6a6,num:'03',avg:7.0,crew:.8,start:'M',plan:[[5,'H']],drv0:{name:'Ingrid Haugen',pace:80,cons:85,care:70,ovr:60,wet:72}},
 {id:3,idx:3,name:'Kestrel GP',tag:'KES',pers:'saver',c1:0xf5c518,c2:0x15161a,num:'21',avg:6.0,crew:.6,start:'H',plan:[[6,'S']],drv0:{name:'Dev Malhotra',pace:74,cons:76,care:88,ovr:58,wet:60}},
 {id:4,idx:4,name:'Halcyon Motors',tag:'HAL',pers:'sloppy',c1:0xf2f2f2,c2:0xc9a227,num:'88',avg:8.0,crew:.35,start:'S',plan:[[4,'M']],drv0:{name:'Julian Ashford',pace:78,cons:45,care:50,ovr:70,wet:55}},
 {id:5,idx:5,name:'Ironclad Racing',tag:'IRN',pers:'balanced',c1:0x1f6f43,c2:0xb8bcc4,num:'33',avg:5.6,crew:.6,start:'M',plan:[[5,'S']],drv0:{name:'Tomas Reiter',pace:70,cons:72,care:60,ovr:66,wet:62}},
 {id:6,idx:6,name:'Nova Dynamics',tag:'NOV',pers:'aggressive',c1:0xd81b8c,c2:0xffffff,num:'14',avg:5.0,crew:.55,start:'S',plan:[[4,'H']],drv0:{name:'Kenji Arai',pace:76,cons:52,care:55,ovr:80,wet:68}},
 {id:7,idx:7,name:'Tidal Works',tag:'TID',pers:'cautious',c1:0x14b8d4,c2:0x0b2a4a,num:'05',avg:4.6,crew:.65,start:'M',plan:[[5,'H']],drv0:{name:'Lucia Ferrer',pace:68,cons:80,care:74,ovr:55,wet:70}},
 {id:8,idx:8,name:'Obsidian Autosport',tag:'OBS',pers:'saver',c1:0x1a1b20,c2:0xffffff,num:'99',avg:4.2,crew:.5,start:'H',plan:[[6,'M']],drv0:{name:'Pavel Novak',pace:64,cons:70,care:82,ovr:50,wet:52}},
 {id:9,idx:9,name:'Zephyr Racing',tag:'ZEP',pers:'sloppy',c1:0x6a40d6,c2:0xb6e22e,num:'27',avg:6.4,crew:.3,start:'S',plan:[[4,'M']],drv0:{name:'Noah Brandt',pace:62,cons:40,care:45,ovr:60,wet:50}},
];
const PERS={aggressive:'Aggressive',cautious:'Cautious',saver:'Tire whisperers',sloppy:'Rich and sloppy',balanced:'Balanced'};
const TIERS=[{n:'Club Series',s:'CLUB',ai:-2.6,dp:-14,mult:1},{n:'Regional Championship',s:'REGIONAL',ai:-1.2,dp:-8,mult:1.6},{n:'National Championship',s:'NATIONAL',ai:.3,dp:-3,mult:2.4},{n:'World Series',s:'WORLD',ai:1.8,dp:2,mult:3.6}];
const TRAIT={road:{tm:{engine:1,aero:1.15,tires:1,brakes:1,gearbox:1,chassis:1.1},wear:1,ovk:1},street:{tm:{engine:.8,aero:1,tires:1,brakes:1.35,gearbox:1.1,chassis:1.25},wear:.85,ovk:.55},oval:{tm:{engine:1.45,aero:1.25,tires:1,brakes:.5,gearbox:.8,chassis:.9},wear:1.2,ovk:1.45},short:{tm:{engine:.9,aero:.9,tires:1.25,brakes:1,gearbox:1,chassis:1.2},wear:1.35,ovk:1.1}};
function stadium(Ls,R,bow=0,nA=10){const p=[];for(let i=0;i<4;i++)p.push([Ls*i/4,-(bow?bow*Math.sin(Math.PI*i/4):0)]);for(let i=0;i<=nA;i++){const a=-Math.PI/2+Math.PI*i/nA;p.push([Ls+R*Math.cos(a),R+R*Math.sin(a)]);}for(let i=1;i<4;i++)p.push([Ls-Ls*i/4,2*R]);for(let i=0;i<=nA;i++){const a=Math.PI/2+Math.PI*i/nA;p.push([R*Math.cos(a),R+R*Math.sin(a)]);}p.pop();return p;}
function rrect(W,H,R,nA=6){const p=[];for(let i=0;i<4;i++)p.push([R+(W-2*R)*i/4,0]);const arc=(cx,cz,a0)=>{for(let i=0;i<=nA;i++)p.push([cx+R*Math.cos(a0+Math.PI/2*i/nA),cz+R*Math.sin(a0+Math.PI/2*i/nA)]);};
  arc(W-R,R,-Math.PI/2);p.push([W,H/2]);arc(W-R,H-R,0);for(let i=1;i<4;i++)p.push([W-R-(W-2*R)*i/4,H]);arc(R,H-R,Math.PI/2);p.push([0,H/2]);arc(R,R,Math.PI);p.pop();return p;}
const sc=(a,s)=>a.map(([x,z])=>[x*s,z*s]);
const TRACKS=[
 {id:'meridian',name:'Meridian Park',short:'MERIDIAN',loc:'Columbus, Ohio',kind:'ROAD COURSE',theme:'park',seed:11,tr:TRAIT.road,pts:sc([[0,0],[120,0],[170,20],[185,70],[160,110],[110,115],[80,90],[40,100],[0,140],[-50,130],[-70,80],[-60,30]],1.5),desc:'Rolling parkland. A little of everything.'},
 {id:'peachtree',name:'Peachtree Speedway',short:'PEACHTREE',loc:'Atlanta, Georgia',kind:'SHORT OVAL',theme:'speedway',seed:23,oval:1,bank:.3,tr:TRAIT.short,pts:stadium(240,95),stands:[[120,190,12]],desc:'Tight, steep and brutal on tires.'},
 {id:'sonoran',name:'Sonoran Desert Circuit',short:'SONORAN',loc:'Phoenix, Arizona',kind:'ROAD COURSE',theme:'desert',seed:37,tr:TRAIT.road,pts:sc([[0,0],[200,0],[250,20],[262,70],[230,105],[180,100],[140,125],[135,175],[100,205],[30,195],[0,150],[-50,140],[-80,100],[-65,40]],1.3),desc:'Heat, dust and a long back straight.'},
 {id:'liberty',name:'Liberty Harbor Street Circuit',short:'LIBERTY',loc:'Liberty Harbor, New Jersey',kind:'STREET CIRCUIT',theme:'city',seed:41,tr:TRAIT.street,pts:[[0,0],[240,0],[255,15],[255,120],[240,135],[150,135],[135,150],[135,230],[120,245],[20,245],[5,230],[5,120],[-10,105],[-60,105],[-75,90],[-75,15],[-60,0]],desc:'Concrete walls and nowhere to pass.'},
 {id:'greatlakes',name:'Great Lakes Speedway',short:'GREAT LAKES',loc:'Brooklyn, Michigan',kind:'SUPERSPEEDWAY',theme:'speedway',seed:53,oval:1,bank:.26,tr:TRAIT.oval,pts:stadium(560,210,30),stands:[[150,280,16]],desc:'Flat out. Engine and drafting win here.'},
 {id:'twinpines',name:'Twin Pines Raceway',short:'TWIN PINES',loc:'Bend, Oregon',kind:'ROAD COURSE',theme:'forest',seed:67,tr:TRAIT.road,pts:sc([[0,0],[180,0],[240,-20],[290,10],[300,70],[260,110],[270,160],[230,200],[160,190],[120,150],[60,170],[0,200],[-60,170],[-70,110],[-30,70],[-60,30]],1.4),desc:'Fast, flowing and lined with pines.'},
 {id:'lonestar',name:'Lone Star Motor Speedway',short:'LONE STAR',loc:'Fort Worth, Texas',kind:'TRI-OVAL',theme:'speedway',seed:71,oval:1,bank:.24,tr:TRAIT.oval,pts:stadium(520,190,70),stands:[[150,240,16]],temp:93,desc:'Everything is bigger, including the speed.'},
 {id:'pacific',name:'Pacific Coast Raceway',short:'PACIFIC',loc:'Monterey Bay, California',kind:'ROAD COURSE',theme:'coast',seed:83,tr:TRAIT.road,pts:sc([[0,0],[230,0],[280,25],[285,80],[250,120],[260,170],[300,200],[290,250],[230,265],[170,230],[120,240],[60,250],[0,220],[-30,160],[10,110],[-20,60],[-40,20]],1.3),desc:'Ocean views and a technical middle sector.'},
 {id:'heartland',name:'Heartland Motor Speedway',short:'HEARTLAND',loc:'Speedway, Indiana',kind:'OVAL',theme:'speedway',seed:97,oval:1,bank:.16,tr:TRAIT.oval,pts:rrect(820,380,130),stands:[[220,440,18]],desc:'Four corners, long straights, pure history.'},
 {id:'bayou',name:'Bayou City Street Circuit',short:'BAYOU',loc:'New Orleans, Louisiana',kind:'STREET CIRCUIT',theme:'dusk',seed:101,tr:TRAIT.street,pts:sc([[0,0],[210,0],[225,15],[225,70],[240,85],[300,85],[315,100],[315,170],[300,185],[180,185],[165,170],[165,130],[150,115],[60,115],[45,130],[45,200],[30,215],[-40,215],[-55,200],[-55,15],[-40,0]],1.2),desc:'The season finale. Under the sunset.'},
];
const TBYID=Object.fromEntries(TRACKS.map(t=>[t.id,t]));
const CAL=TRACKS.map(t=>t.id);
const SPONS=[
 {id:'redline',name:'Redline Energy',ab:'RE',c:'#e63946',style:'aggro',base:140,tag:'Loves an overtake'},
 {id:'bigsky',name:'Big Sky Mutual',ab:'BS',c:'#3f8cff',style:'consistent',base:180,tag:'Rewards steady drives'},
 {id:'ironhorse',name:'Ironhorse Trucks',ab:'IH',c:'#8e9aaf',style:'results',base:160,tag:'Pays for results'},
 {id:'copperleaf',name:'Copperleaf Bank',ab:'CB',c:'#c98a3b',style:'results',base:220,tag:'Big money, big targets'},
 {id:'sunbelt',name:'Sunbelt Freight',ab:'SF',c:'#ffb020',style:'consistent',base:150,tag:'Likes efficient strategy'},
 {id:'bluebonnet',name:'Bluebonnet Burgers',ab:'BB',c:'#5a6bff',style:'aggro',base:120,tag:'Wants a show'},
 {id:'northstar',name:'Northstar Wireless',ab:'NW',c:'#2ec4b6',style:'speed',base:170,tag:'Obsessed with lap times'},
 {id:'mesasolar',name:'Mesa Solar',ab:'MS',c:'#ff7a00',style:'speed',base:200,tag:'Wants raw pace'},
];
const SBYID=Object.fromEntries(SPONS.map(s=>[s.id,s]));
const FN=['Cole','Jace','Riley','Mason','Tyler','Avery','Logan','Carter','Brooke','Dalton','Reese','Hunter','Skyler','Wyatt','Jordan','Peyton','Sawyer','Quinn','Emerson','Blake','Luis','Mateo','Sofia','Elena','Hiro','Anika','Theo','Jonah','Kai','Nadia','Bryce','Harper'];
const LN=['Whitaker','Delgado','Brennan','Calloway','Vance','Hollis','Pruitt','Garza','McCready','Lindqvist','Okafor','Sato','Barrett','Rourke','Castellanos','Kincaid','Fairbanks','Holt','Danner','Ridley','Moreau','Strand','Ashby','Corbin','Talley','Keane','Mercer','Huxley','Ortega','Pemberton'];
const ICON={
 engine:'<rect x="4" y="8" width="13" height="10" rx="1.5"/><path d="M17 11h3v4h-3M8 8V5h5v3M1.5 13h2.5"/>',aero:'<path d="M2 16h20M4 16l2-6h12l2 6M8 10V6.5M16 10V6.5"/>',
 tires:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',brakes:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2"/><path d="M15.5 3.8a8.5 8.5 0 0 1 4.7 4.7l-3 1.2a5 5 0 0 0-2.9-2.9z"/>',
 gearbox:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3.5M12 18.5V22M2 12h3.5M18.5 12H22M4.9 4.9l2.5 2.5M16.6 16.6l2.5 2.5M4.9 19.1l2.5-2.5M16.6 7.4l2.5-2.5"/>',chassis:'<path d="M3 17l3-9h12l3 9zM8 8v9M16 8v9M3.8 12.5h16.4"/>',
 eng:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M19.5 19a4 4 0 0 1-4 3H13"/>',crew:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6a1.4 1.4 0 0 0 2 2l6-6a4 4 0 0 0 5-5.4l-2.5 2.5-2-.5-.5-2z"/>',
 strat:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/>',com:'<circle cx="12" cy="12" r="9"/><path d="M15 9c0-1.2-1.3-2-3-2s-3 .8-3 2 1.3 1.8 3 2 3 .9 3 2.1-1.3 2-3 2-3-.8-3-2M12 5.5v13"/>'};
const svg=k=>`<svg viewBox="0 0 24 24">${ICON[k]}</svg>`;
const PARTINFO={engine:['Power Unit','Top speed and acceleration. King on ovals.'],aero:['Aerodynamics','Downforce for corners, low drag for straights.'],tires:['Tire Program','Grip and tire life. Short ovals eat tires.'],brakes:['Brakes','Late braking. Street circuits live on it.'],gearbox:['Gearbox','Punch out of slow corners.'],chassis:['Chassis','Balance, handling and tire care.']};
const STAFF={eng:['Race Engineer','Squeezes lap time out of the setup.',l=>`−${((l-1)*.08).toFixed(2)}% lap time`],crew:['Pit Crew','Faster stops, fewer fumbles.',l=>`${(1.5+(1-(.35+(l-1)*.065))*.9).toFixed(2)}s avg stop`],strat:['Strategist','Smarter stints. Tires last longer.',l=>`−${((l-1)*2.5).toFixed(1)}% tire wear`],com:['Commercial Director','Sells everything with a logo on it.',l=>`+${(l-1)*6}% prize money`]};
const PTS=[25,18,15,12,10,8,6,4,2,1],PRIZE=[1200,900,700,560,460,380,310,250,200,160],PPRT=[8,7,6,5,4,4,3,3,2,2],SPRIZE=[6000,4800,3900,3200,2600,2100,1700,1400,1100,900];
const QUOTES=['Champagne in the motorhome. You are now insufferable.','The press has learned to pronounce your name.','A podium. Your accountants are smiling at you.','Points. The board stopped asking about the yacht.','Points. Small ones, but they count.','Points. The mechanics high-fived. Quietly.','Close. Your rivals noticed you this time.','A lesson, billed by the hour.','The team says the car is "learning."','Last. Still cheaper than buying a football team.'];
const NEWS=['Vortex Racing\'s owner calls your team "a tax write-off with wheels."','Halcyon Motors spent more on catering than you spent on your car. They\'re still slower.','Silverline\'s principal is "not worried" about the new billionaire. Reportedly worried.','Paddock insiders say your yacht is faster than your car. The yacht agrees.','Zephyr Racing fired its third tire engineer this month. Applications are open.','Kestrel GP calls tire-saving "an art form." Their drivers call it napping.','Obsidian Autosport denies their car is painted black to hide the dents.','Nova Dynamics asked for a bigger pit box. Officials asked for fewer crashes.'];
const TC={S:'#ff4b5c',M:'#ffd23f',H:'#f2f2f2',I:'#3ddc84',W:'#3f8cff'};

// ================= SAVE =================
const KEY='apex_garage_v3';
const salFor=(o,tier)=>Math.max(60,Math.round((o-40)**2*.32*Math.pow(TIERS[tier].mult,.6)/10)*10);
const fresh=()=>({team:'Apex Garage',tag:'APX',credits:1500,parts:10,xp:0,lvl:1,tier:0,lv:{engine:3,aero:3,tires:3,brakes:3,gearbox:3,chassis:3},
 drv:{name:'Kit Marlowe',age:21,pace:58,cons:55,care:52,ovr:50,wet:50,pot:78,sal:60,con:2},staff:{eng:1,crew:1,strat:1,com:1},
 season:1,round:1,pts:Array(10).fill(0),results:[],aiB:Array(10).fill(0),races:0,wins:0,podiums:0,titles:0,tut:0,started:false,
 sp:{title:null,partner:null},mkt:null,mktS:0,strat:{start:'M',mode:'normal',fuel:100,stops:[{lap:5,comp:'H'}]},
 hp:{engine:100,aero:100,tires:100,brakes:100,gearbox:100,chassis:100},up:[],rd:{},rdq:null,liv:{c1:0x0e2452,c2:0xff5a1f,pat:0},ach:{},st:{poles:0,wetWins:0,fl:0,fails:0},daily:{last:'',streak:0},qual:null});
let save=fresh();
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.lv)save=Object.assign(fresh(),s);}catch(e){}
const PREVIEW=false;
if(PREVIEW&&!save.started){Object.assign(save,{team:'Preview Racing',tag:'PRV',started:true,tut:9,freeDone:true,races:1,round:2,lvl:4,credits:6000,parts:30,xp:0});}
if(PREVIEW){save.tut=9;save.freeDone=true;save.started=true;save.credits=Math.max(save.credits,4000);save.parts=Math.max(save.parts,25);}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(save));}catch(e){}};
const tierD=()=>TIERS[save.tier];
function syncTeams(){
  TEAMS[0].name=save.team;TEAMS[0].tag=save.tag;TEAMS[0].c1=save.liv.c1;TEAMS[0].c2=save.liv.c2;TEAMS[0].crew=.35+(save.staff.crew-1)*.065;
  const dp=tierD().dp,cl=v=>Math.max(25,Math.min(99,v+dp));
  TEAMS.slice(1).forEach(t=>{t.tierAi=tierD().ai;t.boost=save.aiB[t.id]||0;t.drv={name:t.drv0.name,pace:cl(t.drv0.pace),cons:cl(t.drv0.cons),care:cl(t.drv0.care),ovr:cl(t.drv0.ovr),wet:cl(t.drv0.wet)};});
}
syncTeams();
const upCost=l=>({c:Math.round(120*Math.pow(1.5,l-1)/10)*10,p:Math.ceil(l*.8)});
const stCost=l=>Math.round(300*Math.pow(1.6,l-1)/10)*10;
const trCost=v=>Math.round((90+(v-40)*11)/10)*10;
const xpNeed=l=>120*l;
const drvOvr=d=>Math.round(d.pace*.34+d.cons*.2+d.care*.16+d.ovr*.18+d.wet*.12);
const carStats=lv=>({SPEED:lv.engine*.55+lv.aero*.15+lv.gearbox*.3,CORNERING:lv.aero*.5+lv.chassis*.3+lv.tires*.2,ACCEL:lv.gearbox*.55+lv.engine*.45,BRAKING:lv.brakes*.75+lv.tires*.25,'TIRE LIFE':lv.tires*.55+lv.chassis*.45});
const rarity=l=>l<=3?['COMMON','#9aa3b2']:l<=6?['RARE','#3f8cff']:l<=9?['EPIC','#b26bff']:['LEGENDARY','#ffcc4d'];
const rating=lv=>Math.round(carCP(lv)/12*100);
const curTrack=()=>TBYID[CAL[save.round-1]];
const isFree=()=>!save.freeDone&&save.races===0;
const raceSeed=()=>1000+save.season*100+save.round*7+save.tier*13+(isFree()?41:0);
const wxPlan=()=>isFree()?Array(LAPS+1).fill(0):makeWx(raceSeed(),curTrack().theme);
const qKey=()=>save.season*100+save.round*10+save.tier;
const hasQual=()=>!isFree()&&!!save.qual&&save.qual.k===qKey();
const MULK=new Set(['wearMul','fuelMul','relMul','dmgMul','svc','prize']);
function rdFx(){const f={engB:0,wetB:0,ersB:0,pitB:0,launchB:0,qualB:0,wearMul:1,fuelMul:1,relMul:1,dmgMul:1,svc:1,prize:1};
  for(const n of RD)if(save.rd[n.id])for(const k in n.fx){if(MULK.has(k))f[k]*=n.fx[k];else f[k]+=n.fx[k];}return f;}
function cfg(){const x=rdFx();return {...save.strat,drv:save.drv,engB:(save.staff.eng-1)*.0008+x.engB,wearMul:(1-(save.staff.strat-1)*.025)*x.wearMul,fuelMul:x.fuelMul,relMul:x.relMul,dmgMul:x.dmgMul,wetB:x.wetB,ersB:x.ersB,pitB:x.pitB,launchB:x.launchB,qualB:x.qualB,
  hp:isFree()?null:save.hp,wx:wxPlan(),grid:hasQual()?save.qual.o.map(q=>q.id):null};}
const money=n=>(n<0?'−$':'$')+Math.abs(Math.round(n)).toLocaleString();
const fmt=t=>{t*=TD;return `${Math.floor(t/60)}:${(t%60).toFixed(3).padStart(6,'0')}`;};
const hex=c=>'#'+new THREE.Color(c).getHexString();
const tcol=t=>hex(t.c1===0x1a1b20||t.id===0?t.c2:t.c1);
const code=n=>n.split(' ').pop().slice(0,3).toUpperCase();
const $=id=>document.getElementById(id);
let tLoaded=null;
function useTrack(def){if(tLoaded!==def.id){loadTrack(def);tLoaded=def.id;}else setTrack(TR);}
function rankAt(def){useTrack(def);const r=[{id:0,r:carCP(save.lv)},...TEAMS.slice(1).map(t=>({id:t.id,r:carCP(aiLevels(t))}))].sort((a,b)=>b.r-a.r);return{rk:r.findIndex(x=>x.id===0)+1,list:r};}
// track outline svg
const outlineCache={};
function outline(def,cls='trk'){
  if(!outlineCache[def.id]){const cv=new THREE.CatmullRomCurve3(def.pts.map(([x,z])=>new V3(x,0,z)),true,'centripetal'),p=cv.getSpacedPoints(110);
    let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;p.forEach(v=>{x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);z0=Math.min(z0,v.z);z1=Math.max(z1,v.z);});
    const W=100,H=70,s=Math.min((W-12)/(x1-x0),(H-12)/(z1-z0)),ox=(W-(x1-x0)*s)/2,oz=(H-(z1-z0)*s)/2,m=v=>[(ox+(v.x-x0)*s).toFixed(1),(oz+(v.z-z0)*s).toFixed(1)];
    const d='M'+p.map(v=>m(v).join(',')).join('L')+'Z',[sx,sz]=m(p[0]);outlineCache[def.id]={d,sx,sz};}
  const o=outlineCache[def.id];return `<svg class="${cls}" viewBox="0 0 100 70"><path class="sh" d="${o.d}"/><path d="${o.d}"/><circle cx="${o.sx}" cy="${o.sz}" r="4"/></svg>`;
}
const tempOf=d=>d.temp||THEMES[d.theme].temp;
const lenMi=def=>{useTrack(def);return(L/1609.34).toFixed(2);};
function traits(def){const t=def.tr,fav=Object.entries(t.tm).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>PARTINFO[x[0]][0]);return{wear:t.wear>=1.25?'HIGH':t.wear<=.9?'LOW':'MEDIUM',pass:t.ovk>=1.3?'EASY':t.ovk<=.7?'HARD':'MEDIUM',fav};}

// ================= MARKET / SPONSORS =================
function genMarket(){
  seed=save.season*977+save.tier*131+7;const list=[];
  for(let i=0;i<8;i++){
    const age=18+Math.floor(rand()*17),tgt=46+save.tier*9+rand()*24-(age<21?6:0),st=()=>Math.round(Math.max(30,Math.min(97,tgt+(rand()-.5)*18)));
    const d={name:FN[Math.floor(rand()*FN.length)]+' '+LN[Math.floor(rand()*LN.length)],age,pace:st(),cons:st(),care:st(),ovr:st(),wet:st()};
    const o=drvOvr(d);d.pot=Math.min(98,age<24?o+6+Math.round(rand()*16):age<29?o+Math.round(rand()*5):o);d.sal=salFor(o,save.tier);d.fee=d.sal*8;d.con=1+Math.floor(rand()*3);list.push(d);}
  save.mkt=list.sort((a,b)=>drvOvr(b)-drvOvr(a));save.mktS=save.season*10+save.tier;persist();
}
function offers(slot){seed=save.season*331+save.round*17+(slot==='title'?5:9)+save.tier*3;const taken=[save.sp.title&&save.sp.title.id,save.sp.partner&&save.sp.partner.id];const pool=SPONS.filter(s=>!taken.includes(s.id));const out=[];while(out.length<3&&pool.length)out.push(pool.splice(Math.floor(rand()*pool.length),1)[0]);return out;}
const spPay=(sp,slot)=>Math.round(sp.base*tierD().mult*(slot==='title'?1.5:.8)/10)*10;
const spBonus=(sp,slot,k)=>Math.round(sp.base*tierD().mult*(slot==='title'?1.2:.8)*k/10)*10;
function objective(slot){
  const c=save.sp[slot];if(!c)return null;const sp=SBYID[c.id];seed=save.season*1000+save.round*10+(slot==='title'?1:2)+save.tier*7;
  const{rk,list}=rankAt(curTrack()),r=rand();
  const T={results:['top','top','hold'],aggro:['gain','beat','top'],consistent:['stop1','hold','top'],speed:['fl5','fl','gain']}[sp.style];
  const k=T[Math.floor(r*T.length)];let o;
  if(k==='top'){const n=Math.max(1,Math.min(9,rk-1+(rand()<.5?0:1)));o={txt:`Finish P${n} or better`,t:x=>x.pos<=n,m:1.3+(10-n)*.16};}
  else if(k==='hold')o={txt:'Finish at or above your grid slot',t:x=>x.pos<=x.grid,m:1};
  else if(k==='gain'){const n=2+Math.floor(rand()*3);o={txt:`Gain ${n} or more places`,t:x=>x.grid-x.pos>=n,m:.7+n*.35};}
  else if(k==='beat'){const tid=list[Math.max(0,rk-2)].id;const tm=TEAMS[tid===0?list[rk]?.id||1:tid];o={txt:`Finish ahead of ${tm.name}`,t:x=>x.rank(tm.id)>x.pos,m:1.4};}
  else if(k==='stop1')o={txt:'Finish with one pit stop or fewer',t:x=>x.stops<=1,m:1};
  else if(k==='fl5')o={txt:'Set a top-5 lap time',t:x=>x.bestRank<=5,m:1.2};
  else o={txt:'Set the fastest lap of the race',t:x=>x.fl,m:2.6};
  o.bonus=spBonus(sp,slot,o.m);o.sp=sp;o.slot=slot;return o;
}

// ================= 3D OBJECTS =================
buildGarage(save.team,TEAMS[0].c1,TEAMS[0].c2);
const objs=TEAMS.map(t=>t.id===0?null:buildCar({c1:t.c1,c2:t.c2,num:t.num,tag:t.tag,hq:false}));
objs.forEach(o=>{if(o){o.car.visible=false;scene.add(o.car);}});
let pObj=buildCar({c1:TEAMS[0].c1,c2:TEAMS[0].c2,pat:save.liv.pat,num:'07',tag:save.tag,hq:true});objs[0]=pObj;
function rebuildPlayer(){pObj.car.parent&&pObj.car.parent.remove(pObj.car);pObj=objs[0]=buildCar({c1:TEAMS[0].c1,c2:TEAMS[0].c2,pat:save.liv.pat,num:'07',tag:save.tag,hq:true});toGarage();}
function toGarage(){gscene.add(pObj.car);pObj.car.position.set(0,.1,0);pObj.car.rotation.set(0,0,0);pObj.body.rotation.set(0,0,0);pObj.wheels.forEach(w=>{if(w.front)w.pivot.rotation.y=-.28;});key.target.position.set(0,.4,0);rim.target.position.set(0,.4,0);fill.target.position.set(0,.4,0);}
toGarage();
const _p=new V3(),_t=new V3();
function placeObj(obj,j,lat,yaw){
  const jm=((j%N)+N)%N,i0=Math.floor(jm)%N,i1=(i0+1)%N,f=jm-Math.floor(jm);
  _p.lerpVectors(P[i0],P[i1],f);_t.lerpVectors(PT[i0],PT[i1],f).normalize();
  obj.position.set(_p.x-_t.z*lat,bankY(i0,off[i0]+lat),_p.z+_t.x*lat);obj.rotation.set(0,Math.atan2(_t.x,_t.z)+(yaw||0),BS[i0]);return i0;
}
const controls=new OrbitControls(camera,renderer.domElement);
Object.assign(controls,{enabled:false,enableDamping:true,dampingFactor:.08,minDistance:3.6,maxDistance:11,maxPolarAngle:1.45,autoRotate:true,autoRotateSpeed:.8,enablePan:false});
let focus=null;
const FOC={engine:[[0,.9,-1.1],[2.6,1.8,-3.4]],aero:[[0,.45,2.6],[2.6,1.4,4.8]],tires:[[.84,.46,1.72],[3.2,1.1,3.2]],brakes:[[.81,.46,-1.62],[3.2,1,-.2]],gearbox:[[0,.55,-2],[-2.6,1.2,-4.1]],chassis:[[0,.6,0],[-3.9,2.8,1.8]]};
function focusPart(k){const F=FOC[k];focus={target:new V3(...F[0]),pos:new V3(...F[1])};controls.autoRotate=false;}
function menuCam(){camera.fov=40;camera.updateProjectionMatrix();focus=null;controls.enabled=true;controls.autoRotate=true;controls.target.set(0,.6,0);camera.position.set(5.4,2.1,5.8);controls.update();applyOffset();}
let state='boot',tab='home';
function applyOffset(){
  const o={menu:tab==='home'?.07:tab==='car'?.03:0,intro:.17,story:.17,strat:.24}[state]||(state==='race'&&camMode==='chase'?.1:0);
  if(o)camera.setViewOffset(innerWidth,innerHeight,0,innerHeight*o,innerWidth,innerHeight);else camera.clearViewOffset();
}

// ================= SHELL =================
document.querySelectorAll('.sndb').forEach(b=>b.addEventListener('click',()=>{AU.setOn(!AU.on);sndUI();if(AU.on)AU.click();}));
function sndUI(){document.querySelectorAll('.sndb').forEach(b=>b.classList.toggle('off',!AU.on));}
function header(){sndUI();
  $('t-tag').textContent=save.tag;$('t-team').textContent=save.team;$('t-lv').textContent=save.lvl;$('t-tier').textContent=tierD().s;
  $('t-xp').style.width=Math.min(100,save.xp/xpNeed(save.lvl)*100)+'%';
  $('t-cash').textContent=Math.round(save.credits).toLocaleString();$('t-parts').textContent=save.parts;
  try{document.querySelector('[data-nav=team]').classList.toggle('dot',claimables()>0);}catch(e){}
}
const VIEWS=['home','car','drivers','team','series'];
function showMenu(t=tab){
  const wasMenu=state==='menu',prev=tab;state='menu';tab=t;setWet(0);$('rain').classList.add('hide');$('spd').classList.add('hide');AU.rain(0);
  ['intro','story','strat','hud','result'].forEach(id=>$(id).classList.add('hide'));
  $('top').classList.remove('hide');$('nav').classList.remove('hide');
  document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('on',b.dataset.nav===t));
  VIEWS.forEach(v=>$('v-'+v).classList.toggle('hide',v!==t));
  $('v-'+t).classList.remove('fade');void $('v-'+t).offsetWidth;$('v-'+t).classList.add('fade');
  closeSheet();header();RENDER[t]();
  if(!wasMenu||(prev==='car'&&t!=='car'))menuCam();
  applyOffset();
  if(save.tut===0&&t==='home')tutSet(0);else if(save.tut===1&&t==='car')tutSet(2);else if(save.tut===5&&t==='home')tutSet(6);else if(save.tut===9&&t==='home')tutSet(9);
}
$('nav').addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(b)showMenu(b.dataset.nav);});
function openSheet(html){$('sheet-b').innerHTML=html;$('sheet').classList.add('on');$('scrim').classList.add('on');}
function closeSheet(){$('sheet').classList.remove('on');$('scrim').classList.remove('on');document.querySelectorAll('.part.sel').forEach(p=>p.classList.remove('sel'));}
$('scrim').onclick=()=>{closeSheet();if(tab==='car')controls.autoRotate=true;if(save.tut===4)tutSet(5);};
const coin='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#ffcc4d"/></svg>',gem='<svg viewBox="0 0 24 24"><path d="M12 1.5l9.5 5.5v10L12 22.5 2.5 17V7z" fill="#4fd2ff"/></svg>';

// ---------- HOME ----------
let newsI=0;
function objRows(){const rows=['title','partner'].map(objective).filter(Boolean);
  return rows.length?rows.map(o=>`<div class="obj"><div class="sdot" style="background:${o.sp.c}">${o.sp.ab}</div><div class="tx">${o.txt}<small>${o.sp.name} · ${o.slot==='title'?'Title':'Partner'} sponsor</small></div><b>+${money(o.bonus)}</b></div>`).join(''):null;}
function rHome(){
  const d=curTrack(),tt=traits(d),st=standings(),me=st.findIndex(x=>x.t.id===0)+1,ob=objRows();
  $('v-home').innerHTML=`
  <div class="card strip"><div><div class="lbl a">${tierD().n}</div><div class="h" style="font-size:19px;margin-top:3px">${isFree()?'FREE RACE · NO SEASON YET':`SEASON ${save.season} · ROUND ${save.round}/10`}</div></div>
    <div style="text-align:right"><div class="prog">${CAL.map((_,i)=>`<i class="${save.results[i]?'d':i+1===save.round?'n':''}"></i>`).join('')}</div><div class="lbl" style="margin-top:6px">${isFree()?'DOES NOT COUNT':`P${me} · ${save.pts[0]} PTS`}</div></div></div>
  <div class="sp"></div>
  ${dailyHtml()}${!isFree()&&minHp()<50?`<div class="card"><div class="cb" style="display:flex;align-items:center;gap:12px"><div style="flex:1"><div class="h rd" style="font-size:16px">CAR NEEDS SERVICE</div><div class="m" style="font-size:12.5px">Worn parts can fail mid-race.</div></div><button class="btn sm s2" data-gocar="svc">SERVICE</button></div></div>`:''}
  ${ob?`<div class="card"><div class="ch"><span class="t">SPONSOR GOALS</span><span class="lbl">THIS RACE</span></div><div class="cb" style="padding-top:4px">${ob}</div></div>`:`<div class="card"><div class="cb" style="display:flex;align-items:center;gap:12px"><div style="flex:1"><div class="h" style="font-size:16px">NO SPONSORS YET</div><div class="m" style="font-size:12.5px">Sponsors pay every race, plus bonuses for hitting goals.</div></div><button class="btn sm s2" data-go="team-sp">FIND ONE</button></div></div>`}
  <div class="card event">${outline(d)}<div><div class="lbl a">${isFree()?'FREE RACE':'NEXT RACE'}</div><h2>${d.name}</h2><div class="m" style="font-size:12px;margin-top:3px">${d.loc}</div>
    <div class="chips"><span class="chip o">${d.kind}</span><span class="chip">${lenMi(d)} MI</span><span class="chip">${tempOf(d)}°F</span></div></div>
    <button class="go" data-act="strat"><b>RACE</b><small>${LAPS} LAPS</small></button></div>`;
}
$('v-home').addEventListener('click',e=>{if(e.target.closest('[data-daily]')){claimDaily();return;}const g=e.target.closest('[data-gocar]');if(g){carTab=g.dataset.gocar;showMenu('car');return;}const b=e.target.closest('[data-go]');if(b){tTab='sp';showMenu('team');}});
// ---------- CAR ----------
let selPart=null;
function bars(lv,nx,fld){
  const a=carStats(lv),b=nx?carStats(nx):null,f=fld?fld.map(carStats):null;
  return Object.keys(a).map(k=>{const w=a[k]/12*100,w2=b?b[k]/12*100:w,fa=f?f.reduce((s,x)=>s+x[k],0)/f.length/12*100:null;
    return `<div class="sb"><span>${k}</span><div class="tr"><i style="width:${w}%"></i>${w2>w+.01?`<em style="left:${w}%;width:${w2-w}%"></em>`:''}${fa!=null?`<u style="left:${fa}%"></u>`:''}</div><b class="${w2>w+.01?'gr':''}">${Math.round(w2)}</b></div>`;}).join('');
}
let carTab='parts';
function rCar(){
  if(save.tut>=1&&save.tut<=3)carTab='parts';
  const segs=[['parts','UPGRADES'],['rd','R&D'],['svc','SERVICE'],['liv','LIVERY']];
  $('v-car').innerHTML=`<div class="seg">${segs.map(([k,n])=>`<button data-cc="${k}" class="${carTab===k?'on':''}">${n}${k==='svc'&&!isFree()&&minHp()<50?' ⚠':''}</button>`).join('')}</div><div class="sp" style="height:10px"></div>`+({parts:carParts,rd:rdHtml,svc:svcHtml,liv:livHtml})[carTab]();
}
function carParts(){
  const d=curTrack(),{rk}=rankAt(d),fl=TEAMS.slice(1).map(aiLevels),tt=traits(d),fav=Object.entries(d.tr.tm).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
  return `
  <div class="card"><div class="cb" style="display:flex;gap:16px;align-items:center">
    <div><div class="lbl">CAR RATING</div><div class="num" style="font-size:52px;line-height:.85">${rating(save.lv)}</div></div>
    <div style="flex:1"><div class="lbl">AT ${d.short}</div><div class="h" style="font-size:22px;margin-top:2px">RANK ${rk} <span class="m" style="font-size:15px">/ 10</span></div><div class="m" style="font-size:12px;margin-top:2px">Favors ${tt.fav.join(' and ')}</div></div></div>
    <div class="cb" style="padding-top:0">${bars(save.lv,null,fl)}<div class="m" style="font-size:11px;margin-top:4px">White line = field average</div></div></div>
  <div class="sp"></div>
  <div class="parts">${PARTS.map(k=>{const l=save.lv[k],[r,c]=rarity(l);return `<button class="part ${selPart===k?'sel':''}" data-part="${k}" style="--rc:${c}"><div class="ic">${svg(k)}</div><div class="l">${l}</div><div class="n">${PARTINFO[k][0]}</div>${fav.includes(k)?'<div class="fav">★ TRACK</div>':''}${upOf(k)?`<div class="bd" data-end="${upOf(k).end}">${fmtT(upOf(k).end-Date.now())}</div>`:''}<div class="r"></div></button>`;}).join('')}</div>`;
}
function partSheet(k){
  const l=save.lv[k],[r,c]=rarity(l),u=upCost(l),max=l>=12,nx={...save.lv,[k]:l+1},secs=upSecs(l),busy=upOf(k),full=!busy&&secs>0&&save.up.length>=bays(),can=!max&&!busy&&!full&&save.credits>=u.c&&save.parts>=u.p;
  openSheet(`<div class="ch"><div><span class="rar" style="--rc:${c}">${r}</span><div class="h" style="font-size:28px;margin-top:6px">${PARTINFO[k][0]}</div></div><div style="text-align:right"><div class="lbl">LEVEL</div><div class="num" style="font-size:44px;line-height:.9">${l}${max?'':`<span class="gr" style="font-size:26px"> → ${l+1}</span>`}</div></div></div>
  <div class="cb"><div class="m" style="font-size:13px;margin-bottom:6px">${PARTINFO[k][1]}</div>${bars(save.lv,max?null:nx)}
  <div class="sb"><span>RATING</span><div class="tr"><i style="width:${rating(save.lv)}%"></i>${max?'':`<em style="left:${rating(save.lv)}%;width:${rating(nx)-rating(save.lv)}%"></em>`}</div><b class="gr">${max?rating(save.lv):rating(nx)}</b></div>
  ${max?'<div class="cost">FULLY UPGRADED</div>':busy?`<div class="cost"><span class="tmr c">BUILDING · <b data-end="${busy.end}">${fmtT(busy.end-Date.now())}</b></span></div>`:`<div class="cost"><span class="${save.credits>=u.c?'':'rd'}">${coin}${money(u.c)}</span><span class="${save.parts>=u.p?'':'rd'}">${gem}${u.p}</span>${secs?`<span class="m tmr">⏱ ${fmtT(secs*1000)}</span>`:''}</span></div>`}
  ${busy?`<button class="btn" data-skip="up:${k}" ${save.parts>=skipCost(busy.end)?'':'disabled'}>SKIP · ${gem}${skipCost(busy.end)}</button>`:`<button class="btn" data-upg="${k}" ${can?'':'disabled'}>${max?'MAXED':full?'BAYS FULL':can?'UPGRADE':'NOT ENOUGH'}</button>`}</div>`);
}
$('v-car').addEventListener('click',e=>{
  const cc=e.target.closest('[data-cc]');if(cc){carTab=cc.dataset.cc;rCar();return;}
  const b=e.target.closest('[data-part]');if(b){selPart=b.dataset.part;rCar();focusPart(selPart);partSheet(selPart);if(save.tut===2)tutSet(3);return;}
  const r=e.target.closest('[data-rd]');if(r){startRd(r.dataset.rd);return;}
  const sk=e.target.closest('[data-skip]');if(sk){skipTimer(sk.dataset.skip);return;}
  const sv=e.target.closest('[data-svc]');if(sv){service(sv.dataset.svc);return;}
  const lv=e.target.closest('[data-liv]');if(lv){setLiv(lv.dataset.liv);return;}
});
// ---------- DRIVERS ----------
let dTab='me';
function helmet(c1,c2){return `<svg class="helm" viewBox="0 0 100 100"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="#05070c"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="#10151f" stroke="rgba(255,255,255,.08)"/><path d="M18 62c0-24 15-40 36-40 18 0 30 14 30 32v10c0 6-4 10-10 10H30c-7 0-12-5-12-12z" fill="url(#hg)"/><path d="M40 46h44v14H46c-4 0-6-3-6-7z" fill="#0b0d12"/><path d="M44 49h38v6H47z" fill="#2a3550"/><path d="M22 58c8-14 20-24 34-28" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;}
const DSTAT=[['pace','PACE'],['cons','CONSISTENCY'],['care','TIRE CARE'],['ovr','OVERTAKING'],['wet','WET WEATHER']];
function rDrivers(){
  if(save.mktS!==save.season*10+save.tier||!save.mkt)genMarket();
  const d=save.drv;let body='';
  if(dTab==='me'){
    body=`<div class="card"><div class="cb"><div class="dc">${helmet(hex(TEAMS[0].c1),hex(TEAMS[0].c2))}<div style="flex:1"><div class="lbl a">#07 · YOUR DRIVER</div><div class="h" style="font-size:27px;margin-top:3px">${d.name}</div><div class="m" style="font-size:12.5px;margin-top:2px">Age ${d.age} · Potential ${d.pot}</div></div><div class="ovr"><div class="lbl">OVR</div><b>${drvOvr(d)}</b></div></div>
      <div class="dl"><div><span class="lbl">SALARY</span><b>${money(d.sal)}</b><span class="lbl">PER RACE</span></div><div><span class="lbl">CONTRACT</span><b>${d.con} SEASON${d.con===1?'':'S'}</b><span class="lbl">REMAINING</span></div><div><span class="lbl">RECORD</span><b>${save.wins}W ${save.podiums}P</b><span class="lbl">WITH YOU</span></div></div></div></div>
    <button class="btn s2" data-rel style="height:46px;font-size:17px;margin-bottom:12px">RELEASE DRIVER</button>
    <div class="card"><div class="ch"><span class="t">TRAINING</span><span class="lbl">+2 PER SESSION · CAP ${d.pot}</span></div><div class="cb" style="padding-top:4px">
    ${DSTAT.map(([k,n])=>{const v=d[k],c=trCost(v),cap=Math.max(d.pot,v),can=v<cap&&save.credits>=c;return `<div class="li"><div class="tx"><b>${n}<span class="num" style="float:right;font-size:19px;margin-right:4px">${v}</span></b><div class="sb" style="grid-template-columns:1fr;margin:6px 0 0"><div class="tr"><i style="width:${v}%"></i><u style="left:${cap}%"></u></div></div></div><button class="btn sm s2" data-train="${k}" ${can?'':'disabled'}>${v>=cap?'CAPPED':money(c)}</button></div>`;}).join('')}</div></div>`;
  }else{
    body=`<div class="card"><div class="ch"><span class="t">DRIVER MARKET</span><span class="lbl">SEASON ${save.season}</span></div><div class="cb" style="padding-top:4px">
    ${save.mkt.length?save.mkt.map((m,i)=>`<button class="mk" style="width:100%;text-align:left" data-mk="${i}"><div class="o">${drvOvr(m)}</div><div><b style="font-size:15px">${m.name}</b><div class="m" style="font-size:12px">Age ${m.age} · POT ${m.pot} · ${m.con} season${m.con>1?'s':''}</div></div><div style="text-align:right"><div class="num g" style="font-size:16px">${money(m.fee)}</div><div class="lbl">${money(m.sal)}/RACE</div></div></button>`).join(''):'<div class="m">Market is empty until next season.</div>'}</div></div>
    <div class="m" style="font-size:12px;padding:0 4px">One seat. Signing a new driver releases your current one. New faces arrive every season.</div>`;
  }
  $('v-drivers').innerHTML=`<div class="seg">${[['me','MY DRIVER'],['mkt','MARKET']].map(([k,n])=>`<button data-dt="${k}" class="${dTab===k?'on':''}">${n}</button>`).join('')}</div>${body}`;
}
function mkSheet(i){
  const m=save.mkt[i],d=save.drv,can=save.credits>=m.fee;
  openSheet(`<div class="ch"><div><div class="lbl a">FREE AGENT · AGE ${m.age}</div><div class="h" style="font-size:28px;margin-top:4px">${m.name}</div></div><div class="ovr"><div class="lbl">OVR</div><b>${drvOvr(m)}</b></div></div>
  <div class="cb"><div class="lbl" style="margin-bottom:4px">VS ${d.name.toUpperCase()}</div>
  ${DSTAT.map(([k,n])=>{const a=d[k],b=m[k];return `<div class="sb"><span>${n}</span><div class="tr"><i style="width:${Math.min(a,b)}%"></i>${b>a?`<em style="left:${a}%;width:${b-a}%"></em>`:`<s style="left:${b}%;width:${a-b}%"></s>`}</div><b class="${b>a?'gr':b<a?'rd':''}">${b}</b></div>`;}).join('')}
  <div class="dl"><div><span class="lbl">POTENTIAL</span><b>${m.pot}</b></div><div><span class="lbl">SALARY</span><b>${money(m.sal)}</b></div><div><span class="lbl">CONTRACT</span><b>${m.con} SZN</b></div></div>
  <div class="cost"><span class="${can?'':'rd'}">${coin}${money(m.fee)} SIGNING FEE</span></div>
  <button class="btn" data-sign="${i}" ${can?'':'disabled'}>${can?'SIGN DRIVER':'NOT ENOUGH CASH'}</button></div>`);
}
const RESERVES=['Sam Rourke','Dev Calloway','Nico Brandt','Jo Tillman','Ace Marenko'];
function reserveDrv(){const n=RESERVES[(save.races+save.season+save.drv.age)%RESERVES.length];return {name:n===save.drv.name?'Lee Okafor':n,age:19,pace:48,cons:46,care:48,ovr:44,wet:44,pot:70,sal:40,con:1};}
function relModal(){const d=save.drv,c=Math.round(d.sal*4*d.con),can=save.credits>=c;
  $('modal').innerHTML=`<div class="card pop"><div class="cb"><div class="lbl a">RELEASE DRIVER</div><div class="h" style="font-size:28px;margin:8px 0">${d.name}</div><div class="m">Buyout: ${money(c)}. A weaker reserve driver takes the seat until you sign someone from the market.</div><div style="display:flex;gap:8px;margin-top:14px"><button class="btn s2" data-mb="0">KEEP</button><button class="btn" data-mb="1" ${can?'':'disabled'}>${can?'RELEASE':'NEED CASH'}</button></div></div></div>`;
  $('modal').classList.remove('hide');
  $('modal').onclick=e=>{const b=e.target.closest('[data-mb]');if(!b)return;$('modal').classList.add('hide');$('modal').onclick=null;
    if(b.dataset.mb==='1'&&save.credits>=c){save.credits-=c;AU.err();save.drv=reserveDrv();dTab='mkt';persist();header();rDrivers();}};
}
$('v-drivers').addEventListener('click',e=>{
  if(e.target.closest('[data-rel]')){relModal();return;}
  const t=e.target.closest('[data-dt]');if(t){dTab=t.dataset.dt;rDrivers();return;}
  const k=e.target.closest('[data-train]');if(k){const s=k.dataset.train,v=save.drv[s],c=trCost(v);if(v<Math.max(save.drv.pot,v)&&save.credits>=c){save.credits-=c;save.drv[s]=Math.min(Math.max(save.drv.pot,v),v+2);AU.level();persist();header();rDrivers();}return;}
  const m=e.target.closest('[data-mk]');if(m)mkSheet(+m.dataset.mk);
});
// ---------- TEAM ----------
let tTab='sp';
function rTeam(){
  let body='';
  if(tTab==='sp'){
    body=['title','partner'].map(slot=>{const c=save.sp[slot],nm=slot==='title'?'TITLE SPONSOR':'PARTNER';
      if(c){const sp=SBYID[c.id],o=objective(slot);return `<div class="card"><div class="ch"><span class="t">${nm}</span><span class="lbl">${c.left} RACE${c.left===1?'':'S'} LEFT</span></div><div class="cb"><div class="li"><div class="sdot" style="background:${sp.c};width:46px;height:46px;font-size:17px;border-radius:12px">${sp.ab}</div><div class="tx"><b>${sp.name}</b><small>${sp.tag}</small></div><div style="text-align:right"><div class="num g" style="font-size:17px">${money(spPay(sp,slot))}</div><div class="lbl">PER RACE</div></div></div>
        <div class="obj"><div class="tx">${o.txt}<small>Next race goal</small></div><b>+${money(o.bonus)}</b></div></div></div>`;}
      return `<div class="card"><div class="ch"><span class="t">${nm}</span><span class="lbl a">OPEN · PICK ONE</span></div><div class="cb" style="padding-top:4px">${offers(slot).map(sp=>`<div class="li"><div class="sdot" style="background:${sp.c};width:42px;height:42px;font-size:15px;border-radius:12px">${sp.ab}</div><div class="tx"><b>${sp.name}</b><small>${sp.tag} · ${slot==='title'?6:4} races</small></div><div style="text-align:right"><div class="num g" style="font-size:16px">${money(spPay(sp,slot))}</div><button class="btn sm" style="height:32px;margin-top:4px" data-spon="${slot}:${sp.id}">SIGN</button></div></div>`).join('')}</div></div>`;}).join('');
  }else if(tTab==='staff'){
    const cap=Math.min(10,save.lvl+1);
    body=`<div class="card"><div class="ch"><span class="t">FACTORY STAFF</span><span class="lbl">MAX LV ${cap} · RAISE WITH OWNER LV</span></div><div class="cb" style="padding-top:4px">
    ${Object.entries(STAFF).map(([k,[n,ds_,fx]])=>{const l=save.staff[k],c=stCost(l),lock=l>=cap,can=!lock&&save.credits>=c;
      return `<div class="li"><div class="ico">${svg(k)}</div><div class="tx"><b>${n} <span class="lbl" style="margin-left:4px">LV ${l}</span></b><small>${ds_}</small><small class="gr" style="font-weight:600">${fx(l)}${l<10?` <span class="m">→ ${fx(l+1)}</span>`:''}</small><div class="pips">${Array.from({length:10},(_,i)=>`<i class="${i<l?'on':''}"></i>`).join('')}</div></div><button class="btn sm s2" data-staff="${k}" ${can?'':'disabled'}>${l>=10?'MAX':lock?'LOCKED':money(c)}</button></div>`;}).join('')}</div></div>`;
  }else if(tTab==='aw'){body=awHtml();
  }else{
    body=`<div class="card"><div class="cb"><div style="display:flex;gap:14px;align-items:center"><div class="crest" style="width:58px;height:64px;font-size:19px">${save.tag}</div><div style="flex:1"><div class="lbl a">TEAM OWNER</div><div class="h" style="font-size:26px;margin-top:3px">${save.team}</div><div class="m" style="font-size:12.5px">Personal fortune $4.7B · locked in a trust</div></div></div>
      <div class="sb" style="grid-template-columns:70px 1fr 70px;margin-top:14px"><span>LEVEL ${save.lvl}</span><div class="tr"><i style="width:${save.xp/xpNeed(save.lvl)*100}%;background:linear-gradient(90deg,#1263e0,var(--gem))"></i></div><b>${save.xp}/${xpNeed(save.lvl)}</b></div>
      <div class="dl" style="grid-template-columns:repeat(4,1fr)">${[['STARTS',save.races],['WINS',save.wins],['PODIUMS',save.podiums],['TITLES',save.titles]].map(([a,b])=>`<div style="text-align:center"><b style="font-size:22px">${b}</b><span class="lbl">${a}</span></div>`).join('')}</div></div></div>
    <div class="card"><div class="ch"><span class="t">CAREER LADDER</span></div><div class="cb">${ladder()}</div></div>
    <div class="card"><div class="ch"><span class="t">SAVE DATA</span></div><div class="cb" style="display:grid;gap:9px">
      <button class="btn s2" data-save="export">EXPORT SAVE</button>
      <button class="btn s2" data-save="import">IMPORT SAVE</button>
      <button class="btn" data-save="restart" style="background:linear-gradient(180deg,#e5484d,#a8232a)">RESTART FROM SCRATCH</button>
      <div class="m" style="font-size:12px">Export copies your save as text. Import pastes it back in. Restart wipes everything, including the intro.</div>
    </div></div>`;
  }
  $('v-team').innerHTML=`<div class="seg">${[['sp','SPONSORS'],['staff','STAFF'],['aw','AWARDS'+(claimables()?' ●':'')],['own','OWNER']].map(([k,n])=>`<button data-tt="${k}" class="${tTab===k?'on':''}">${n}</button>`).join('')}</div>${body}`;
}
const ladder=()=>`<div class="ladder">${TIERS.map((t,i)=>`<div class="${i===save.tier?'on':i<save.tier?'dn':''}"><b>${t.s}</b><small>${i<save.tier?'DONE':i===save.tier?'NOW':'×'+t.mult+' PAY'}</small></div>`).join('')}</div><div class="m" style="font-size:12px;margin-top:8px">Finish the season in the top 3 to move up. Rivals get faster, prize money climbs.</div>`;
$('v-team').addEventListener('click',e=>{
  const t=e.target.closest('[data-tt]');if(t){tTab=t.dataset.tt;rTeam();return;}
  const s=e.target.closest('[data-staff]');if(s){const k=s.dataset.staff,l=save.staff[k],c=stCost(l);if(l<Math.min(10,save.lvl+1)&&save.credits>=c){save.credits-=c;save.staff[k]++;syncTeams();persist();header();rTeam();}return;}
  const p=e.target.closest('[data-spon]');if(p){const[slot,id]=p.dataset.spon.split(':');save.sp[slot]={id,left:slot==='title'?6:4};persist();checkAch();rTeam();return;}
  const ac=e.target.closest('[data-claim]');if(ac){claimAch(ac.dataset.claim);}
});
// ---------- SERIES ----------
let cTab='drv';
function standings(){return TEAMS.map(t=>({t,p:save.pts[t.id]})).sort((a,b)=>b.p-a.p||a.t.id-b.t.id);}
function rSeries(){
  const st=standings();let body='';
  if(cTab==='cal')body=CAL.map((id,i)=>{const d=TBYID[id],r=save.results[i];return `<div class="cal ${i+1===save.round?'nx':''}">${outline(d)}<div><b style="font-size:14.5px">${d.name}</b><div class="m" style="font-size:12px">R${i+1} · ${d.loc} · ${d.kind}</div></div><div class="res ${r&&r<=3?'g':''}">${r?'P'+r:i+1===save.round?'NEXT':'—'}</div></div>`;}).join('');
  else body=`<table class="tb">${st.map((x,i)=>{const t=x.t,dn=t.id===0?save.drv.name:t.drv.name;return `<tr class="${t.id===0?'me':''}"><td class="p">${i+1}</td><td class="cbar"><i style="background:${tcol(t)}"></i></td><td><b>${cTab==='drv'?dn:(t.id===0?save.team:t.name)}</b><br><small class="m">${cTab==='drv'?(t.id===0?save.team:t.name):(t.id===0?'You':PERS[t.pers])}</small></td><td class="pt">${x.p}</td></tr>`;}).join('')}</table>`;
  $('v-series').innerHTML=`<div class="card"><div class="ch"><span class="t">${tierD().n}</span><span class="lbl">S${save.season} · R${save.round}/10</span></div><div class="cb">${ladder()}</div></div>
  <div class="seg">${[['drv','DRIVERS'],['team','TEAMS'],['cal','CALENDAR']].map(([k,n])=>`<button data-ct="${k}" class="${cTab===k?'on':''}">${n}</button>`).join('')}</div>
  <div class="card"><div class="cb">${body}</div></div>`;
}
$('v-series').addEventListener('click',e=>{const b=e.target.closest('[data-ct]');if(b){cTab=b.dataset.ct;rSeries();}});
function saveSheet(mode){
  if(mode==='export'){const txt=btoa(unescape(encodeURIComponent(JSON.stringify(save))));
    openSheet(`<div class="lbl a">EXPORT SAVE</div><div class="m" style="font-size:12px;margin:6px 0">Copy this text and keep it safe.</div><textarea id="savebox" style="width:100%;height:120px;border-radius:10px;background:#0b1020;color:#fff;border:1px solid var(--line);padding:8px;font-size:11px" readonly>${txt}</textarea><button class="btn" data-save="copy">COPY</button>`);
    setTimeout(()=>{const t=$('savebox');if(t){t.focus();t.select();}},60);}
  else if(mode==='import'){
    openSheet(`<div class="lbl a">IMPORT SAVE</div><div class="m" style="font-size:12px;margin:6px 0">Paste a save string. This replaces your current career.</div><textarea id="savebox" style="width:100%;height:120px;border-radius:10px;background:#0b1020;color:#fff;border:1px solid var(--line);padding:8px;font-size:11px"></textarea><button class="btn" data-save="load">LOAD SAVE</button>`);}
  else if(mode==='restart'){
    openSheet(`<div class="lbl rd">RESTART</div><div class="h" style="font-size:24px;margin:6px 0">Start from scratch?</div><div class="m" style="font-size:12.5px;margin-bottom:12px">Your team, cash, drivers and results are erased. The intro plays again.</div><button class="btn" data-save="confirm-restart" style="background:linear-gradient(180deg,#e5484d,#a8232a)">YES, RESTART</button>`);}
}
document.body.addEventListener('click',e=>{
  const b=e.target.closest('[data-save]');if(!b)return;const m=b.dataset.save;
  if(m==='export'||m==='import'||m==='restart')saveSheet(m);
  else if(m==='copy'){const t=$('savebox');t.select();try{navigator.clipboard.writeText(t.value);}catch(err){}document.execCommand&&document.execCommand('copy');b.textContent='COPIED';}
  else if(m==='load'){try{const o=JSON.parse(decodeURIComponent(escape(atob($('savebox').value.trim()))));if(!o||!o.lv)throw 0;save=Object.assign(fresh(),o);persist();syncTeams();buildGarage(save.team,TEAMS[0].c1,TEAMS[0].c2);rebuildPlayer();closeSheet();showMenu('team');}catch(err){AU.err();$('savebox').style.borderColor='#ff4b5c';}}
  else if(m==='confirm-restart'){try{localStorage.removeItem(KEY);}catch(err){}save=fresh();si=0;try{location.reload();}catch(err){}setTimeout(()=>{closeSheet();$('top').classList.add('hide');$('nav').classList.add('hide');VIEWS.forEach(v=>$('v-'+v).classList.add('hide'));$('intro').classList.add('hide');state='story';$('story').classList.remove('hide');storyShow();},400);}
});
const RENDER={home:rHome,car:rCar,drivers:rDrivers,team:rTeam,series:rSeries};
$('sheet').addEventListener('click',e=>{
  const u=e.target.closest('[data-upg]');
  const sk=e.target.closest('[data-skip]');if(sk){const sp=sk.dataset.skip;skipTimer(sp);if(sp.startsWith('up:'))partSheet(sp.slice(3));return;}
  if(u){const k=u.dataset.upg,l=save.lv[k],c=upCost(l),secs=upSecs(l);if(l<12&&!upOf(k)&&save.credits>=c.c&&save.parts>=c.p&&(secs===0||save.up.length<bays())){save.credits-=c.c;save.parts-=c.p;AU.wrench();
    if(secs===0)save.lv[k]++;else save.up.push({k,to:l+1,end:Date.now()+secs*1000});persist();header();rCar();partSheet(k);$('sheet-b').querySelector('.num').classList.add('pop');if(save.tut===3)tutSet(4);checkAch();}return;}
  const s=e.target.closest('[data-sign]');
  if(s){const m=save.mkt[+s.dataset.sign];if(save.credits>=m.fee){save.credits-=m.fee;AU.cash();const{fee,...d}=m;save.drv=d;save.mkt.splice(+s.dataset.sign,1);persist();header();closeSheet();dTab='me';rDrivers();}}
});

// ================= PHASE 3: TIMERS, R&D, SERVICE, LIVERY, AWARDS, DAILY =================
const tEl=document.createElement('div');tEl.id='toast';document.body.appendChild(tEl);let toastT=0;
function toast(m){tEl.textContent=m;tEl.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>tEl.classList.remove('on'),3200);}
const fmtT=ms=>{const s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),r=s%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`:`${m}:${String(r).padStart(2,'0')}`;};
const upSecs=l=>l<=3?0:Math.round(40*Math.pow(l-3,1.55));
const bays=()=>save.lvl>=5?2:1;
const upOf=k=>save.up.find(u=>u.k===k);
const skipCost=end=>Math.max(1,Math.ceil((end-Date.now())/90000));
const minHp=()=>Math.min(...PARTS.map(k=>save.hp[k]));
const RD=[
 {id:'pu1',b:0,t:1,n:'Fuel Maps',d:'Burn 5% less fuel.',fx:{fuelMul:.95}},
 {id:'pu2',b:0,t:2,n:'Engine Mapping',d:'A little more pace everywhere.',fx:{engB:.0012}},
 {id:'pu3',b:0,t:3,n:'ERS Recovery',d:'ERS recharges faster each lap.',fx:{ersB:4}},
 {id:'pu4',b:0,t:4,n:'Qualifying Mode',d:'Extra pace in qualifying.',fx:{qualB:.006}},
 {id:'tw1',b:1,t:1,n:'Compound Study',d:'Tires wear 6% slower.',fx:{wearMul:.94}},
 {id:'tw2',b:1,t:2,n:'Wet Setup',d:'Less time lost on the wrong tires in rain.',fx:{wetB:.25}},
 {id:'tw3',b:1,t:3,n:'Aero Tuning',d:'A little more pace everywhere.',fx:{engB:.0010}},
 {id:'tw4',b:1,t:4,n:'Tire Master',d:'Tires wear another 8% slower.',fx:{wearMul:.92}},
 {id:'rl1',b:2,t:1,n:'Better Materials',d:'20% fewer failures.',fx:{relMul:.8}},
 {id:'rl2',b:2,t:2,n:'Diagnostics',d:'Failures cost 30% less time.',fx:{dmgMul:.7}},
 {id:'rl3',b:2,t:3,n:'Quick Repair',d:'Service costs 40% less.',fx:{svc:.6}},
 {id:'rl4',b:2,t:4,n:'Bulletproof',d:'Another 30% fewer failures.',fx:{relMul:.7}},
 {id:'cw1',b:3,t:1,n:'Pit Drills',d:'Stops are 0.2s faster.',fx:{pitB:.2}},
 {id:'cw2',b:3,t:2,n:'Launch Control',d:'Better start off the line.',fx:{launchB:.004}},
 {id:'cw3',b:3,t:3,n:'Wheel Guns',d:'Stops are another 0.2s faster.',fx:{pitB:.2}},
 {id:'cw4',b:3,t:4,n:'Fan Club',d:'+10% prize money.',fx:{prize:1.1}}];
const RDBY=Object.fromEntries(RD.map(n=>[n.id,n]));
const RDB=[['POWER UNIT','engine'],['TIRES & WET','tires'],['RELIABILITY','chassis'],['TRACKSIDE','crew']];
const rdCost=t=>({c:[500,1400,3000,5500][t-1],p:[2,4,7,10][t-1],s:[180,480,1200,2700][t-1]});
function rdHtml(){
  const q=save.rdq;
  return `<div class="card"><div class="ch"><span class="t">RESEARCH LAB</span><span class="lbl">${q?'WORKING':'IDLE'}</span></div><div class="cb" style="padding-top:2px"><div class="m" style="font-size:12.5px">One project at a time. Skip the wait with parts. Finished research helps every race.</div></div></div><div class="sp" style="height:10px"></div>`+
  RDB.map(([nm,ic],bi)=>`<div class="card"><div class="ch"><span class="t">${nm}</span><span class="lbl">${RD.filter(n=>n.b===bi&&save.rd[n.id]).length}/4</span></div><div class="cb" style="padding-top:2px">`+
   RD.filter(n=>n.b===bi).map(n=>{const done=!!save.rd[n.id],prev=n.t===1||save.rd[RD.find(x=>x.b===bi&&x.t===n.t-1).id],act=q&&q.id===n.id,c=rdCost(n.t),can=!done&&prev&&!q&&save.credits>=c.c&&save.parts>=c.p;
    return `<div class="rdn ${done?'done':!prev?'lock':''}"><div class="ck">${done?'✓':n.t}</div><div style="flex:1"><b>${n.n}</b><div class="m" style="font-size:12px">${n.d}</div>${!done&&prev&&!act?`<div class="m tmr" style="font-size:11.5px;margin-top:2px">⏱ ${fmtT(c.s*1000)}</div>`:''}</div>
    ${done?'':act?`<button class="btn sm" data-skip="rd" ${save.parts>=skipCost(q.end)?'':'disabled'}><span data-end="${q.end}">${fmtT(q.end-Date.now())}</span> · ${gem}${skipCost(q.end)}</button>`:prev?`<button class="btn sm s2" data-rd="${n.id}" ${can?'':'disabled'}>${money(c.c)} · ${gem}${c.p}</button>`:''}</div>`;}).join('')+`</div></div><div class="sp" style="height:10px"></div>`).join('');
}
function startRd(id){const n=RDBY[id],c=rdCost(n.t);if(save.rdq||save.rd[id]||save.credits<c.c||save.parts<c.p)return;
  if(n.t>1&&!save.rd[RD.find(x=>x.b===n.b&&x.t===n.t-1).id])return;
  save.credits-=c.c;save.parts-=c.p;save.rdq={id,end:Date.now()+c.s*1000};AU.wrench();persist();header();rCar();}
function skipTimer(sp){
  if(sp==='rd'&&save.rdq){const c=skipCost(save.rdq.end);if(save.parts<c)return;save.parts-=c;save.rdq.end=Date.now();}
  else if(sp.startsWith('up:')){const u=upOf(sp.slice(3));if(!u)return;const c=skipCost(u.end);if(save.parts<c)return;save.parts-=c;u.end=Date.now();}
  else return;
  AU.cash();tickTimers();header();if(state==='menu'&&tab==='car')rCar();
}
function tickTimers(){
  let ch=false;const nw=Date.now();
  save.up=save.up.filter(u=>{if(u.end<=nw){save.lv[u.k]=Math.max(save.lv[u.k],u.to);ch=true;toast(PARTINFO[u.k][0]+' is now level '+u.to);return false;}return true;});
  if(save.rdq&&save.rdq.end<=nw){save.rd[save.rdq.id]=1;toast('Research done: '+RDBY[save.rdq.id].n);save.rdq=null;ch=true;}
  if(ch){AU.level();persist();checkAch();header();if(state==='menu'&&tab==='car'){rCar();if($('sheet').classList.contains('on')&&selPart)partSheet(selPart);}}
  else document.querySelectorAll('[data-end]').forEach(el=>{el.textContent=fmtT(+el.dataset.end-nw);});
}
setInterval(tickTimers,1000);
// ---- service
const svcCost=k=>Math.round((100-save.hp[k])*(3+save.lv[k]*1.2)*rdFx().svc/10)*10;
function svcHtml(){
  const tot=PARTS.reduce((a,k)=>a+svcCost(k),0);
  return `<div class="card"><div class="ch"><span class="t">CAR HEALTH</span><span class="lbl">${isFree()?'FREE RACE · NO WEAR':'WEARS EACH RACE'}</span></div><div class="cb" style="padding-top:4px">
  ${PARTS.map(k=>{const h=Math.round(save.hp[k]),col=h>=70?'var(--grn)':h>=40?'#ffb020':'#ff4b5c',c=svcCost(k);return `<div class="li"><div class="ico">${svg(k)}</div><div class="tx"><b>${PARTINFO[k][0]} <span class="lbl" style="margin-left:4px;color:${col}">${h}%${h<60?' · RISK':''}</span></b><div class="hpb" style="margin-top:6px"><i style="width:${h}%;background:${col}"></i></div></div><button class="btn sm s2" data-svc="${k}" ${c>0&&save.credits>=c?'':'disabled'}>${c>0?money(c):'GOOD'}</button></div>`;}).join('')}
  <button class="btn" data-svc="all" style="margin-top:12px" ${tot>0&&save.credits>=tot?'':'disabled'}>${tot>0?'SERVICE ALL · '+money(tot):'ALL PARTS FRESH'}</button>
  <div class="m" style="font-size:12px;margin-top:9px;line-height:1.4">Parts below 60% can fail mid-race, costing lap time. The lower the health, the higher the risk. Reliability research cuts both the risk and the repair bill.</div></div></div>`;
}
function service(k){const ks=k==='all'?PARTS:[k];const tot=ks.reduce((a,x)=>a+svcCost(x),0);if(tot<=0||save.credits<tot)return;save.credits-=tot;ks.forEach(x=>save.hp[x]=100);AU.wrench();persist();header();rCar();}
// ---- livery
const PAL=[0x0e2452,0x1b6ef3,0x14b8d4,0x1f8f4e,0x8bc34a,0xf5c518,0xff7a1a,0xe5252a,0xd81b8c,0x6a40d6,0xf2f2f2,0xaab2bd,0x4a4f58,0x15161a,0x7a4a2b,0xc9a227];
const PATN=['SOLID','STRIPE','SPLIT','HOOPS','SASH'];
function livHtml(){
  const L=save.liv,hx=n=>'#'+n.toString(16).padStart(6,'0');
  return `<div class="card"><div class="ch"><span class="t">PRIMARY COLOR</span></div><div class="cb"><div class="sw">${PAL.map(c=>`<button data-liv="c1:${c}" class="${L.c1===c?'on':''}" style="background:${hx(c)}"></button>`).join('')}</div></div></div><div class="sp" style="height:10px"></div>
  <div class="card"><div class="ch"><span class="t">ACCENT COLOR</span></div><div class="cb"><div class="sw">${PAL.map(c=>`<button data-liv="c2:${c}" class="${L.c2===c?'on':''}" style="background:${hx(c)}"></button>`).join('')}</div></div></div><div class="sp" style="height:10px"></div>
  <div class="card"><div class="ch"><span class="t">PATTERN</span></div><div class="cb"><div class="seg" style="flex-wrap:wrap">${PATN.map((n,i)=>`<button data-liv="pat:${i}" class="${L.pat===i?'on':''}" style="flex:1 0 30%;font-size:13px">${n}</button>`).join('')}</div></div></div>`;
}
function setLiv(spec){const [k,v]=spec.split(':');save.liv[k]=+v;TEAMS[0].c1=save.liv.c1;TEAMS[0].c2=save.liv.c2;rebuildPlayer();persist();AU.click();rCar();}
// ---- awards
const ACH=[
 ['first','First Blood','Finish a season race.',s=>s.races>=1,300,2],
 ['pod','On the Box','Finish on the podium.',s=>s.podiums>=1,500,3],
 ['win','Winner Winner','Win a race.',s=>s.wins>=1,800,5],
 ['win5','Dynasty','Win 5 races.',s=>s.wins>=5,2500,10],
 ['pole','Pole Sitter','Qualify on pole.',s=>s.st.poles>=1,600,3],
 ['rain','Rainmaker','Win a wet race.',s=>s.st.wetWins>=1,1000,6],
 ['fl','Purple Patch','Set a fastest lap.',s=>s.st.fl>=1,500,3],
 ['lv6','Rare Find','Get any part to level 6.',s=>PARTS.some(k=>s.lv[k]>=6),600,4],
 ['lv10','Legendary','Get any part to level 10.',s=>PARTS.some(k=>s.lv[k]>=10),2500,10],
 ['r50','Contender','Reach car rating 50.',s=>rating(s.lv)>=50,900,5],
 ['rd1','Mad Scientist','Finish a research project.',s=>Object.keys(s.rd).length>=1,400,3],
 ['rd8','Tech Lab','Finish 8 research projects.',s=>Object.keys(s.rd).length>=8,2000,8],
 ['spon','Brand Deal','Sign a sponsor.',s=>!!(s.sp.title||s.sp.partner),300,2],
 ['fail','Stuff Happens','Survive a mechanical failure.',s=>s.st.fails>=1,300,2],
 ['tier','Moving Up','Reach the Regional Championship.',s=>s.tier>=1,1500,8],
 ['champ','Champion','Win a championship.',s=>s.titles>=1,3000,15],
 ['own5','Veteran Owner','Reach owner level 5.',s=>s.lvl>=5,1200,6],
 ['str7','Regular','Claim 7 daily bonuses in a row.',s=>s.daily.streak>=7,1000,6]];
const claimables=()=>ACH.filter(a=>save.ach[a[0]]===1).length;
function checkAch(){let n=0;for(const a of ACH){if(!save.ach[a[0]]&&a[3](save)){save.ach[a[0]]=1;n++;toast('Award unlocked: '+a[1]);}}if(n){persist();AU.level();header();}}
function claimAch(id){const a=ACH.find(x=>x[0]===id);if(!a||save.ach[id]!==1)return;save.ach[id]=2;save.credits+=a[4];save.parts+=a[5];AU.cash();persist();header();rTeam();}
function awHtml(){
  const sorted=[...ACH].sort((a,b)=>((save.ach[b[0]]===1)-(save.ach[a[0]]===1))||((save.ach[a[0]]||0)===2)-((save.ach[b[0]]||0)===2));
  return `<div class="card"><div class="ch"><span class="t">AWARDS</span><span class="lbl">${ACH.filter(a=>save.ach[a[0]]).length}/${ACH.length}</span></div><div class="cb" style="padding-top:4px">`+sorted.map(a=>{const st=save.ach[a[0]]||0;
   return `<div class="li" style="${st===2?'opacity:.55':''}"><div class="ico" style="font-size:20px;font-weight:900">${st?'★':'☆'}</div><div class="tx"><b>${a[1]}</b><small>${a[2]}</small></div>${st===1?`<button class="btn sm" data-claim="${a[0]}">${money(a[4])} · ${gem}${a[5]}</button>`:st===2?'<span class="lbl">CLAIMED</span>':`<span class="lbl">${money(a[4])} · ${a[5]}</span>`}</div>`;}).join('')+`</div></div>`;
}
// ---- daily
const DR=[[250,0],[350,1],[450,1],[600,2],[800,2],[1000,3],[2000,6]];
const dstr=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
const todayS=()=>dstr(new Date());
const yestS=()=>{const d=new Date();d.setDate(d.getDate()-1);return dstr(d);};
function dailyState(){const d=save.daily,open=d.last!==todayS(),streak=open?(d.last===yestS()?d.streak:0):d.streak;return{open,streak,next:open?(streak%7):(streak-1)%7};}
function dailyHtml(){
  if(!save.started||save.tut<9)return '';
  const ds=dailyState(),sc=1+(save.lvl-1)*.15;
  if(!ds.open)return `<div class="card"><div class="cb" style="display:flex;align-items:center;gap:12px"><div style="flex:1"><div class="h" style="font-size:15px">DAILY BONUS CLAIMED</div><div class="m" style="font-size:12px">${ds.streak} day streak. Come back tomorrow.</div></div></div></div><div class="sp" style="height:10px"></div>`;
  const r=DR[ds.next];
  return `<div class="card"><div class="ch"><span class="t">DAILY BONUS</span><span class="lbl a">DAY ${ds.next+1} OF 7</span></div><div class="cb"><div class="dly">${DR.map((x,i)=>`<div class="${i<ds.next?'on':i===ds.next?'nx':''}">${i+1}</div>`).join('')}</div>
  <button class="btn" data-daily="1">CLAIM ${money(Math.round(r[0]*sc/10)*10)}${r[1]?' + '+r[1]+' PARTS':''}</button></div></div><div class="sp" style="height:10px"></div>`;
}
function claimDaily(){const ds=dailyState();if(!ds.open)return;const r=DR[ds.next],sc=1+(save.lvl-1)*.15;save.credits+=Math.round(r[0]*sc/10)*10;save.parts+=r[1];save.daily={last:todayS(),streak:ds.streak+1};AU.cash();persist();checkAch();header();rHome();}
// ---- rain overlay
const rainC=$('rain'),rctx=rainC.getContext('2d');let rdrops=null;
function rainFx(w){
  if(w<.05){if(rdrops){rctx.setTransform(1,0,0,1,0,0);rctx.clearRect(0,0,rainC.width,rainC.height);rdrops=null;}return;}
  const W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);
  if(rainC.width!==Math.round(W*dpr)||rainC.height!==Math.round(H*dpr)){rainC.width=Math.round(W*dpr);rainC.height=Math.round(H*dpr);}
  if(!rdrops)rdrops=Array.from({length:240},()=>({x:Math.random()*W,y:Math.random()*H,l:8+Math.random()*16,s:.7+Math.random()*.6}));
  rctx.setTransform(dpr,0,0,dpr,0,0);rctx.clearRect(0,0,W,H);rctx.fillStyle=`rgba(40,52,70,${w*.16})`;rctx.fillRect(0,0,W,H);
  rctx.strokeStyle=`rgba(205,225,255,${.12+w*.3})`;rctx.lineWidth=1.2;rctx.beginPath();
  const n=Math.floor(240*Math.min(1,.15+w));
  for(let i=0;i<n;i++){const d=rdrops[i];rctx.moveTo(d.x,d.y);rctx.lineTo(d.x-d.l*.18,d.y+d.l);d.y+=d.l*d.s*1.6+10;d.x-=d.l*.09;if(d.y>H){d.y=-20;d.x=Math.random()*(W+40);}}
  rctx.stroke();
}
try{tickTimers();}catch(e){}

// ================= TUTORIAL =================
const TUT={
 0:{t:"Welcome to the paddock, Chairman. I'm Dana, your race engineer. Today is a free race. It doesn't count toward any season, so nothing here can hurt you. Your car is the slowest out there. Let's fix that.",next:1},
 1:{t:'Start with the car. Tap CAR.',tgt:'[data-nav=car]',block:1},
 2:{t:'Tap the Power Unit. Straight-line speed wins races.',tgt:'[data-part=engine]',block:1},
 3:{t:'Upgrades cost cash and parts. Racing earns both. Tap UPGRADE.',tgt:'[data-upg=engine]',block:1},
 4:{t:'Faster already. Tap outside the panel to close it.',tgt:'#scrim',block:1,noring:1},
 5:{t:'Now back to HOME.',tgt:'[data-nav=home]',block:1},
 6:{t:'Ready? Tap RACE.',tgt:'[data-act=strat]',block:1},
 7:{t:'Soft tires are fast but wear out. Hard tires last but are slower. Real racing rule: every car must use two different tire types, or it takes a time penalty. So I start you on Mediums and pit on lap 5 for Hards. Scroll down and tap START RACE.',tgt:'[data-act=go]',block:1,scroll:1},
 9:{t:'Free race done. Now the real thing: Season 1 starts here. Sign a sponsor in TEAM, they pay every race. Then upgrade, train your driver, and climb from the Club Series to the World Series.',next:1},
};
let curStep=null,tipT=0;
function hideCoach(){curStep=null;$('coach').classList.add('hide');$('ring').classList.add('hide');}
function showStep(s){curStep=s;$('coach-t').textContent=s.t;$('coach').classList.toggle('race',state==='race');$('coach').classList.remove('hide');$('coach-n').classList.toggle('hide',!s.next);
  if(s.scroll)setTimeout(()=>{const el=document.querySelector(s.tgt);if(el)el.scrollIntoView({block:'center',behavior:'smooth'});},400);}
function tutSet(n){save.tut=n;persist();const s=TUT[n];if(!s){hideCoach();return;}showStep(s);}
function tip(text,tgt,ms){showStep({t:text,tgt});clearTimeout(tipT);tipT=setTimeout(()=>{if(curStep&&curStep.t===text)hideCoach();},ms||6500);}
$('coach-n').onclick=()=>{if(save.tut===0)tutSet(1);else if(save.tut===9){save.tut=99;persist();hideCoach();}};
document.addEventListener('click',e=>{const s=curStep;if(!s||!s.block||e.target.closest('#coach'))return;const t=document.querySelector(s.tgt);if(t&&t.contains(e.target))return;
  e.stopPropagation();e.preventDefault();const c=$('coach');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');},true);
function tutRing(){const r=$('ring');if(!curStep||!curStep.tgt||curStep.noring){r.classList.add('hide');return;}const el=document.querySelector(curStep.tgt);if(!el){r.classList.add('hide');return;}
  const b=el.getBoundingClientRect();if(b.width===0||b.bottom<0||b.top>innerHeight){r.classList.add('hide');return;}
  Object.assign(r.style,{left:(b.left-4)+'px',top:(b.top-4)+'px',width:(b.width+8)+'px',height:(b.height+8)+'px'});r.classList.remove('hide');}
if(save.races>0&&save.tut<99)save.tut=99;if(save.tut>0&&save.tut<9)save.tut=0;

// ================= STRATEGY =================
let qAnim=false;
function forecast(){const nz=Math.max(.05,.28-(save.staff.strat-1)*.025);return wxPlan().slice(1).map((v,i)=>clamp(v+(hr(raceSeed(),i,0,99)-.5)*2*nz*(v>0?1:.25),0,1));}
function wxCard(){
  if(isFree())return '';const f=forecast(),mx=Math.max(...f),nz=Math.round(Math.max(.05,.28-(save.staff.strat-1)*.025)*100);
  return `<div class="card"><div class="ch"><span class="t">FORECAST</span><span class="lbl ${mx>.3?'c':''}">${mx>.5?'RAIN LIKELY':mx>.25?'SHOWERS POSSIBLE':'DRY'} · ±${nz}%</span></div><div class="cb"><div style="display:flex;gap:4px">${f.map((v,i)=>`<div style="flex:1;text-align:center"><div style="height:38px;display:flex;align-items:flex-end;background:rgba(255,255,255,.04);border-radius:5px"><i style="display:block;width:100%;height:${Math.max(3,v*100)}%;background:#4da3ff;border-radius:4px;opacity:${.35+v*.65}"></i></div><small class="m" style="font-size:10px">${i+1}</small></div>`).join('')}</div><div class="m" style="font-size:12px;margin-top:8px">Bars show chance of rain each lap. A better Strategist sharpens the forecast.</div></div></div>`;
}
function qualCard(R,oldGrid){
  if(isFree())return oldGrid;
  if(!hasQual())return oldGrid.replace('YOU START','PROJECTED · YOU START')+`<button class="btn" data-act="qual" style="margin:-4px 0 14px">RUN QUALIFYING</button>`;
  const q=save.qual.o,ok=q[0].id===0,dly=i=>qAnim?(9-i)*.3:0;
  return `<div class="card"><div class="ch"><span class="t">QUALIFYING</span><span class="lbl ${ok?'g':''}">${ok?'POLE POSITION!':'YOU START P'+(q.findIndex(x=>x.id===0)+1)}</span></div><div class="cb" style="padding-top:4px">${q.map((x,i)=>{const t=TEAMS[x.id],nm=x.id===0?save.drv.name:t.drv.name;return `<div style="display:flex;gap:9px;align-items:center;padding:7px 4px;border-top:${i?'1px solid var(--line)':'0'};${x.id===0?'background:rgba(255,106,43,.12);border-radius:8px;':''}animation:qin .35s both;animation-delay:${dly(i)}s"><b style="width:30px">P${i+1}</b><u style="width:4px;height:16px;border-radius:2px;background:${tcol(t)}"></u><span style="flex:1;font-weight:600">${code(nm)} <small class="m">${t.tag}</small></span><span class="m" style="font-variant-numeric:tabular-nums">${i?'+'+(x.t-q[0].t).toFixed(3):fmt(x.t)}</span></div>`;}).join('')}</div></div>`;
}
function runQual(anim){
  useTrack(curTrack());save.qual={k:qKey(),o:qualify(raceSeed(),TEAMS,save.lv,{...cfg(),grid:null})};persist();
  if(anim){qAnim=true;rStrat();for(let i=0;i<10;i++)setTimeout(()=>{if(state==='strat')i<9?AU.beep(1):AU.purple();},(i+1)*300);setTimeout(()=>{qAnim=false;},3600);}
}
function gridCard(R,grid){return `<div class="card"><div class="ch"><span class="t">STARTING GRID</span><span class="lbl">YOU START P${R.cars[0].slot+1}</span></div><div class="cb"><div class="grid">${[0,1,2,3,4].map(i=>[grid[i*2],grid[i*2+1]]).flat().map(c=>`<div class="${c.isPlayer?'me':''}"><b>P${c.slot+1}</b><u style="background:${tcol(c.team)}"></u>${code(c.drv.name)}<span class="m" style="margin-left:auto">${c.team.tag}</span></div>`).join('')}</div></div></div>`;}
function rStrat(){
  const d=curTrack(),s=save.strat;useTrack(d);s.stops=s.stops.filter(x=>x.lap>=2&&x.lap<=LAPS-1).sort((a,b)=>a.lap-b.lap);
  const R=newRace(raceSeed(),TEAMS,save.lv,cfg()),grid=[...R.cars].sort((a,b)=>a.slot-b.slot),{rk}=rankAt(d),tt=traits(d),ob=objRows();
  const rainy=wxPlan().some(v=>v>.2),CL5=rainy?['S','M','H','I','W']:['S','M','H'];
  const oldGrid=gridCard(R,grid);
  const comps=new Set([s.start,...s.stops.map(x=>x.comp)]),wetIn=[...comps].some(c=>COMP[c].id>0);
  let cur=s.start;const cells=[];for(let l=1;l<=LAPS;l++){const st=s.stops.find(x=>x.lap===l);if(st)cur=st.comp;cells.push({l,c:cur,pit:!!st});}
  const life=c=>Math.max(1,Math.round(100/(COMP[c].wear*(1.3-save.drv.care/100*.6)*(1-(save.staff.strat-1)*.025)*d.tr.wear)));
  $('strat').innerHTML=`
  <div class="hdr"><button class="bk" data-act="menu"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><div><div class="lbl a">${isFree()?'FREE RACE':'ROUND '+save.round} · ${d.kind}</div><h1>${d.name}</h1></div></div>
  <div class="sp" style="min-height:118px"></div>
  <div class="card"><div class="cb" style="display:grid;grid-template-columns:110px 1fr;gap:14px;align-items:center">${outline(d).replace('class="trk"','class="trk" style="width:110px;height:78px"')}
    <div><div class="m" style="font-size:12.5px">${d.desc}</div><div class="chips"><span class="chip">${lenMi(d)} MI</span><span class="chip">${tempOf(d)}°F</span><span class="chip">WEAR ${tt.wear}</span><span class="chip">PASSING ${tt.pass}</span></div></div></div>
    <div class="cb" style="padding-top:0"><div class="fit"><div><div class="lbl">TRACK FIT</div><b>${rating(save.lv)}</b></div><div style="flex:1;font-size:13px;font-weight:600">Your car ranks <span class="a">${rk} of 10</span> here.<div class="m" style="font-weight:500;font-size:12px">This track favors ${tt.fav.join(' and ')}.</div></div></div></div></div>
  ${ob?`<div class="card"><div class="ch"><span class="t">SPONSOR GOALS</span></div><div class="cb" style="padding-top:4px">${ob}</div></div>`:''}
  ${wxCard()}${qualCard(R,oldGrid)}
  <div class="card"><div class="ch"><span class="t">START TIRE</span><span class="lbl">FAST LAPS HERE</span></div><div class="cb"><div class="tyres ${rainy?'five':''}">${CL5.map(c=>`<button class="ty ${s.start===c?'on':''}" data-st="${c}" style="--tc:${TC[c]}"><div class="tyre">${c}</div><b class="h" style="font-size:15px">${COMP[c].name}</b><div class="mb"><span>GRIP</span><i style="--w:${c==='S'?100:c==='M'?66:c==='H'?38:c==='I'?55:48}%"></i></div><div class="mb"><span>LIFE</span><i style="--w:${Math.min(100,Math.round(life(c)/13*100))}%"></i></div><div class="lbl" style="margin-top:6px;color:#fff">~${Math.max(1,Math.round(life(c)*.62))} FAST LAPS</div></button>`).join('')}</div></div></div>
  <div class="card"><div class="ch"><span class="t">START FUEL</span><span class="lbl">STOPS REFILL FOR YOU</span></div><div class="cb"><div class="modes">${[[60,'LIGHT','Fast, needs a stop'],[80,'BALANCED','Tight, save a bit'],[100,'FULL','Heavy, no stop']].map(([k,n,dd])=>`<button data-fu="${k}" class="${(s.fuel||100)===k?'on':''}">${n}<small>${dd}</small></button>`).join('')}</div><div class="m" style="font-size:12px;margin-top:9px;line-height:1.4">Fuel burns at its own pace, separate from tires: about 8.5% a lap normally, more in PUSH, less in SAVE. A lighter car is quicker. Run dry and you limp.</div></div></div>
  <div class="card"><div class="ch"><span class="t">PIT PLAN</span><span class="lbl">TAP A LAP TO ADD A STOP</span></div><div class="cb">
    <div class="laps">${cells.map(x=>`<button class="lapc ${x.pit?'pit':''}" data-lap="${x.l}" style="--cc:${TC[x.c]}">${x.l}</button>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;margin-top:10px"><div class="chk"><i style="background:${comps.size>=2||wetIn?'var(--grn)':'var(--red)'}">${comps.size>=2||wetIn?'✓':'!'}</i>${comps.size>=2||wetIn?(wetIn&&comps.size<2?'Rain tires satisfy the rule':'Two tire types used'):`Need two tire types or +${PEN_SIM*TD}s`}</div><div class="chk m">${s.stops.length} STOP${s.stops.length===1?'':'S'}</div></div>
    <div class="m" style="font-size:12px;margin-top:9px;line-height:1.4">Racing rule: every car must use at least two different tire types in a race, or it takes a +${PEN_SIM*TD}s penalty. A stop for the same type does not count. Rain tires (Inter or Wet) satisfy the rule on their own.</div></div></div>
  <div class="card"><div class="ch"><span class="t">OPENING MODE</span></div><div class="cb"><div class="modes">${[['push','PUSH','Fast, eats tires'],['normal','NORMAL','Balanced'],['save','SAVE','Slow, saves tires']].map(([k,n,dd])=>`<button data-md="${k}" class="${s.mode===k?'on':''}">${n}<small>${dd}</small></button>`).join('')}</div></div></div>
  <button class="btn" data-act="go" style="height:60px;font-size:24px">START RACE</button>`;
}
$('strat').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const d=b.dataset,s=save.strat;
  if(d.st)s.start=d.st;else if(d.md)s.mode=d.md;else if(d.fu)s.fuel=+d.fu;
  else if(d.lap){const l=+d.lap;if(l<2||l>LAPS-1)return;const i=s.stops.findIndex(x=>x.lap===l);
    if(i<0){if(s.stops.length<3)s.stops.push({lap:l,comp:'M'});}else{const o=wxPlan().some(v=>v>.2)?['M','H','S','I','W']:['M','H','S'],c=s.stops[i].comp,k=o.indexOf(c);if(k<0||k===o.length-1)s.stops.splice(i,1);else s.stops[i].comp=o[k+1];}}
  else return;
  const sc=$('strat').scrollTop;persist();rStrat();$('strat').scrollTop=sc;
});
function openStrat(){state='strat';$('top').classList.add('hide');$('nav').classList.add('hide');VIEWS.forEach(v=>$('v-'+v).classList.add('hide'));closeSheet();$('strat').classList.remove('hide');$('strat').scrollTop=0;rStrat();controls.enabled=false;controls.autoRotate=true;applyOffset();if(save.tut===6)tutSet(7);}

// ================= RACE =================
const spdC=$('spd'),sctx=spdC.getContext('2d');let streaks=null;
function speedFx(s){
  if(s<.18){if(streaks){sctx.setTransform(1,0,0,1,0,0);sctx.clearRect(0,0,spdC.width,spdC.height);streaks=null;}return;}
  const W=innerWidth,H=innerHeight,dpr=Math.min(2,devicePixelRatio||1);
  if(spdC.width!==Math.round(W*dpr)||spdC.height!==Math.round(H*dpr)){spdC.width=Math.round(W*dpr);spdC.height=Math.round(H*dpr);}
  if(!streaks)streaks=Array.from({length:34},()=>({a:Math.random()*6.283,r:.25+Math.random()*.6,l:.04+Math.random()*.08}));
  sctx.setTransform(dpr,0,0,dpr,0,0);sctx.clearRect(0,0,W,H);const cx=W/2,cy=H*.4,D=Math.hypot(W,H)*.55,k=(s-.18)/.82;
  sctx.lineWidth=1.6;sctx.lineCap='round';
  for(const t of streaks){t.r+=.012+k*.05;if(t.r>1.05){t.r=.25+Math.random()*.15;t.a=Math.random()*6.283;}
    const r0=t.r*D,r1=r0+(t.l+k*.18)*D*t.r,ca=Math.cos(t.a),sa=Math.sin(t.a);
    sctx.strokeStyle=`rgba(255,255,255,${(.05+.2*k)*Math.min(1,t.r*1.4)})`;sctx.beginPath();sctx.moveTo(cx+ca*r0,cy+sa*r0);sctx.lineTo(cx+ca*r1,cy+sa*r1);sctx.stroke();}
}
let race=null,clock=0,playing=false,rate=1,camMode='chase',endTimer=null,tvSpot=-1,snapCam=true,pitComp='M';
const look=new V3(),fwd=new V3(),sd=new V3(),wp=new V3(),tmp=new V3(),birdDir=new V3(0,0,1);
let radioT=0;function radio(m){AU.radio();$('radio-t').textContent=m;$('radio').classList.add('on');clearTimeout(radioT);radioT=setTimeout(()=>$('radio').classList.remove('on'),3400);}
function beginRace(){
  const d=curTrack();
  $('tl').innerHTML=`<div>${outline(d)}<div class="lbl a">${isFree()?'FREE RACE':'ROUND '+save.round} · ${d.loc.toUpperCase()}</div><b style="display:block;margin-top:6px;font-size:30px">${d.name.toUpperCase()}</b><div class="lbl" style="margin-top:10px">LOADING TRACK</div></div>`;
  $('tl').style.opacity=1;$('tl').classList.remove('hide');
  setTimeout(()=>{
    useTrack(d);buildWorld(d,TEAMS);
    clearTimeout(endTimer);endTimer=null;
    race=newRace(raceSeed(),TEAMS,save.lv,cfg());clock=0;playing=false;rate=1;$('rate').textContent='1×';
    race.cars.forEach(c=>{c.lat=c.slot%2?2.2:-2.2;c.v=0;c.warn=false;c.lastPos=c.slot+1;c.hold=undefined;});
    const pl=race.cars[0];pitComp=pl.plan.length?pl.plan[0].comp:(pl.tire.comp==='M'?'H':'M');pl.armComp=pitComp;race.hook=onRaceEvent;
    scene.add(pObj.car);objs.forEach(o=>o.car.visible=true);controls.enabled=false;camMode='chase';snapCam=true;
    if(save.tut===7){save.tut=8;persist();hideCoach();}
    state='race';$('strat').classList.add('hide');$('hud').classList.remove('hide');applyOffset();
    $('h-tsel').innerHTML=(WX.some(v=>v>.2)?['S','M','H','I','W']:['S','M','H']).map(c=>`<button data-ptire="${c}" style="--tc:${TC[c]}">${c}</button>`).join('');
    $('rain').classList.remove('hide');$('spd').classList.remove('hide');setWet(0);
    updControls();drawFrame(0);drawTower();camUpdate(1);
    setTimeout(()=>{$('tl').style.opacity=0;setTimeout(()=>$('tl').classList.add('hide'),500);AU.raceStart();AU.revs();lights();},250);
  },60);
}
function lights(){
  const cd=$('cd'),Ls=[...$('lights').children];Ls.forEach(l=>l.classList.remove('on'));cd.style.display='grid';
  let n=0;const iv=setInterval(()=>{if(n<5){Ls[n].classList.add('on');AU.beep(n++);return;}clearInterval(iv);
    setTimeout(()=>{Ls.forEach(l=>l.classList.remove('on'));cd.style.display='none';playing=true;AU.go();radio('Lights out. Ten cars, one billionaire. Go go go.');if(save.tut===8)tip('This tower is the live order. You are highlighted. Gaps are in seconds.','#tower',6000);},350+((raceSeed()*37)%5)*120);},520);
}
const posOf=(c,t)=>orderAt(race,t).findIndex(x=>x.c===c)+1;
function onBox(car,seg){
  AU.gun();radio(`${(seg.hold*TD).toFixed(1)}s stop. ${COMP[seg.pit.comp].name}s on.${seg.add>1?' Fuel +'+Math.round(seg.add)+'%.':''} Go.`);
  if(save.tut===8)setTimeout(()=>tip(new Set([...car.used,seg.pit.comp]).size>=2?'Two different tire types used, so you beat the racing rule. No penalty.':'Careful: same tire type again. The rule needs two different types.','#h-ring',7000),1500);
}
function onRaceEvent(type,car,tb,s){
  if(!car.isPlayer)return;
  if(type==='fail'){AU.err();radio(`Problem with the ${PARTINFO[s.part][0].toLowerCase()}, Chairman! We are losing time.`);}
  if(type==='lap'&&!car.finished){AU.lap();
    const p=posOf(car,tb);
    if(car.lapsDone>=1&&p!==car.lastPos)radio(p<car.lastPos?`P${p}! Great move. Keep it clean.`:`We've lost a place. P${p}.`);
    car.lastPos=p;
    {const wn=wetAt(car.lapsDone+1),wnx=wetAt(car.lapsDone+2),mis=Math.abs(wn-COMP[car.tire.comp].id);
     if(wnx>wn+.25&&wnx>.3&&!car.rwarn){car.rwarn=1;radio('Rain is coming, Chairman. Think about inters.');}
     if(mis>.4&&car.lapsDone+1<LAPS&&!car.wwarn){car.wwarn=1;radio('Wrong tires for these conditions. Box, box!');}
     if(mis<=.25)car.wwarn=0;}
    if(!car.fwarn&&car.fuel>0&&car.fuel<fuelRate(car,'normal')*2.2&&car.lapsDone<LAPS-1){car.fwarn=true;radio('Fuel is getting low, Chairman. Lift off with SAVE, or box.');}
    if(!car.fdry&&car.fuel<=0&&car.lapsDone<LAPS){car.fdry=true;radio('We are out of fuel! Limp it home.');}
    if(s.pit){car.fwarn=false;car.fdry=false;}
    if(!car.warn&&car.tire.wear>=78){car.warn=true;radio('Tires are gone, Chairman. Box this lap?');}if(s.pit)car.warn=false;
    if(car.lapsDone===LAPS-1)radio('Final lap. Everything you have.');
    if(save.tut===8){if(car.lapsDone===1)tip('PUSH is quicker but burns tires. SAVE is the opposite. Try PUSH for a lap.','[data-mode=push]');else if(car.lapsDone===2)tip('ERS recharges each lap. Tap BOOST to spend it on a faster lap.','#boost');else if(car.lapsDone===3)tip('Our stop is planned next lap. You can also tap BOX any time to pit.','#box');else if(car.lapsDone===5)tip('Fuel burns at its own pace, faster in PUSH. Your stop topped it up for you.','#h-fuelb');}
  }
    if(type==='fl'){AU.purple();}if(type==='fl')radio('Purple sector. Fastest lap. Put it on the invoice.');
  if(type==='finish')radio(`Checkered flag. P${finalOrder(race).indexOf(car)+1}.`);
}
function updControls(){
  const pl=race.cars[0];
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===pl.mode));
  document.querySelectorAll('[data-ptire]').forEach(b=>b.classList.toggle('on',b.dataset.ptire===pitComp));
  const inPit=laneOf(pl),fresh=!!(pl.seg&&pl.seg.pit&&!pl.finished&&!inPit),late=pl.lapsDone+2>=LAPS;
  $('box').disabled=pl.finished||inPit||fresh||(late&&!pl.arm);$('box').classList.toggle('on',pl.arm);$('box').textContent=inPit?'IN PIT':pl.arm?'CANCEL':'BOX';
  const pb=$('pitb'),nm=c=>COMP[c].name.toUpperCase(),need=!ruleMet(pl);let pt='',pc='';
  if(pl.finished){pt='';}
  else if(inPit){pt=`IN THE PITS · ${nm(pl.seg.pit.comp)} GOING ON`+(pl.seg.add>1?` · FUEL +${Math.round(pl.seg.add)}%`:'');pc='pgo';}
  else if(fresh){pt=`FRESH ${nm(pl.seg.pit.comp)} ON · BACK ON TRACK`;pc='pgo';}
  else if(pl.arm){pt=`PITTING NEXT LAP · ${nm(pitComp)} + FUEL`+(need&&pitComp===pl.tire.comp?' · SAME TYPE, RULE NOT MET':'');pc=need&&pitComp===pl.tire.comp?'pwarn':'pgo';}
  else if(pl.stops<pl.plan.length&&pl.lapsDone+2>=pl.plan[pl.stops].lap&&pl.lapsDone+2<LAPS){pt=`PLANNED STOP NEXT LAP · ${nm(pl.plan[pl.stops].comp)}`;pc='pgo';}
  else if(need&&!(pl.stops<pl.plan.length)){pt='RULE: USE A 2ND TIRE TYPE OR +'+(PEN_SIM*TD)+'s';pc='pwarn';}
  pb.textContent=pt;pb.className='pitb '+pc+(pt?' on':'');
  const live=pl.seg&&pl.seg.boost&&!pl.finished;AU.live(!!live);
  $('boost').disabled=pl.finished||(!pl.boostReq&&pl.ers<34&&!live);$('boost').classList.toggle('on',pl.boostReq||live);$('boost').textContent=live?'⚡ LIVE':pl.boostReq?'ARMED':'BOOST';
  $('h-ers').style.width=pl.ers+'%';$('h-ersn').textContent=Math.round(pl.ers);
}
$('hud').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||!race)return;const pl=race.cars[0];
  if(b.dataset.mode){pl.mode=b.dataset.mode;radio(pl.mode==='push'?'Push mode. Give it everything.':pl.mode==='save'?'Save mode. Look after the tires.':'Normal mode. Steady.');}
  else if(b.dataset.ptire){pitComp=b.dataset.ptire;pl.armComp=pitComp;}
  else if(b.id==='box'){if(pl.finished||(pl.seg&&pl.seg.pit))return;pl.arm=!pl.arm;pl.armComp=pitComp;if(pl.arm)radio(`Box, box. ${COMP[pitComp].name}s ready.`);}
  else if(b.id==='boost'){pl.boostReq=!pl.boostReq;if(pl.boostReq)radio('Boost armed for next lap.');}
  else if(b.id==='cam'){camMode={chase:'tv',tv:'bird',bird:'pov',pov:'chase'}[camMode];snapCam=true;tvSpot=-1;applyOffset();}
  else if(b.id==='rate'){rate=rate===1?2:rate===2?4:1;b.textContent=rate+'×';}
  else if(b.id==='skip'){playing=true;while(!race.cars.every(c=>c.finished)){clock+=5;stepRace(race,clock);}drawFrame(0);showResults();return;}
  updControls();
});
let lastTow=0;
function drawTower(){
  const vr=x=>x.c.finished?1e12:(x.c._rd!==undefined?x.c._rd-(x.c.hold||0):x.rd);
  const o=orderAt(race,clock).sort((x,y)=>(vr(y)-vr(x))||(x.ft-y.ft)||(x.c.id-y.c.id));let h=`<div class="hd"><span>${curTrack().short}</span><b>AHEAD</b></div>`;
  o.forEach((x,i)=>{const c=x.c,inPit=laneOf(c);let g;
    if(c.finished)g=i===0?'WIN':'FIN';else if(inPit)g='PIT';else if(i===0)g='LEADER';else g='+'+(Math.max(0,(vr(o[i-1])-vr(x))/N)*TR.P0*c.lf*TD).toFixed(2);
    h+=`<div class="tw ${c.isPlayer?'me':''} ${inPit?'pit':''}"><span class="ps">${i+1}</span><span class="cl" style="background:${tcol(c.team)}"></span><span class="nm">${code(c.drv.name)}</span><span class="gp">${c.seg.boost&&!c.finished?'<span class="bo">⚡</span>':''}${g}</span><span class="tc" style="--tc:${TC[tireNow(c,clock).comp]}">${tireNow(c,clock).comp}</span></div>`;});
  $('tower').innerHTML=h;
}
// ---- car motion: no overlapping cars, lateral dynamics, weight transfer ----
const CL=5.5,CW=2.2,EDGE=HW-1.15;
const laneOf=c=>!c.finished&&c.seg.pit&&c._j!==undefined&&c._j>=0&&c._j*dl<205;
function tireNow(c,t){const s=c.seg;
  if(s.pit&&!c.finished&&(t-s.t0)>=s.arrT+s.hold*.5)return{comp:s.pit.comp,wear:0};
  return{comp:c.tire.comp,wear:Math.min(100,c.tire.wear+(c.finished?0:s.wg*Math.min(1,Math.max(0,(t-s.t0)/s.dur))))};}
const wrapN=d=>{d%=N;if(d>N/2)d-=N;else if(d<-N/2)d+=N;return d;};
const clampL=(v,o)=>THREE.MathUtils.clamp(v,-EDGE-o,EDGE-o);
const offF=jm=>{const i=Math.floor(jm),f=jm-i;return off[i%N]*(1-f)+off[(i+1)%N]*f;};
const klF=jm=>{const i=Math.floor(jm),f=jm-i;return kl[i%N]*(1-f)+kl[(i+1)%N]*f;};
function drawFrame(dt){
  const t=clock,cars=race.cars,DT=Math.max(dt,0),M=THREE.MathUtils;
  for(const c of cars){const seg=c.seg,loc=Math.min(Math.max(t-seg.t0,0),seg.dur);c._j=segNode(seg,loc);
    const a=Math.min(loc,Math.max(seg.dur-.04,0));c._v=Math.abs(segNode(seg,a+.04)-segNode(seg,a))*dl/.04;c._rd=rdAt(c,t);
    if(c.hold===undefined){c._pw=0;c.hold=0;c._jp=undefined;c._djp=undefined;c._dj=c._j;c._pl=c.lat;c._yaw=0;c._pv=c._v;c._pi=0;c._ro=0;c._side=0;}}
  const ord=[...cars].sort((x,y)=>(y._rd-y.hold)-(x._rd-x.hold));
  for(const c of ord){
    const seg=c.seg,jm=(((c._j-c.hold)%N)+N)%N,i0=Math.floor(jm)%N,oi=offF(jm);
    c._pw=0;
    if(seg.pit&&jm*dl<205){const d=jm*dl,w=ss(20,45,d)*(1-ss(155,180,d)),bx=50+11*c.team.idx,wk=1-ss(3,8,Math.abs(d-bx)),lane=PIT_FAST-oi+wk*(PIT_WORK-PIT_FAST),ed=1-Math.exp(-DT*6);
      c._pw=w;if(d<100)c.lat+=w*(lane-c.lat)*ed;else c.lat+=(w*lane+(1-w)*(EDGE-oi)-c.lat)*ed;}
    else{
      let tgt=seg.first?(c.slot%2?1:-1)*2.2*(1-ss(0,40,c._j*dl)):0,blk=null,bd=34;
      for(const o of cars){if(o===c)continue;const dd=wrapN(o._dj-c._dj)*dl;if(dd>-1.5&&dd<bd&&Math.abs(o.lat-c.lat)<CW+.6){bd=dd;blk=o;}}
      if(blk){const po=oi+blk.lat,room=s=>s>0?EDGE-(po+CW+.3):(po-CW-.3)+EDGE;
        let side=c._side||(c.lat>=blk.lat?1:-1);if(room(side)<0)side=-side;c._side=side;tgt=blk.lat+side*(CW+.4);}
      else if(c._side&&bd>=34)c._side=0;
      tgt=clampL(tgt,oi);
      const mx=DT*(1.8+c._v*.045);let nl=clampL(c.lat+M.clamp((tgt-c.lat)*(1-Math.exp(-DT*2.6)),-mx,mx),oi);
      // never steer into a car that is alongside
      for(const o of cars){if(o===c)continue;if(Math.abs(wrapN(o._dj-c._dj))*dl>=CL+.5)continue;const g0=c.lat-o.lat;
        if(Math.abs(g0)>=CW-.05){const sg=Math.sign(g0)||1;if((nl-o.lat)*sg<CW)nl=o.lat+sg*CW;}}
      c.lat=clampL(nl,oi);
    }
    // hard rule: a car can never occupy the same space as the car in front of it
    let req=0;
    for(const o of cars){if(o===c)continue;const dp=wrapN(o._dj-c._dj)*dl;
      if(dp>0&&dp<CL+9&&Math.abs(o.lat-c.lat)<CW){const dd=wrapN(o._dj-c._j)*dl;req=Math.max(req,(CL-dd)/dl);}}
    c.hold=Math.min(90/dl,Math.max(req,c.hold-DT*(c._pw>.3?25:8)/dl,0));c._dj=c._j-c.hold;
  }
  const rds=cars.map(c=>c._rd-c.hold);
  cars.forEach((c,i)=>{
    const seg=c.seg,j=c._dj,jm=((j%N)+N)%N,i0=Math.floor(jm)%N,o=objs[i],f=1-Math.exp(-DT*7),lane=laneOf(c);if(c._vs===undefined)c._vs=c._v;c._vs+=(c._v-c._vs)*(1-Math.exp(-DT*9));const vv=c._vs;
    const latV=DT>0?(c.lat-c._pl)/DT:0;c._pl=c.lat;
    const k=klF(jm),steer=M.clamp(-Math.atan(3.34*k)*1.15,-.38,.38);
    if(DT>0)c._yaw+=(M.clamp(-Math.atan2(latV,Math.max(vv,6)),-.22,.22)+steer*.09-c._yaw)*(1-Math.exp(-DT*8));
    placeObj(o.car,j,c.lat,c._yaw);
    for(const w of o.wheels){w.spin.rotation.x+=vv*DT/.362;if(w.front)w.pivot.rotation.y=M.clamp(steer+c._yaw*.9,-.42,.42);}
    const acc=DT>0?(vv-c._pv)/DT:0;c._pv=vv;
    c._pi+=(M.clamp(-acc*.0011,-.016,.032)-c._pi)*f;c._ro+=(M.clamp(-k*vv*vv*.0007,-.032,.032)-c._ro)*f;
    const edge=!lane&&!trackDef.oval&&Math.abs(offF(jm)+c.lat)>HW-.6&&vv>8;
    o.body.rotation.set(c._pi,0,c._ro+(edge?Math.sin(t*70+i)*.007:0));
    o.body.position.y=-.032*Math.min(1,vv/100)**2+(edge?Math.abs(Math.sin(t*58+i*3))*.016:0);
    {const tn=tireNow(c,t);if(o.stripe&&o.stripe._c!==tn.comp){o.stripe._c=tn.comp;o.stripe.color.set(TC[tn.comp]);}}
    if(i===0&&seg.pit&&c._boxSeg!==seg&&playing&&(t-seg.t0)>=seg.arrT){c._boxSeg=seg;onBox(c,seg);}
    c.v=vv;
    if(i===0){
      fwd.set(0,0,1).applyQuaternion(o.car.quaternion);sd.set(-fwd.z,0,fwd.x).normalize();
      const lat=Math.abs(k)*vv*vv,lim=latAt(vv)*.93,brk=acc<-26&&!lane;
      if(state==='race')AU.drive(vv*2.23694,acc,Math.min(1.5,lat/lim),brk,lane,rate,playing&&!c.finished);
      o.wheels.forEach((w,n)=>{const em=w.front?brk:(lat>lim&&!lane&&!BS[i0]);if(em&&playing&&DT>0){w.pivot.getWorldPosition(wp);wp.y-=.36;skids[n].add(wp,sd,w.front?.16:.2);}else skids[n].cut();});
    }
  });
  {const p0=cars[0];for(let k=1;k<cars.length;k++){const dd=wrapN(rds[k]-rds[0])*dl,pd=cars[k]._pd;if(state==='race'&&pd!==undefined&&DT>0&&Math.sign(pd)!==Math.sign(dd)&&Math.abs(dd)<40&&Math.abs(pd)<40)AU.flyby(cars[k].lat>p0.lat?.7:-.7,Math.abs(p0.v-cars[k].v)+30);cars[k]._pd=dd;}}
  const pl=cars[0];
  $('h-mph').textContent=Math.round(pl.v*2.23694);$('h-lap').textContent=pl.finished?'FIN':`${Math.min(pl.lapsDone+1,LAPS)}/${LAPS}`;
  {const lp=Math.min(LAPS,pl.lapsDone+1),a=wetAt(Math.max(1,lp-1)),b=wetAt(lp),fr=pl.seg?Math.min(1,Math.max(0,(t-pl.seg.t0)/pl.seg.dur)):0,wv=lp===1?b:a+(b-a)*fr;
    speedFx((camMode==='chase'||camMode==='pov')&&playing&&state==='race'?Math.min(1,(pl.v||0)/90):0);setWet(wv);rainFx(wv);AU.rain(state==='race'?wv:0);$('h-wx').textContent=wv>.05?'RAIN '+Math.round(wv*100)+'%':(WX.some(v=>v>.2)?'DRY':'');}
  const tn=tireNow(pl,t),w=tn.wear,life=Math.round(100-w),wc=life>45?TC[tn.comp]:life>22?'#ffb020':'#ff4b5c';
  $('h-ring').style.background=`conic-gradient(${wc} ${life}%,rgba(255,255,255,.08) 0)`;$('h-wear').textContent=life;$('h-comp').textContent=COMP[tn.comp].name.toUpperCase().slice(0,4);
  {const s_=pl.seg,p=Math.min(1,Math.max(0,(t-s_.t0)/s_.dur));let fu=pl.fuel;if(!pl.finished)fu=pl.fuel+(s_.add||0)*ss(0,.1,p)-(s_.fg||0)*(s_.pit?.55:1)*p;fu=Math.max(0,Math.min(100,fu));
   const left=fu/fuelRate(pl,pl.mode);$('h-fuel').style.width=fu+'%';$('h-fueln').textContent=Math.round(fu);$('h-fuell').textContent=pl.finished?'0':left.toFixed(1);$('h-fuelb').classList.toggle('low',left<2);}
  if(performance.now()-lastTow>100){lastTow=performance.now();drawTower();updControls();}
}
const povP=new THREE.Vector3(),povD=new THREE.Vector3(),povS=new THREE.Vector3(0,0,1);
function camUpdate(dt){
  if(camMode!=='pov'&&camera.near<.1){camera.near=.25;camera.updateProjectionMatrix();}
  const o=objs[0].car;fwd.set(0,0,1).applyQuaternion(o.quaternion);fwd.y=0;fwd.normalize();const y0=o.position.y;
  if(camMode==='chase'){
    {const sp=race.cars[0].v||0,fv=58+Math.min(1,sp/90)*22;if(Math.abs(camera.fov-fv)>.05){camera.fov+=(fv-camera.fov)*(1-Math.exp(-dt*3));camera.updateProjectionMatrix();}}
    {const sk=Math.min(1,(race.cars[0].v||0)/90);tmp.copy(o.position).addScaledVector(fwd,-7.2+sk*1.4).setY(y0+2.35-sk*.55);}
    if(snapCam){camera.position.copy(tmp);snapCam=false;}else camera.position.lerp(tmp,1-Math.exp(-dt*7));
    {const sp=Math.min(1,(race.cars[0].v||0)/100);look.copy(o.position).addScaledVector(fwd,5+Math.min(1,(race.cars[0].v||0)/90)*6).setY(y0+.9+(Math.sin(clock*41)*.6+Math.sin(clock*67)*.4)*.018*sp*sp);}camera.lookAt(look);
  }else if(camMode==='pov'){
    const sp=Math.min(1,(race.cars[0].v||0)/90),fv=80+sp*16;if(Math.abs(camera.fov-fv)>.05){camera.fov+=(fv-camera.fov)*(1-Math.exp(-dt*4));camera.updateProjectionMatrix();}
    if(camera.near>.1){camera.near=.05;camera.updateProjectionMatrix();}
    o.updateMatrixWorld(true);povP.set(0,1.0,.12).applyMatrix4(o.matrixWorld);
    povD.set(0,.0,1).transformDirection(o.matrixWorld);
    if(snapCam){povS.copy(povD);snapCam=false;}else povS.lerp(povD,1-Math.exp(-dt*16)).normalize();
    camera.position.copy(povP);look.copy(povP).addScaledVector(povS,20);camera.lookAt(look);
  }else if(camMode==='tv'){
    let best=0,bd=1e9;spots.forEach((p,i)=>{const d=p.distanceToSquared(o.position);if(d<bd){bd=d;best=i;}});
    if(best!==tvSpot){tvSpot=best;camera.position.copy(spots[best]);look.copy(o.position);}
    look.lerp(tmp.copy(o.position).addScaledVector(fwd,race.cars[0].v*.08).setY(y0+.6),1-Math.exp(-dt*10));camera.lookAt(look);
    camera.fov=THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(2*Math.atan(5.5/Math.sqrt(bd))),6,50);camera.updateProjectionMatrix();
  }else{
    if(camera.fov!==50){camera.fov=50;camera.updateProjectionMatrix();}
    birdDir.lerp(fwd,1-Math.exp(-dt*1.5)).normalize();tmp.copy(o.position).addScaledVector(birdDir,-14).setY(y0+42);
    if(snapCam){camera.position.copy(tmp);snapCam=false;}else camera.position.lerp(tmp,1-Math.exp(-dt*4));
    look.copy(o.position).addScaledVector(birdDir,6);camera.lookAt(look);
  }
}

// ================= RESULTS + SEASON =================
let pending=[];
function showResults(){
  playing=false;clearTimeout(endTimer);endTimer=null;hideCoach();
  AU.raceEnd();$('rain').classList.add('hide');$('spd').classList.add('hide');setWet(0);AU.rain(0);const FR=isFree();const d=curTrack(),fo=finalOrder(race),pl=race.cars[0],pos=fo.indexOf(pl)+1,grid=pl.slot+1,gain=Math.max(0,grid-pos),flp=race.fl.car===pl,tm=tierD().mult;
  const bests=[...race.cars].sort((a,b)=>a.best-b.best),bestRank=bests.indexOf(pl)+1;
  const ctx={pos,grid,stops:pl.stops,fl:flp,bestRank,rank:id=>fo.findIndex(c=>c.id===id)+1};
  const lines=[];const L_=(n,v,cls='g')=>lines.push({n,v,cls});
  const fx=rdFx(),poleB=!FR&&hasQual()&&save.qual.o[0].id===0,wetRace=!FR&&WX.some(v=>v>.35),dm=pl.dmg;
  const base=Math.round(PRIZE[pos-1]*tm*fx.prize);L_(`Prize money P${pos}`,base);
  if(gain)L_(`Places gained ×${gain}`,Math.round(40*gain*tm));
  if(flp)L_('Fastest lap',Math.round(150*tm));
  if(poleB)L_('Pole position',Math.round(120*tm));
  const com=FR?0:Math.round(lines.reduce((s,x)=>s+x.v,0)*(save.staff.com-1)*.06);if(com)L_('Commercial bonus',com);
  const spEnd=[];
  for(const slot of FR?[]:['title','partner']){const c=save.sp[slot];if(!c)continue;const sp=SBYID[c.id],o=objective(slot);L_(`${sp.name} fee`,spPay(sp,slot));
    const ok=o.t(ctx);lines.push({n:`${o.txt}`,v:ok?o.bonus:0,cls:ok?'gr':'m',goal:1,ok});c.left--;if(c.left<=0){spEnd.push(sp.name);save.sp[slot]=null;}}
  if(FR)L_('Free race bonus',1000);else L_(`Driver salary`,-save.drv.sal,'rd');
  const cred=lines.reduce((s,x)=>s+x.v,0),parts=PPRT[pos-1]+(flp?1:0)+(poleB?1:0),xp=40+(11-pos)*12+(pos===1?50:0);
  if(!FR)fo.forEach((c,i)=>{save.pts[c.id]+=PTS[i]+(race.fl.car===c?1:0);});
  save.credits+=cred;save.parts+=parts;
  if(FR)save.freeDone=true;else{save.races++;if(pos===1)save.wins++;if(pos<=3)save.podiums++;save.results[save.round-1]=pos;
  TEAMS.slice(1).forEach(t=>save.aiB[t.id]=(save.aiB[t.id]||0)+(t.pers==='sloppy'?.18:t.pers==='aggressive'?.14:.1));}
  if(!FR){if(flp)save.st.fl++;if(poleB)save.st.poles++;if(pos===1&&wetRace)save.st.wetWins++;if(dm)save.st.fails++;
    PARTS.forEach((k,ix)=>{const loss=(4+hr(raceSeed(),ix,0,55)*5)*Math.max(.6,1-(save.lv[k]-3)*.04);save.hp[k]=Math.max(5,save.hp[k]-loss);});
    if(dm)save.hp[dm.part]=Math.min(save.hp[dm.part],28);}
  save.xp+=xp;pending=[];
  while(save.xp>=xpNeed(save.lvl)){save.xp-=xpNeed(save.lvl);save.lvl++;const bc=400*save.lvl;save.credits+=bc;save.parts+=4;pending.push({h:`<div class="lbl c">OWNER LEVEL UP</div><div class="big pop">${save.lvl}</div><div class="m" style="margin:8px 0 4px">Staff can now reach level ${Math.min(10,save.lvl+1)}.</div><div class="cost"><span class="g">${coin}${money(bc)}</span><span class="c">${gem}+4</span></div>`});}
  if(spEnd.length)pending.push({h:`<div class="lbl a">SPONSOR DEAL ENDED</div><div class="h" style="font-size:28px;margin:8px 0">${spEnd.join(' & ')}</div><div class="m">Their contract is up. New offers are waiting in TEAM.</div>`});
  const myPts=FR?0:PTS[pos-1]+(flp?1:0),roundNo=save.round;
  if(!FR){if(save.round>=10)seasonEnd();else save.round++;}
  checkAch();syncTeams();persist();newsI++;
  const p3=[fo[1],fo[0],fo[2]];
  $('result').innerHTML=`
  <div class="sp" style="min-height:150px"></div>
  <div class="lbl a">${FR?'FREE RACE':'ROUND '+roundNo} · ${d.name.toUpperCase()}</div>
  <div style="display:flex;align-items:flex-end;gap:14px"><div class="big pop">P${pos}</div><div style="padding-bottom:8px;font-weight:600;line-height:1.3">${QUOTES[pos-1]}<div class="lbl" style="margin-top:5px">STARTED P${grid} · BEST ${pl.best<1e8?fmt(pl.best):'—'} · ${FR?'NO POINTS':'+'+myPts+' PTS'}</div></div></div>
  <div class="pod">${p3.map((c,i)=>`<div class="p${[2,1,3][i]}" style="${c.isPlayer?'box-shadow:inset 0 0 0 2px var(--a)':''}"><small>P${[2,1,3][i]}</small><b>${code(c.drv.name)}</b><small>${c.team.tag}</small></div>`).join('')}</div>
  <div class="card"><div class="ch"><span class="t">OWNER'S PAYOUT</span></div><div class="cb" style="padding-top:4px">
    ${lines.map(x=>`<div class="rw"><span style="${x.goal?'font-size:13px':''}">${x.goal?(x.ok?'✓ ':'✗ '):''}${x.n}</span><b class="${x.cls}">${x.v>=0?'+':''}${money(x.v)}</b></div>`).join('')}
    <div class="tot"><span class="h" style="font-size:17px">TOTAL</span><b class="${cred>=0?'g':'rd'}">${money(cred)}</b></div>
    <div class="rw" style="margin-top:4px"><span>Parts</span><b class="c">+${parts}</b></div><div class="rw"><span>Owner XP</span><b class="c">+${xp}</b></div>
    ${pl.pen?`<div class="rw"><span>Tire rule penalty</span><b class="rd">+${PEN_SIM*TD}s</b></div>`:''}${dm?`<div class="rw"><span>Failure: ${PARTINFO[dm.part][0]}</span><b class="rd">SERVICE NEEDED</b></div>`:''}${wetRace?`<div class="rw"><span>Weather</span><b class="c">WET RACE</b></div>`:''}</div></div>
  <div class="card"><div class="ch"><span class="t">CLASSIFICATION</span></div><div class="cb" style="padding-top:4px"><table class="tb">${fo.map((c,i)=>`<tr class="${c.isPlayer?'me':''}"><td class="p">${i+1}</td><td class="cbar"><i style="background:${tcol(c.team)}"></i></td><td><b>${c.drv.name}</b> <small class="m">${c.team.tag}</small></td><td class="pt" style="font-weight:600;font-size:14px">${i===0?fmt(c.finishT):c.lapsDone<LAPS?`+${LAPS-c.lapsDone} LAP`:'+'+((c.finishT+c.pen-fo[0].finishT)*TD).toFixed(3)}</td><td class="pt g" style="width:36px">${PTS[i]?'+'+PTS[i]:''}</td></tr>`).join('')}</table></div></div>
  <button class="btn" data-act="cont">CONTINUE</button>`;
  AU.finish(pos);setTimeout(()=>AU.cash(),900);state='result';$('hud').classList.add('hide');$('result').classList.remove('hide');$('result').scrollTop=0;camMode='tv';applyOffset();
}
function seasonEnd(){
  const st=standings(),me=st.findIndex(x=>x.t.id===0)+1,prize=Math.round(SPRIZE[me-1]*tierD().mult),parts=20-me;
  save.credits+=prize;save.parts+=parts;if(me===1)save.titles++;
  const promo=me<=3&&save.tier<3,old=tierD().n;
  pending.push({h:`<div class="lbl a">SEASON ${save.season} COMPLETE</div><div class="big pop">P${me}</div><div class="m" style="margin:8px 0">${me===1?`${old} champions. The trust fund is impressed.`:`${st[0].t.id===0?'':st[0].t.name} took the title.`}${promo?`<br><b class="a">PROMOTED TO THE ${TIERS[save.tier+1].n.toUpperCase()}</b>`:''}</div><div class="cost"><span class="g">${coin}${money(prize)}</span><span class="c">${gem}+${parts}</span></div>`});
  if(promo){save.tier++;save.aiB=Array(10).fill(0);}else save.aiB=save.aiB.map(v=>v*.5);
  // driver development
  const d=save.drv;d.age++;
  for(const[k]of DSTAT){if(d.age<=25)d[k]=Math.min(Math.max(d.pot,d[k]),d[k]+1+Math.floor(Math.random()*3));else if(d.age>=32)d[k]=Math.max(30,d[k]-Math.floor(Math.random()*3));}
  d.con--;
  if(d.con<=0){const ns=salFor(drvOvr(d),save.tier);pending.push({h:`<div class="lbl a">CONTRACT EXPIRED</div><div class="h" style="font-size:28px;margin:8px 0">${d.name}</div><div class="m">OVR ${drvOvr(d)}, age ${d.age}. Wants ${money(ns)} per race for two more seasons.</div>`,btns:[['RENEW','',()=>{save.drv.con=2;save.drv.sal=ns;persist();}],['RELEASE','s2',()=>{save.drv={name:'Sam Rourke',age:19,pace:50,cons:48,care:50,ovr:46,wet:45,pot:72,sal:60,con:1};persist();}]]});}
  save.season++;save.round=1;save.pts=Array(10).fill(0);save.results=[];save.mkt=null;
}
function nextModal(){
  const m=pending.shift();if(!m){$('modal').classList.add('hide');toGarage();objs.forEach((o,i)=>{if(i)o.car.visible=false;});showMenu('home');return;}
  const btns=m.btns||[['COLLECT','',null]];
  $('modal').innerHTML=`<div class="card pop"><div class="cb">${m.h}<div style="display:flex;gap:8px;margin-top:14px">${btns.map((b,i)=>`<button class="btn ${b[1]}" data-mb="${i}">${b[0]}</button>`).join('')}</div></div></div>`;
  $('modal').classList.remove('hide');$('modal').onclick=e=>{const b=e.target.closest('[data-mb]');if(!b)return;const f=btns[+b.dataset.mb][2];if(f)f();nextModal();};
}

// ================= STORY / ACTIONS =================
const SLIDES=[['01','YOU SOLD<br>THE COMPANY.','$4.7 billion, wired on a Tuesday. Your accountant cried. Your yacht got a sibling.'],['02','YOU GOT<br>BORED.','Three weeks of sunsets and shrimp. Then a race came on the TV in a marina bar.'],['03','YOU BOUGHT<br>A TEAM.','Last place in the Club Series. Dented car. A pit crew with one working impact wrench. Perfect.'],['04','THERE IS<br>A CATCH.','Your board locked the fortune in a trust. This team only spends what it earns on track. Climb all the way to the World Series.']];
let si=0;
function storyShow(){const s=SLIDES[si];$('story-b').innerHTML=`<div class="n">${s[0]} / 04</div><h2 class="pop">${s[1]}</h2><p>${s[2]}</p>`;$('story-d').innerHTML=SLIDES.map((_,i)=>`<i class="${i<=si?'on':''}"></i>`).join('');}
$('story').addEventListener('click',e=>{if(e.target.closest('.sk')||si>=SLIDES.length-1){$('story').classList.add('hide');$('intro').classList.remove('hide');state='intro';applyOffset();}else{si++;storyShow();}});
document.body.addEventListener('click',e=>{
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act;
  if(act==='buy'){const n=($('tname').value.trim()||'Apex Garage').slice(0,18);save.team=n;const l=n.replace(/[^A-Za-z]/g,'').toUpperCase();save.tag=l.length>=3?l.slice(0,3):'APX';save.started=true;persist();syncTeams();buildGarage(save.team,TEAMS[0].c1,TEAMS[0].c2);rebuildPlayer();showMenu('home');}
  else if(act==='strat')openStrat();
  else if(act==='menu')showMenu(tab);
  else if(act==='qual')runQual(true);
  else if(act==='go'){if(!isFree()&&!hasQual()){useTrack(curTrack());runQual(false);}beginRace();}
  else if(act==='cont'){$('result').classList.add('hide');if(save.tut===8){save.tut=9;persist();}nextModal();}
});

// ================= SPLASH =================
[...document.querySelectorAll('#load .sp-l i')].forEach((l,i)=>setTimeout(()=>l.classList.add('on'),700+i*380));
function splashReady(){const l=$('load');if(!l)return;
  setTimeout(()=>{l.classList.add('ready');$('sp-tap').textContent='TAP TO START';
    l.addEventListener('click',()=>{if(l.classList.contains('go'))return;l.classList.add('go');AU.unlock();setTimeout(()=>AU.launch(),90);
      setTimeout(()=>{l.style.opacity=0;setTimeout(()=>l.remove(),600);},800);});},Math.max(0,2700-performance.now()));
}
// ================= LOOP =================
let last=performance.now(),frames=0,fpsT=0,first=true,lowT=0;
function frame(now){
  const dt=Math.min((now-last)/1000,1/30);last=now;frames++;fpsT+=dt;
  if(fpsT>1){const f=frames/fpsT;$('fps').textContent=Math.round(f)+' FPS';if(f<48&&pr>1){if(++lowT>=2){pr=Math.max(1,pr-.25);renderer.setPixelRatio(pr);lowT=0;}}else lowT=0;frames=0;fpsT=0;}
  const onTrack=(state==='race'||state==='result')&&race;
  if(onTrack){
    if(playing&&state==='race'){clock+=dt*rate;stepRace(race,clock);}else if(state==='result'){clock+=dt;stepRace(race,clock);}
    drawFrame(state==='race'?(playing?dt*rate:0):dt);camUpdate(dt);
    if(state==='race'&&!endTimer&&race.cars.every(c=>c.finished))endTimer=setTimeout(showResults,2600);
    sunL.target.position.copy(pObj.car.position);sunL.position.copy(pObj.car.position).addScaledVector(sun,90);
    renderer.render(scene,camera);
  }else{
    if(focus){const k=1-Math.exp(-dt*5);camera.position.lerp(focus.pos,k);controls.target.lerp(focus.target,k);if(camera.position.distanceTo(focus.pos)<.05)focus=null;}
    controls.update();renderer.render(gscene,camera);
  }
  tutRing();
  if(first){first=false;splashReady();}
  requestAnimationFrame(frame);
}
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();applyOffset();});
menuCam();
if(save.started)showMenu('home');
else{state='story';$('story').classList.remove('hide');storyShow();controls.enabled=false;applyOffset();}
requestAnimationFrame(frame);

$('dk').addEventListener('click',()=>$('hud').classList.toggle('open'));
