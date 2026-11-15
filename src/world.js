// ================= WORLD =================
const V3=THREE.Vector3;
let seed=315;
const rand=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
let pr=Math.min(devicePixelRatio,2);
renderer.setPixelRatio(pr);renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
document.body.prepend(renderer.domElement);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.25,3200);
const maxAniso=renderer.capabilities.getMaxAnisotropy();
const pmrem=new THREE.PMREMGenerator(renderer);

function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=maxAniso;return t;}
function noise(g,w,h,amt){const id=g.getImageData(0,0,w,h),d=id.data;for(let i=0;i<d.length;i+=4){const n=(rand()-.5)*amt;d[i]+=n;d[i+1]+=n;d[i+2]+=n;}g.putImageData(id,0,0);}
const asphaltTex=canvasTex(512,512,(g,w,h)=>{
  g.fillStyle='#74777d';g.fillRect(0,0,w,h);noise(g,w,h,46);
  for(let i=0;i<14;i++){g.fillStyle=`rgba(${rand()<.5?'40,42,46,.22':'150,152,156,.18'})`;g.save();g.translate(rand()*w,rand()*h);g.rotate(rand()*3);g.fillRect(-20-rand()*50,-8,40+rand()*100,10+rand()*26);g.restore();}
  g.strokeStyle='rgba(30,30,34,.35)';g.lineWidth=1.5;for(let i=0;i<6;i++){g.beginPath();let x=rand()*w,y=rand()*h;g.moveTo(x,y);for(let k=0;k<6;k++){x+=(rand()-.5)*40;y+=rand()*30;g.lineTo(x,y);}g.stroke();}
  for(let i=0;i<900;i++){g.fillStyle=`rgba(${rand()<.5?'20,20,22':'120,122,128'},${.25+rand()*.3})`;g.fillRect(rand()*w,rand()*h,1.5,1.5);}
  const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.35,'rgba(0,0,0,.08)');gr.addColorStop(.65,'rgba(0,0,0,.08)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);
});
const rubTex=canvasTex(64,512,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);for(let x=0;x<w;x++){const d=Math.abs(x/(w-1)-.5)*2,a=Math.pow(Math.max(0,1-d),1.6);for(let y=0;y<h;y+=2){const n=.75+rand()*.5;const c=Math.round(255*Math.min(1,a*n));g.fillStyle=`rgb(${c},${c},${c})`;g.fillRect(x,y,1,2);}}
  for(let i=0;i<26;i++){const x=w*.2+rand()*w*.6,y=rand()*h,l=40+rand()*160;const gr=g.createLinearGradient(0,y,0,y+l);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.5)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(x,y,1.5+rand()*2,l);}});
rubTex.colorSpace=THREE.NoColorSpace;
const blobTex=canvasTex(128,256,(g,w,h)=>{g.save();g.scale(1,h/w);const gr=g.createRadialGradient(w/2,w/2,2,w/2,w/2,w/2);gr.addColorStop(0,'rgba(0,0,0,.8)');gr.addColorStop(.55,'rgba(0,0,0,.5)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,w,w);g.restore();});
const blobGeo=new THREE.PlaneGeometry(2.5,5.9).rotateX(-Math.PI/2);blobGeo.userData.keep=1;
const curbTex=canvasTex(16,128,(g,w,h)=>{g.fillStyle='#d8262b';g.fillRect(0,0,w,h/2);g.fillStyle='#f4f4f4';g.fillRect(0,h/2,w,h/2);});
const wallTex=canvasTex(128,256,(g,w,h)=>{g.fillStyle='#e9ecf0';g.fillRect(0,0,w,h);g.fillStyle='#d62828';g.fillRect(0,0,w*.18,h);g.fillStyle='#1c2a58';g.fillRect(w*.18,0,w*.1,h);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,0,w,2);});
const checkerTex=canvasTex(128,16,(g,w,h)=>{for(let x=0;x<16;x++)for(let y=0;y<2;y++){g.fillStyle=(x+y)%2?'#111':'#f5f5f5';g.fillRect(x*8,y*8,8,8);}});checkerTex.magFilter=THREE.NearestFilter;
const fenceTex=canvasTex(64,64,(g,w,h)=>{g.clearRect(0,0,w,h);g.strokeStyle='rgba(200,205,215,.85)';g.lineWidth=2;for(let i=-64;i<128;i+=12){g.beginPath();g.moveTo(i,0);g.lineTo(i+64,64);g.stroke();g.beginPath();g.moveTo(i+64,0);g.lineTo(i,64);g.stroke();}g.fillStyle='#9aa0a8';g.fillRect(0,0,w,3);});
const winTex=canvasTex(64,128,(g,w,h)=>{g.fillStyle='#1b2230';g.fillRect(0,0,w,h);for(let y=3;y<h;y+=8)for(let x=3;x<w;x+=6){const r=rand();g.fillStyle=r<.18?'#f3d9a0':r<.55?'#3a4d6c':'#26324a';g.fillRect(x,y,4,5);}});
const crowdTex=canvasTex(1024,64,(c,w,h)=>{c.fillStyle='#2a2f3a';c.fillRect(0,0,w,h);const cols=['#ff5a1f','#f2f2f2','#2a6df4','#ffd23f','#e63946','#1fb5a8','#111','#b22234','#3c3b6e'];for(let i=0;i<2800;i++){c.fillStyle=cols[(rand()*cols.length)|0];c.fillRect(rand()*w,rand()*h,2.5,3);}});
const gTexCache={};
function groundTexFor(th){const k=th.g.join();if(!gTexCache[k]){const t=canvasTex(256,256,(g,w,h)=>{g.fillStyle=th.g[0];g.fillRect(0,0,w,h/2);g.fillStyle=th.g[1];g.fillRect(0,h/2,w,h/2);noise(g,w,h,22);});t.repeat.set(140,140);gTexCache[k]=t;}return gTexCache[k];}

// ---------- themes ----------
const THEMES={
 park:{g:['#4f8c3b','#467f35'],elev:34,az:140,turb:4.5,fog:0xc6d6e4,hemiG:0x45623a,veg:[['cone',.55],['ball',.45]],dens:380,temp:75},
 desert:{g:['#c9a06a','#bf955f'],elev:52,az:200,turb:7,fog:0xe9dbc6,hemiG:0x9c7a4f,veg:[['cactus',.55],['rock',.45]],dens:240,temp:98},
 city:{g:['#73767d','#6d7077'],elev:30,az:110,turb:5,fog:0xbcc6d2,hemiG:0x555a60,veg:[['ball',1]],dens:40,city:1,temp:72},
 forest:{g:['#3f7a33','#3a722f'],elev:30,az:160,turb:3.5,fog:0xb7cbd6,hemiG:0x34502b,veg:[['cone',.9],['ball',.1]],dens:760,temp:64},
 coast:{g:['#6a9e4b','#629645'],elev:40,az:240,turb:3.2,fog:0xd2e3ee,hemiG:0x4f7040,veg:[['palm',.8],['ball',.2]],dens:200,ocean:1,temp:78},
 speedway:{g:['#4f8c3b','#467f35'],elev:38,az:150,turb:4.2,fog:0xc8d8e6,hemiG:0x45623a,veg:[['ball',.6],['cone',.4]],dens:170,temp:80},
 dusk:{g:['#4b7a3a','#456f35'],elev:9,az:255,turb:9,ray:2.2,fog:0xe6c3a0,hemiG:0x5a4a3a,veg:[['ball',1]],dens:90,city:1,temp:84},
};

// ---------- track scene ----------
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xc6d6e4,260,1700);
const hemi=new THREE.HemisphereLight(0xd2e4ff,0x45623a,.55);scene.add(hemi);
const sunL=new THREE.DirectionalLight(0xfff0dc,3);sunL.castShadow=true;sunL.shadow.mapSize.set(2048,2048);
Object.assign(sunL.shadow.camera,{left:-16,right:16,top:16,bottom:-16,near:1,far:240});sunL.shadow.bias=-.0004;sunL.shadow.normalBias=.03;
scene.add(sunL,sunL.target);
const sun=new V3(0,1,0);let skyMesh=null;
function makeSky(th){const s=new Sky();s.scale.setScalar(2200);const u=s.material.uniforms;u.turbidity.value=th.turb;u.rayleigh.value=th.ray||1.3;u.mieCoefficient.value=.004;u.mieDirectionalG.value=.86;u.sunPosition.value.copy(sun);return s;}
function setSky(th){
  sun.setFromSphericalCoords(1,THREE.MathUtils.degToRad(90-th.elev),THREE.MathUtils.degToRad(th.az));
  if(skyMesh){scene.remove(skyMesh);skyMesh.material.dispose();}
  skyMesh=makeSky(th);scene.add(skyMesh);
  const es=new THREE.Scene(),sk=makeSky(th),gp=new THREE.Mesh(new THREE.PlaneGeometry(4000,4000).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:new THREE.Color(th.g[0]).multiplyScalar(.7)}));
  gp.position.y=-2;es.add(sk,gp);
  if(scene.environment)scene.environment.dispose();scene.environment=pmrem.fromScene(es,.02).texture;
  sk.material.dispose();gp.geometry.dispose();gp.material.dispose();
  scene.fog.color.set(th.fog);hemi.groundColor.set(th.hemiG);
  sunL.color.set(th.elev<15?0xffc58a:0xfff0dc);sunL.intensity=th.elev<15?2.6:3;
  renderer.toneMappingExposure=th.elev<15?1.0:.9;
  WB={exp:renderer.toneMappingExposure,sun:sunL.intensity,fogN:scene.fog.near,fogF:scene.fog.far,fog:new THREE.Color(th.fog)};setWet(0);
}
let WB=null,ROADM=null,_wv=-1;
const WGREY=new THREE.Color(0x6d7783);
function setWet(w){
  if(!WB||Math.abs(w-_wv)<.004)return;_wv=w;
  renderer.toneMappingExposure=WB.exp*(1-.2*w);sunL.intensity=WB.sun*(1-.6*w);
  scene.fog.near=WB.fogN*(1-.55*w);scene.fog.far=WB.fogF*(1-.5*w);scene.fog.color.copy(WB.fog).lerp(WGREY,.6*w);
  if(ROADM){ROADM.roughness=.9-.62*w;ROADM.color.setScalar(1-.4*w);}
}

// ---------- track data ----------
const N=1200,HW=6.5,VMAX=102.8,ALAT=40,ACC=11,BRK=30;
// aero model: traction/power-limited accel minus drag, downforce-scaled braking and grip (m/s^2)
const accAt=v=>Math.min(11,940/Math.max(v,1))-8.65e-4*v*v;
const brkAt=v=>17+3.4e-3*v*v;
const latAt=v=>20+2.6e-3*v*v;
let C,S,T,L,ds,kc,kw,BS,off,P,PT,LL,dl,kl,V,cumT,trackDef=null,spots=[];
const smooth=(a,r)=>a.map((_,i)=>{let s=0;for(let k=-r;k<=r;k++)s+=a[(i+k+a.length)%a.length];return s/(2*r+1);});
function loadTrack(def){
  const curve=new THREE.CatmullRomCurve3(def.pts.map(([x,z])=>new V3(x,0,z)),true,'centripetal');curve.arcLengthDivisions=4000;
  C=curve.getSpacedPoints(N);C.pop();L=curve.getLength();ds=L/N;T=[];S=[];
  for(let i=0;i<N;i++){const t=C[(i+1)%N].clone().sub(C[(i-1+N)%N]).normalize();T.push(t);S.push(new V3(-t.z,0,t.x));}
  kc=smooth(C.map((_,i)=>T[(i+1)%N].clone().sub(T[(i-1+N)%N]).dot(S[i])/(2*ds)),3);
  kw=smooth(kc,26);
  const bm=def.bank||0;BS=smooth(kw.map(k=>Math.abs(k)>.0022?Math.sign(k)*bm:0),40);
  off=smooth(kw.map(k=>THREE.MathUtils.clamp(k*260,-HW+1.4,HW-1.4)),18);
  const lc=new THREE.CatmullRomCurve3(C.map((p,i)=>p.clone().addScaledVector(S[i],off[i])),true);lc.arcLengthDivisions=6000;
  P=lc.getSpacedPoints(N);P.pop();LL=lc.getLength();dl=LL/N;
  PT=P.map((_,i)=>P[(i+1)%N].clone().sub(P[(i-1+N)%N]).normalize());
  kl=smooth(P.map((_,i)=>{const t=PT[i];return PT[(i+1)%N].clone().sub(PT[(i-1+N)%N]).dot(new V3(-t.z,0,t.x))/(2*dl);}),4);
  V=kl.map((k,i)=>{const den=Math.abs(k)-2.6e-3,bk=9.8*Math.tan(Math.abs(BS[i]))*1.6;return den<=1e-6?VMAX:Math.min(VMAX,Math.sqrt((20+bk)/den));});
  for(let it=0;it<4;it++){
    for(let i=0;i<N;i++){const j=(i-1+N)%N;V[i]=Math.min(V[i],Math.sqrt(V[j]**2+2*Math.max(.3,accAt(V[j]))*dl));}
    for(let i=N-1;i>=0;i--){const j=(i+1)%N;V[i]=Math.min(V[i],Math.sqrt(V[j]**2+2*brkAt(V[j])*dl));}
  }
  cumT=new Float64Array(N+1);for(let j=0;j<N;j++)cumT[j+1]=cumT[j]+2*dl/(V[j]+V[(j+1)%N]);
  trackDef=def;
  setTrack({N,dl,V,cumT,P0:cumT[N],ACC,BRK,tm:def.tr.tm,wear:def.tr.wear,ovk:def.tr.ovk});
}
const bankY=(i,o)=>{const b=BS[i];if(!b)return 0;return Math.max(0,HW*Math.tan(Math.abs(b))-o*Math.tan(b));};

// ---------- vegetation geometry ----------
const vegCache={};
function colGeo(g,c){g=g.index?g.toNonIndexed():g;const col=new THREE.Color(c),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=col.r;a[i*3+1]=col.g;a[i*3+2]=col.b;}g.setAttribute('color',new THREE.BufferAttribute(a,3));g.deleteAttribute('uv');return g;}
function vegGeo(k){
  if(vegCache[k])return vegCache[k];let parts;
  if(k==='cone')parts=[colGeo(new THREE.CylinderGeometry(.25,.35,2.4,6).translate(0,1.2,0),0x4a3626),colGeo(new THREE.ConeGeometry(2.6,7.5,8).translate(0,6.1,0),0x2f5e2c)];
  else if(k==='ball')parts=[colGeo(new THREE.CylinderGeometry(.3,.4,2.6,6).translate(0,1.3,0),0x4a3626),colGeo(new THREE.IcosahedronGeometry(3.2,1).translate(0,5,0),0x3f7434)];
  else if(k==='cactus')parts=[colGeo(new THREE.CylinderGeometry(.45,.5,6,8).translate(0,3,0),0x5b8a45),colGeo(new THREE.CylinderGeometry(.3,.3,2.2,7).translate(1.1,4,0),0x5b8a45),colGeo(new THREE.CylinderGeometry(.3,.3,1.2,7).rotateZ(Math.PI/2).translate(.6,2.9,0),0x5b8a45),colGeo(new THREE.CylinderGeometry(.28,.28,1.8,7).translate(-1,3.6,0),0x5b8a45),colGeo(new THREE.CylinderGeometry(.28,.28,1,7).rotateZ(Math.PI/2).translate(-.5,2.7,0),0x5b8a45)];
  else if(k==='rock')parts=[colGeo(new THREE.IcosahedronGeometry(2.2,0).scale(1.3,.6,1).translate(0,.8,0),0x9a7552)];
  else{parts=[colGeo(new THREE.CylinderGeometry(.22,.34,10,6).translate(0,5,0),0x7a5b3a)];for(let i=0;i<7;i++){const a=i/7*Math.PI*2;parts.push(colGeo(new THREE.ConeGeometry(.55,5,4).scale(1,1,.25).translate(0,2.5,0).rotateZ(-1.9).rotateY(a).translate(0,9.8,0),0x3d7a2e));}}
  return vegCache[k]=mergeGeometries(parts);
}

// ---------- build world ----------
let world=null;
function disposeWorld(){if(!world)return;scene.remove(world);world.traverse(o=>{if(o.geometry&&!o.geometry.userData.keep)o.geometry.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});world=null;}
const flatMat=o=>new THREE.MeshStandardMaterial(Object.assign({side:THREE.DoubleSide,polygonOffset:true},o));
function buildWorld(def,teams){
  disposeWorld();world=new THREE.Group();scene.add(world);
  const th=THEMES[def.theme];seed=def.seed||11;setSky(th);
  const ribbon=(a,b,y,mat,vScale,mask)=>{
    const pos=[],uv=[],idx=[];
    for(let i=0;i<=N;i++){const k=i%N,p=C[k],s=S[k],v=i*ds/vScale;pos.push(p.x+s.x*a,y+bankY(k,a),p.z+s.z*a,p.x+s.x*b,y+bankY(k,b),p.z+s.z*b);uv.push(0,v,1,v);}
    for(let i=0;i<N;i++){if(mask&&!(mask(i)&&mask((i+1)%N)))continue;const A=i*2,B=A+2;idx.push(A,B,A+1,B,B+1,A+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;world.add(m);return m;
  };
  const wall=(o,h,mat,from=0)=>{
    const pos=[],uv=[],idx=[];
    for(let i=0;i<=N;i++){const k=i%N,p=C[k],s=S[k],x=p.x+s.x*o,z=p.z+s.z*o,base=bankY(k,o),v=i*ds/6;pos.push(x,from?base+from:0,z,x,base+(from?from:0)+h,z);uv.push(0,v,1,v);}
    for(let i=0;i<N;i++){const A=i*2,B=A+2;idx.push(A,B,A+1,B,B+1,A+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;world.add(m);return m;
  };
  ROADM=flatMat({map:asphaltTex,bumpMap:asphaltTex,bumpScale:.45,roughness:.9,polygonOffsetFactor:-1,polygonOffsetUnits:-2});ribbon(-HW,HW,.02,ROADM,13);
  {const pos=[],uv=[],col=[],idx=[],w=1.4,bz=new Float32Array(N);
    for(let i=0;i<N;i++)bz[i]=V[i]>V[(i+30)%N]+9?1:0;const bs=smooth([...bz],10);
    for(let i=0;i<=N;i++){const k=i%N,p=P[k],t=PT[k],v=i*dl/9,a0=.42+.5*Math.min(1,bs[k]*1.6);
      for(const a of[-w,w]){pos.push(p.x-t.z*a,.03+bankY(k,off[k]+a),p.z+t.x*a);uv.push(a<0?0:1,v);col.push(1,1,1,a0);}}
    for(let i=0;i<N;i++){const A=i*2,B=A+2;idx.push(A,B,A+1,B,B+1,A+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(col,4));g.setIndex(idx);
    world.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0x0d0e10,alphaMap:rubTex,vertexColors:true,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1.5,polygonOffsetUnits:-3})));}
  const run=flatMat({color:def.oval?0x5d6067:0x4a4d52,roughness:.95,polygonOffsetFactor:-.5,polygonOffsetUnits:-1});
  const RW=def.oval||th.city?9:3.5;ribbon(HW,HW+RW,.015,run,10);ribbon(-HW-RW,-HW,.015,run,10);
  const lineMat=flatMat({color:0xf2f2f2,roughness:.6,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  ribbon(HW-.45,HW-.2,.025,lineMat,10);ribbon(-HW+.2,-HW+.45,.025,lineMat,10);ribbon(-.15,.15,.025,lineMat,10,i=>Math.floor(i*ds/4)%2===0);
  const ylw=flatMat({color:0xffc928,roughness:.6,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  for(const o of[-HW+1.6,HW-1.6])ribbon(o-.1,o+.1,.025,ylw,10,i=>Math.floor(i*ds/1.5)%10===0);
  if(!def.oval){
    const zone=new Array(N).fill(false);for(let i=0;i<N;i++)if(Math.abs(kc[i])>.0085)for(let k=-14;k<=14;k++)zone[(i+k+N)%N]=true;
    const curbMat=flatMat({map:curbTex,roughness:.55,polygonOffsetFactor:-3,polygonOffsetUnits:-6});
    ribbon(HW-.2,HW+1.3,.03,curbMat,3,i=>zone[i]);ribbon(-HW-1.3,-HW+.2,.03,curbMat,3,i=>zone[i]);
  }
  const inPit=i=>i*ds>=8&&i*ds<=195;
  ribbon(HW+3.6,HW+8.8,.022,flatMat({color:0x62666d,roughness:.9,polygonOffsetFactor:-1.5,polygonOffsetUnits:-3}),10,inPit);
  ribbon(HW+3.6,HW+3.8,.026,lineMat,10,inPit);
  const wm=new THREE.MeshStandardMaterial({map:wallTex,roughness:.7,side:THREE.DoubleSide});
  wall(HW+9,def.oval?1.3:1.1,wm);wall(-HW-9,def.oval?1.3:1.1,wm);
  if(def.oval){const fm=new THREE.MeshStandardMaterial({map:fenceTex,transparent:true,alphaTest:.3,side:THREE.DoubleSide,roughness:.6,metalness:.5});fenceTex.repeat.set(1,1);for(const o of[HW+9,-HW-9])wall(o,3.4,fm,1.3);}
  // bounds
  const bb=new THREE.Box3().setFromPoints(C),ctr=bb.getCenter(new V3());
  const gm=new THREE.Mesh(new THREE.PlaneGeometry(3200,3200).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:groundTexFor(th),roughness:1}));
  gm.position.set(ctr.x,0,ctr.z);gm.receiveShadow=true;world.add(gm);
  const keep=[];
  const orient=(g,i,side)=>{const t=T[i];g.rotation.y=Math.atan2(-t.z,t.x)+(side>0?Math.PI:0);};
  // gantry
  {const g=new THREE.Group();g.position.copy(C[0]);g.rotation.y=Math.atan2(T[0].x,T[0].z);world.add(g);
    const chk=new THREE.Mesh(new THREE.PlaneGeometry(HW*2,1.4).rotateX(-Math.PI/2),flatMat({map:checkerTex,roughness:.6,polygonOffsetFactor:-3,polygonOffsetUnits:-6}));chk.position.y=.03;g.add(chk);
    const steel=new THREE.MeshStandardMaterial({color:0x1c2232,metalness:.6,roughness:.4});
    for(const sx of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(.6,8,.6),steel);p.position.set(sx*(HW+2),4,0);p.castShadow=true;g.add(p);}
    const beam=new THREE.Mesh(new THREE.BoxGeometry(HW*2+4.6,1.5,.8),steel);beam.position.y=7.6;beam.castShadow=true;g.add(beam);
    const ban=canvasTex(1024,96,(c,w,h)=>{c.fillStyle='#0d1424';c.fillRect(0,0,w,h);c.font='800 68px "Saira Condensed", sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.fillText(def.name.toUpperCase(),w/2,h/2+3);c.fillStyle='#d62828';c.fillRect(0,h-8,w,8);});
    for(const sz of[1,-1]){const b=new THREE.Mesh(new THREE.PlaneGeometry(HW*2+2,1.2),new THREE.MeshBasicMaterial({map:ban}));b.position.set(0,7.6,sz*.41);if(sz<0)b.rotation.y=Math.PI;g.add(b);}
    keep.push({x:C[0].x,z:C[0].z,r:30});}
  // grandstands (-S side)
  const conc=new THREE.MeshStandardMaterial({color:0x9aa0a8,roughness:.9}),crowdM=new THREE.MeshStandardMaterial({map:crowdTex,roughness:1}),roofM=new THREE.MeshStandardMaterial({color:0xf0f2f5,roughness:.5,metalness:.2});
  for(const[d,len,rows]of(def.stands||[[100,150,8]])){
    const i=Math.round(d/ds)%N,g=new THREE.Group(),rw=rows||8;g.position.copy(C[i]).addScaledVector(S[i],-(HW+16));orient(g,i,-1);world.add(g);
    for(let r=0;r<rw;r++){const h=1+r*.9,b=new THREE.Mesh(new THREE.BoxGeometry(len,h,2.2),[conc,conc,crowdM,conc,conc,conc]);b.position.set(0,h/2,-r*2.2-1.1);g.add(b);}
    const roof=new THREE.Mesh(new THREE.BoxGeometry(len+4,.4,rw*2.2+4),roofM);roof.position.set(0,rw*.9+4.5,-rw*1.1);g.add(roof);
    for(let x=-len/2;x<=len/2;x+=len/8){const p=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,rw*.9+4.5,8),conc);p.position.set(x,(rw*.9+4.5)/2,-rw*2.2-.8);g.add(p);}
    const w=new V3();g.updateMatrixWorld();g.localToWorld(w.set(0,0,-rw*1.1));keep.push({x:w.x,z:w.z,r:len*.6+20});
  }
  // pit building (+S side)
  {const i=Math.round(100/ds)%N,g=new THREE.Group();g.position.copy(C[i]).addScaledVector(S[i],HW+12);orient(g,i,1);world.add(g);
    const doors=canvasTex(1024,64,(c,w,h)=>{c.fillStyle='#e8eaee';c.fillRect(0,0,w,h);teams.forEach((t,k)=>{const x=24+k*98;c.fillStyle='#'+new THREE.Color(t.c1===0x1a1b20||t.id===0?t.c2:t.c1).getHexString();c.fillRect(x,10,84,h-10);c.fillStyle='rgba(0,0,0,.25)';for(let y=16;y<h;y+=7)c.fillRect(x,y,84,1.5);});});
    const front=new THREE.MeshStandardMaterial({map:doors,roughness:.6}),wallM=new THREE.MeshStandardMaterial({color:0xdfe3e8,roughness:.7});
    const b=new THREE.Mesh(new THREE.BoxGeometry(170,6,12),[wallM,wallM,wallM,wallM,front,wallM]);b.position.set(0,3,-6);b.castShadow=true;g.add(b);
    const top=new THREE.Mesh(new THREE.BoxGeometry(172,1.2,14),new THREE.MeshStandardMaterial({color:0x1c2232,roughness:.5,metalness:.4}));top.position.set(0,6.6,-6);g.add(top);
    const w=new V3();g.updateMatrixWorld();g.localToWorld(w.set(0,0,-6));keep.push({x:w.x,z:w.z,r:110});}
  // ocean
  if(th.ocean){const oz=bb.max.z+70;const sea=new THREE.Mesh(new THREE.PlaneGeometry(5000,2400).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x1f6f9a,roughness:.15,metalness:.3}));sea.position.set(ctr.x,.12,oz+1200);world.add(sea);
    const sand=new THREE.Mesh(new THREE.PlaneGeometry(5000,60).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0xd9c59a,roughness:1}));sand.position.set(ctr.x,.06,oz-25);world.add(sand);keep.push({zmax:oz-50});}
  const far=C.filter((_,i)=>i%6===0);
  const clear=(x,z,r)=>far.every(p=>(p.x-x)**2+(p.z-z)**2>r*r)&&keep.every(k=>k.zmax!=null?z<k.zmax:(k.x-x)**2+(k.z-z)**2>k.r*k.r);
  // buildings
  if(th.city){
    const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1).translate(0,.5,0),new THREE.MeshStandardMaterial({map:winTex,roughness:.55,metalness:.25}),260);
    const m=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new V3(),ps=new V3(),col=new THREE.Color(),placed=[];let n=0;
    for(let pass=0;pass<2;pass++)for(let i=0;i<N&&n<260;i+=pass?5:8)for(const sd of[-1,1]){
      const o=pass?60+rand()*140:HW+18+rand()*24,w=14+rand()*22,d=14+rand()*22,h=pass?30+rand()*120:10+rand()*50;
      const x=C[i].x+S[i].x*sd*o,z=C[i].z+S[i].z*sd*o;
      if(!clear(x,z,Math.max(w,d)*.72+HW+10))continue;if(placed.some(p=>(p.x-x)**2+(p.z-z)**2<((p.r+Math.max(w,d)*.6))**2))continue;
      placed.push({x,z,r:Math.max(w,d)*.6});q.setFromAxisAngle(new V3(0,1,0),Math.atan2(T[i].x,T[i].z));
      m.compose(ps.set(x,0,z),q,sc.set(w,h,d));im.setMatrixAt(n,m);im.setColorAt(n,col.setHSL(.58+rand()*.08,.12,.45+rand()*.35));n++;if(n>=260)break;
    }
    im.count=n;im.castShadow=false;world.add(im);
  }
  // vegetation
  const tot=th.dens;
  for(const[k,frac]of th.veg){
    const cnt=Math.round(tot*frac);if(!cnt)continue;
    const im=new THREE.InstancedMesh(vegGeo(k),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,flatShading:k!=='cone'&&k!=='palm'}),cnt);
    im.geometry.userData.keep=1;
    const m=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new V3(),ps=new V3();let n=0,tries=0;
    while(n<cnt&&tries++<cnt*60){const x=bb.min.x-260+rand()*(bb.max.x-bb.min.x+520),z=bb.min.z-260+rand()*(bb.max.z-bb.min.z+520);if(!clear(x,z,30))continue;
      const s=.7+rand()*.7;q.setFromAxisAngle(new V3(0,1,0),rand()*6.28);m.compose(ps.set(x,0,z),q,sc.set(s,s*(k==='rock'?.8+rand()*.6:1),s));im.setMatrixAt(n++,m);}
    im.count=n;world.add(im);
  }
  // pit boxes
  {const pos=[],col=[];teams.forEach(t=>{const d=50+11*t.idx,i=Math.round(d/ds)%N,p=C[i],s=S[i],tg=T[i],c=new THREE.Color(t.c1===0x1a1b20||t.id===0?t.c2:t.c1);
      const q=(a,u)=>[p.x+s.x*a+tg.x*u,.04,p.z+s.z*a+tg.z*u],A=q(HW+6.6,-1.9),B=q(HW+8.6,-1.9),Cc=q(HW+8.6,1.9),D=q(HW+6.6,1.9);
      for(const v of[A,B,Cc,A,Cc,D]){pos.push(...v);col.push(c.r,c.g,c.b);}});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
    world.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-5,polygonOffsetUnits:-10})));}
  // TV camera spots
  spots=[];for(let i=0;i<N;i+=Math.round(N/14)){const sg=Math.abs(kw[i])>.002?-Math.sign(kw[i]):(spots.length%2?1:-1);spots.push(C[i].clone().addScaledVector(S[i],sg*(HW+16)).setY(5.5+(2*HW+16)*Math.tan(Math.abs(BS[i]))));}
  skids.forEach(s=>s.reset());
}

// ---------- car ----------
function bake(root){
  root.updateMatrixWorld(true);
  const inv=root.matrixWorld.clone().invert(),meshes=[],buckets=new Map();
  root.traverse(o=>{if(o.isMesh)meshes.push(o);});
  for(const m of meshes){const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(inv.clone().multiply(m.matrixWorld));if(!buckets.has(m.material))buckets.set(m.material,[]);buckets.get(m.material).push(g);}
  for(const m of meshes)m.parent.remove(m);
  for(const[mat,gs]of buckets){const mesh=new THREE.Mesh(mergeGeometries(gs),mat);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);}
}
function buildCar(o){
  const car=new THREE.Group(),body=new THREE.Group();car.add(body);car.rotation.order='YXZ';
  const DS=THREE.DoubleSide;
  const mk=p=>new THREE.MeshPhysicalMaterial(Object.assign({clearcoat:1,clearcoatRoughness:o.hq?.07:.12},p));
  const c1=new THREE.Color(o.c1),c2=new THREE.Color(o.c2),pat=o.pat||0;
  const pc=(x,y,z,col)=>{if(!pat)return col;let h=false;if(pat===1)h=Math.abs(x)<.16&&z>-.8;else if(pat===2)h=x>0;else if(pat===3)h=Math.floor((z+4)*1.3)%2===0;else if(pat===4)h=((((z*.9+x*2.4)%1.6)+1.6)%1.6)<.5;return h?c2:col;};
  const paint=mk({color:0xffffff,vertexColors:true,metalness:.5,roughness:.3,side:DS}),paintFlat=mk({color:o.c1,metalness:.5,roughness:.3,side:DS}),accent=mk({color:o.c2,metalness:.25,roughness:.32,side:DS});
  const carbon=new THREE.MeshStandardMaterial({color:0x15171b,metalness:.35,roughness:.4,side:DS}),dark=new THREE.MeshStandardMaterial({color:0x040507,roughness:.7});
  const tireM=new THREE.MeshStandardMaterial({color:0x1a1a1c,roughness:.82,side:DS}),rimM=new THREE.MeshStandardMaterial({color:0x2b2f36,metalness:.9,roughness:.28});
  const white=mk({color:0xf4f4f4,roughness:.22}),visor=mk({color:0x0a0a0a,metalness:.9,roughness:.05});
  const add=(geo,mat,x=0,y=0,z=0,parent=body)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;};
  const lathe=prof=>{const g=new THREE.LatheGeometry(prof.map(([r,a])=>new THREE.Vector2(r,a)),36);g.rotateX(Math.PI/2);return g;};
  const shapeGeo=(pts,s=1,sy=1)=>{const g=lathe(pts);g.scale(s,sy,1);return g;};
  const colorize=(g,fn)=>{const p=g.attributes.position,c=[];for(let i=0;i<p.count;i++){const col=fn(p.getX(i),p.getY(i),p.getZ(i));c.push(col.r,col.g,col.b);}g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));};
  const bend=(g,fn)=>{const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,p.getY(i)+fn(p.getZ(i),p.getX(i)));g.computeVertexNormals();};
  const tub=shapeGeo([[0,-1.15],[.2,-1.12],[.32,-.98],[.36,-.65],[.36,.4],[.34,1.2],[.3,1.9],[.24,2.45],[.17,2.75],[.12,3.0],[.06,3.17],[0,3.22]],1.05,.62);
  bend(tub,z=>-(Math.max(0,z-1.5)**2)*.085);colorize(tub,(x,y,z)=>pc(x,y,z,z>2.72?c2:(y>.17&&Math.abs(x)<.07&&z>-.2?c2:c1)));add(tub,paint,0,.45,0);
  const ec=shapeGeo([[0,.12],[.18,.08],[.32,-.18],[.36,-.6],[.3,-1.2],[.19,-1.8],[.09,-2.15],[0,-2.22]],.82,1);
  bend(ec,z=>-Math.max(0,-z-.5)*.14);colorize(ec,(x,y,z)=>pc(x,y,z,(y>.3&&Math.abs(x)<.06)?c2:c1));add(ec,paint,0,.62,0);
  add(new THREE.SphereGeometry(1,20,12),dark,0,.9,-.04).scale.set(.085,.07,.04);
  for(const sx of[-1,1]){
    const sp=shapeGeo([[0,.64],[.2,.62],[.3,.46],[.32,.1],[.27,-.5],[.17,-1.1],[.08,-1.45],[0,-1.5]],.95,.75);colorize(sp,(x,y,z)=>pc(x*sx,y,z,(y>.17&&z>-.6&&z<.3)?c2:c1));add(sp,paint,sx*.55,.36,0);
    add(new THREE.SphereGeometry(1,20,12),dark,sx*.58,.39,.62).scale.set(.2,.13,.05);
    add(new THREE.CylinderGeometry(.012,.012,.2,6),carbon,sx*.44,.68,.78).rotation.z=sx*.9;
    add(new RoundedBoxGeometry(.15,.07,.05,2,.02),paintFlat,sx*.52,.74,.78);
  }
  add(new RoundedBoxGeometry(1.5,.05,3.7,2,.02),carbon,0,.09,-.25);
  add(new RoundedBoxGeometry(1.2,.25,.5,2,.03),carbon,0,.19,-2.15).rotation.x=-.35;
  add(new THREE.SphereGeometry(1,24,12),dark,0,.655,.5).scale.set(.25,.07,.48);
  add(new THREE.SphereGeometry(.15,24,18),white,0,.79,.36);
  add(new THREE.SphereGeometry(.153,24,8,Math.PI/2-.95,1.9,1.15,.45),visor,0,.79,.36);
  add(new THREE.TorusGeometry(.151,.012,6,32),accent,0,.79,.36).rotation.y=Math.PI/2;
  const halo=add(new THREE.TorusGeometry(.38,.032,10,36,Math.PI),carbon,0,.85,.08);halo.rotation.set(Math.PI/2,0,0);halo.scale.set(1,1.15,1);
  add(new THREE.CylinderGeometry(.03,.04,.32,10),carbon,0,.72,.58).rotation.x=.75;
  for(const sx of[-1,1])add(new THREE.CylinderGeometry(.03,.03,.2,8),carbon,sx*.38,.76,.08);
  const fs=new THREE.Shape();[[-.45,.95],[-.8,1.1],[-2.12,1.08],[-2.25,.98],[-1.95,.76],[-.6,.92]].forEach(([a,b],i)=>i?fs.lineTo(a,b):fs.moveTo(a,b));
  const fg=new THREE.ExtrudeGeometry(fs,{depth:.022,bevelEnabled:false});fg.translate(0,0,-.011);fg.rotateY(-Math.PI/2);add(fg,paintFlat);
  const numTex=canvasTex(256,128,(c,w,h)=>{c.font='800 118px "Saira Condensed", sans-serif';c.textAlign='center';c.textBaseline='middle';c.lineWidth=10;c.strokeStyle='#'+c2.getHexString();c.strokeText(o.num,w/2,h/2+6);c.fillStyle='#fff';c.fillText(o.num,w/2,h/2+6);});
  const numM=new THREE.MeshStandardMaterial({map:numTex,transparent:true,roughness:.3,polygonOffset:true,polygonOffsetFactor:-2});
  for(const sx of[-1,1]){const d=add(new THREE.PlaneGeometry(.5,.25),numM,sx*.013,.97,-1.35);d.rotation.y=sx*Math.PI/2;}
  add(new RoundedBoxGeometry(1.95,.035,.44,2,.015),carbon,0,.1,3.0);
  add(new RoundedBoxGeometry(1.72,.03,.22,2,.012),accent,0,.16,2.86).rotation.x=.35;
  add(new RoundedBoxGeometry(1.6,.028,.18,2,.012),paintFlat,0,.23,2.73).rotation.x=.6;
  for(const sx of[-1,1]){add(new RoundedBoxGeometry(.025,.25,.64,2,.01),accent,sx*.98,.18,2.95);add(new THREE.BoxGeometry(.03,.14,.2),carbon,sx*.1,.17,2.98);}
  add(new RoundedBoxGeometry(1.06,.05,.34,2,.02),carbon,0,.9,-2.3).rotation.x=.12;
  add(new RoundedBoxGeometry(1.06,.04,.2,2,.015),accent,0,1.01,-2.43).rotation.x=.5;
  add(new RoundedBoxGeometry(1.0,.03,.15,2,.012),carbon,0,.46,-2.36);
  add(new THREE.BoxGeometry(.04,.42,.12),carbon,0,.68,-2.17);
  const epTex=canvasTex(128,128,(c,w,h)=>{c.fillStyle='#'+c2.getHexString();c.fillRect(0,0,w,h);c.fillStyle='#'+c1.getHexString();c.fillRect(0,h*.62,w,h*.38);c.font='800 46px "Saira Condensed", sans-serif';c.textAlign='center';c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=3;c.strokeText(o.tag,w/2,h*.48);c.fillText(o.tag,w/2,h*.48);});
  const epM=mk({map:epTex,roughness:.32});
  for(const sx of[-1,1])add(new RoundedBoxGeometry(.03,.56,.74,2,.012),epM,sx*.54,.84,-2.33);
  const wheels=[],stripeM=new THREE.MeshStandardMaterial({color:0xe63946,roughness:.5,emissive:0x000000});
  const mkWheel=(x,z,w,front)=>{
    const pivot=new THREE.Group();pivot.position.set(x,.36,z);car.add(pivot);const spin=new THREE.Group();pivot.add(spin);
    const h=w/2,tg=new THREE.LatheGeometry([[.23,-h],[.31,-h],[.345,-h+.02],[.36,-h+.07],[.362,0],[.36,h-.07],[.345,h-.02],[.31,h],[.23,h]].map(([r,a])=>new THREE.Vector2(r,a)),44);
    tg.rotateZ(Math.PI/2);add(tg,tireM,0,0,0,spin);
    add(new THREE.CylinderGeometry(.232,.232,w*.92,28).rotateZ(Math.PI/2),rimM,0,0,0,spin);
    const out=Math.sign(x);
    add(new THREE.TorusGeometry(.3,.016,6,40).rotateY(Math.PI/2),stripeM,out*(h+.001),0,0,spin);
    add(new THREE.CylinderGeometry(.07,.07,.02,16).rotateZ(Math.PI/2),accent,out*(w*.46+.01),0,0,spin);
    for(let i=0;i<5;i++){const sp=add(new THREE.BoxGeometry(.012,.36,.04),rimM,out*(w*.46+.004),0,0,spin);sp.rotation.x=i*Math.PI/5;}
    wheels.push({pivot,spin,front});
    for(const[yy,dz]of[[.47,.12],[.28,-.1]]){const a=new V3(out*.3,yy,z+dz),b=new V3(x-out*h*.6,.36+(yy-.36)*.6,z),len=a.distanceTo(b),arm=add(new THREE.CylinderGeometry(.016,.016,len,6),carbon);arm.position.copy(a).add(b).multiplyScalar(.5);arm.quaternion.setFromUnitVectors(new V3(0,1,0),b.clone().sub(a).normalize());}
  };
  mkWheel(-.84,1.72,.36,true);mkWheel(.84,1.72,.36,true);mkWheel(-.81,-1.62,.44,false);mkWheel(.81,-1.62,.44,false);
  car.updateMatrixWorld(true);bake(body);for(const w of wheels)bake(w.spin);
  const blob=new THREE.Mesh(blobGeo,new THREE.MeshBasicMaterial({map:blobTex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-12}));blob.position.set(0,.02,.05);blob.renderOrder=2;car.add(blob);
  return{car,body,wheels,stripe:stripeM};
}

// ---------- skids ----------
class Skid{
  constructor(max=2400){this.max=max;this.pos=new Float32Array(max*18);this.g=new THREE.BufferGeometry();this.g.setAttribute('position',new THREE.BufferAttribute(this.pos,3));this.reset();
    const m=new THREE.Mesh(this.g,new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-8}));m.frustumCulled=false;scene.add(m);}
  reset(){this.n=0;this.full=false;this.last=null;this.g.setDrawRange(0,0);}
  add(p,side,w){const l=p.clone().addScaledVector(side,w),r=p.clone().addScaledVector(side,-w);
    if(this.last&&this.last.p.distanceToSquared(p)>.04){const[a,b]=[this.last.l,this.last.r],o=this.n*18,y=.035;
      this.pos.set([a.x,a.y+y,a.z,l.x,l.y+y,l.z,b.x,b.y+y,b.z,l.x,l.y+y,l.z,r.x,r.y+y,r.z,b.x,b.y+y,b.z],o);this.n=(this.n+1)%this.max;if(this.n===0)this.full=true;
      this.g.setDrawRange(0,(this.full?this.max:this.n)*6);this.g.attributes.position.needsUpdate=true;this.last={p:p.clone(),l,r};}
    else if(!this.last)this.last={p:p.clone(),l,r};}
  cut(){this.last=null;}
}
const skids=[new Skid(),new Skid(),new Skid(),new Skid()];

// ---------- garage (menu) scene ----------
const gscene=new THREE.Scene();gscene.background=new THREE.Color(0x05070c);gscene.fog=new THREE.Fog(0x05070c,16,34);
gscene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
gscene.add(new THREE.HemisphereLight(0x8fa4ff,0x101018,.35));
const key=new THREE.SpotLight(0xffffff,320,40,Math.PI/5.5,.6,1.5);key.position.set(3.5,9.5,4.5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0003;gscene.add(key,key.target);
const rim=new THREE.SpotLight(0xff6a2a,160,30,Math.PI/5,.7,1.5);rim.position.set(-5,5,-7);gscene.add(rim,rim.target);
const fill=new THREE.SpotLight(0x7fa8ff,90,30,Math.PI/4,.8,1.5);fill.position.set(-6,4,6);gscene.add(fill,fill.target);
let gReflector=null,gBanner=null,gRing=null;
function buildGarage(name,c1,c2){
  const acc=new THREE.Color(c2);
  if(!gReflector){
    gReflector=new Reflector(new THREE.PlaneGeometry(60,60),{textureWidth:Math.round(innerWidth*pr*.5),textureHeight:Math.round(innerHeight*pr*.5),color:0x8a8f99});
    gReflector.rotation.x=-Math.PI/2;gscene.add(gReflector);
    const coat=new THREE.Mesh(new THREE.PlaneGeometry(60,60).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x0b0e16,roughness:.42,metalness:.15,transparent:true,opacity:.84}));coat.position.y=.004;coat.receiveShadow=true;gscene.add(coat);
    const tt=new THREE.Mesh(new THREE.CylinderGeometry(3.3,3.45,.1,72),new THREE.MeshStandardMaterial({color:0x141821,metalness:.8,roughness:.35}));tt.position.y=.05;tt.receiveShadow=true;gscene.add(tt);
    gRing=new THREE.Mesh(new THREE.TorusGeometry(3.42,.03,8,160).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:acc}));gRing.position.y=.1;gscene.add(gRing);
    for(const r of[5.2,7.6]){const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+.04,128).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x2a3350,transparent:true,opacity:.6}));ring.position.y=.008;gscene.add(ring);}
    const panel=canvasTex(512,256,(g,w,h)=>{g.fillStyle='#10141f';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=64){g.fillStyle='#0b0e17';g.fillRect(x,0,3,h);}g.fillStyle='#161b29';g.fillRect(0,h*.72,w,h*.28);noise(g,w,h,6);});panel.repeat.set(6,1);
    const wallG=new THREE.CylinderGeometry(15,15,10,96,1,true,Math.PI*.55,Math.PI*.9);
    const wall=new THREE.Mesh(wallG,new THREE.MeshStandardMaterial({map:panel,roughness:.6,metalness:.3,side:THREE.BackSide}));wall.position.y=5;gscene.add(wall);
    for(let i=0;i<9;i++){const a=Math.PI*.6+i*(Math.PI*.8/8),x=Math.sin(a)*14.8,z=Math.cos(a)*14.8,s=new THREE.Mesh(new THREE.BoxGeometry(.12,7,.12),new THREE.MeshBasicMaterial({color:0xdfe7ff}));s.position.set(x,4.2,z);gscene.add(s);}
    const strip=new THREE.Mesh(new THREE.CylinderGeometry(14.85,14.85,.16,96,1,true,Math.PI*.55,Math.PI*.9),new THREE.MeshBasicMaterial({color:acc,side:THREE.BackSide}));strip.position.y=2.4;gscene.add(strip);gscene.userData.strip=strip;
    for(let i=0;i<4;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(6,.5).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:0xffffff}));p.position.set(-6+i*4,9.8,-1.5+((i%2)*3));gscene.add(p);}
    const chest=new THREE.MeshPhysicalMaterial({color:c2,metalness:.4,roughness:.35,clearcoat:1});const steel=new THREE.MeshStandardMaterial({color:0x9aa3b2,metalness:.9,roughness:.3});
    for(const[x,z,r]of[[-7.4,-6.5,.5],[7.6,-6.2,-.5]]){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=r;gscene.add(g);
      const b=new THREE.Mesh(new RoundedBoxGeometry(1.8,1.2,.8,3,.06),chest);b.position.y=.7;b.castShadow=true;g.add(b);
      for(let k=0;k<4;k++){const d=new THREE.Mesh(new THREE.BoxGeometry(1.6,.02,.02),steel);d.position.set(0,.35+k*.25,.41);g.add(d);}
      const top=new THREE.Mesh(new RoundedBoxGeometry(1.9,.08,.9,2,.03),steel);top.position.y=1.34;g.add(top);}
    const tireG=new THREE.TorusGeometry(.36,.17,12,32).rotateX(Math.PI/2),tm=new THREE.MeshStandardMaterial({color:0x1a1a1c,roughness:.85});
    const stripeCols=[0xff4d5a,0xffd23f,0xf2f2f2];
    for(const[x,z,c]of[[-5.4,-8.6,0],[-4.4,-9,1],[5.2,-8.8,2],[6.4,-8.2,0]]){for(let k=0;k<4;k++){const t=new THREE.Mesh(tireG,tm);t.position.set(x,.18+k*.36,z);t.castShadow=true;gscene.add(t);const st=new THREE.Mesh(new THREE.TorusGeometry(.36,.012,6,40).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:stripeCols[c]}));st.position.set(x,.18+k*.36+.17,z);gscene.add(st);}}
  }
  gRing.material.color.set(acc);gscene.userData.strip.material.color.set(acc);rim.color.set(acc);
  if(gBanner){gscene.remove(gBanner);gBanner.material.map.dispose();gBanner.material.dispose();}
  const bt=canvasTex(1024,160,(g,w,h)=>{g.clearRect(0,0,w,h);g.font='800 112px "Saira Condensed", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(255,255,255,.92)';g.fillText(name.toUpperCase(),w/2,h/2+6);});
  gBanner=new THREE.Mesh(new THREE.PlaneGeometry(11,1.72),new THREE.MeshBasicMaterial({map:bt,transparent:true}));gBanner.position.set(0,5.6,-14.6);gscene.add(gBanner);
}
