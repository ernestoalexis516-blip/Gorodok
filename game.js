const N=40;
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
const cv=renderer.domElement;document.body.appendChild(cv);
const scene=new THREE.Scene();
const SKY=0xaab8a0;scene.background=new THREE.Color(SKY);scene.fog=new THREE.Fog(SKY,38,90);
const cam=new THREE.PerspectiveCamera(40,1,0.5,200);
const view={x:N/2,z:N/2,yaw:Math.PI/4,dist:28,pitch:0.9};
function updateCam(){const d=view.dist,c=Math.cos(view.pitch);cam.position.set(view.x+Math.sin(view.yaw)*c*d,Math.sin(view.pitch)*d,view.z+Math.cos(view.yaw)*c*d);cam.lookAt(view.x,0,view.z);}
function resize(){renderer.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

scene.add(new THREE.HemisphereLight(0xdfe8d8,0x5b6048,0.75));
const sun=new THREE.DirectionalLight(0xfff1d6,0.8);
sun.position.set(N/2-20,30,N/2+15);sun.target.position.set(N/2,0,N/2);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:1,far:100});
scene.add(sun,sun.target);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(N,N),new THREE.MeshLambertMaterial({color:0x7c8a56}));
ground.rotation.x=-Math.PI/2;ground.position.set(N/2,0,N/2);ground.receiveShadow=true;scene.add(ground);
const outer=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshLambertMaterial({color:0x6f7c4e}));
outer.rotation.x=-Math.PI/2;outer.position.set(N/2,-0.02,N/2);scene.add(outer);
const gh=new THREE.GridHelper(N,N,0x000000,0x000000);gh.position.set(N/2,0.01,N/2);gh.material.transparent=true;gh.material.opacity=0.08;scene.add(gh);

const mats={};
const M=c=>mats[c]||(mats[c]=new THREE.MeshLambertMaterial({color:c,flatShading:true}));
function bx(g,w,h,d,x,y,z,c){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y+h/2,z);m.castShadow=m.receiveShadow=true;g.add(m);return m;}
const pick3=a=>a[Math.random()*a.length|0];

function mkRoad(){const g=new THREE.Group();const m=bx(g,1,0.04,1,0,0,0,0x5a4d44);m.castShadow=false;return g;}
function mkTree(){const g=new THREE.Group();const c=pick3([0x2f4a33,0x365a3a,0x2b4130]);bx(g,0.12,0.3,0.12,0,0,0,0x4a3a2c);let s=0.6;for(let i=0;i<5;i++){bx(g,s,0.3,s,0,0.25+i*0.27,0,c);s-=0.11;}g.scale.setScalar(0.8+Math.random()*0.6);g.rotation.y=Math.random()*3;return g;}
function mkPanel(){const g=new THREE.Group(),w=2,d=3,H=2.6;bx(g,w-0.1,H,d-0.1,0,0,0,pick3([0xb9b3a4,0xc9c0a8,0xa9b0b5]));
bx(g,w,0.08,d,0,H,0,0x5d6168);
for(let f=0;f<5;f++)for(let k=-1;k<=1;k++)for(const s of[-1,1])bx(g,0.03,0.24,0.34,s*(w-0.1)/2,0.2+f*0.5,k*0.9,0x3b4650);
bx(g,0.5,0.4,0.05,0,0,(d-0.1)/2+0.02,0x4a3f38);return g;}
function mkHouse(){const g=new THREE.Group();bx(g,1.5,0.8,1.5,0,0,0,pick3([0xd8cdb0,0xc9b98f,0xb7c2b0]));
const r=new THREE.Mesh(new THREE.ConeGeometry(1.25,0.7,4),M(0x6a4f45));r.rotation.y=Math.PI/4;r.position.y=1.15;r.castShadow=true;g.add(r);
bx(g,0.3,0.3,0.03,0.35,0.3,0.76,0x3b4650);bx(g,0.3,0.5,0.03,-0.35,0,0.76,0x5a4030);return g;}
function mkShop(){const g=new THREE.Group();bx(g,1.8,0.8,1.8,0,0,0,0xcfc6b0);bx(g,1.9,0.06,1.9,0,0.8,0,0x6a6d70);
bx(g,1.8,0.22,0.05,0,0.58,0.9,0xb23a30);bx(g,1.2,0.3,0.03,0,0.18,0.91,0x2f3d45);return g;}
function mkBoiler(){const g=new THREE.Group();bx(g,2.9,0.04,2.9,0,0,0,0x5d5f60);
bx(g,1.2,2.2,1.2,-0.7,0.04,-0.7,0x8a4a3a);bx(g,0.4,0.3,0.4,-0.9,2.24,-0.7,0x3a3d40);
bx(g,1.2,0.9,1.9,0.7,0.04,0.3,0xcdbf9d);bx(g,1.3,0.1,2.0,0.7,0.94,0.3,0x59636a);
const c=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.18,3.6,10),M(0x7b3f33));c.position.set(-0.7,1.8,0.2);c.castShadow=true;g.add(c);
const t=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,0.14,10),M(0x1d1d1d));t.position.set(-0.7,3.65,0.2);g.add(t);
const p=new THREE.Mesh(new THREE.ConeGeometry(0.4,0.4,6),M(0x222222));p.position.set(0.9,0.25,-0.8);g.add(p);return g;}
function mkDirt(){const g=new THREE.Group();const m=bx(g,1,0.03,1,0,0,0,0x8a7358);m.castShadow=false;return g;}
function mkRail(){const g=new THREE.Group();g.gx=new THREE.Group();g.gz=new THREE.Group();
 for(const sx of[1,0]){const gr=sx?g.gx:g.gz;
  bx(gr,sx?1:0.6,0.03,sx?0.6:1,0,0,0,0x7a756c);
  for(const o of[-0.2,0.2])bx(gr,sx?1:0.04,0.06,sx?0.04:1,sx?0:o,0.03,sx?o:0,0x3a3a3a);
  for(let i=0;i<4;i++){const p=-0.375+i*0.25;bx(gr,sx?0.08:0.5,0.03,sx?0.5:0.08,sx?p:0,0.03,sx?0:p,0x4a3a2c);}}
 g.add(g.gx,g.gz);return g;}
function mkTower(){const g=new THREE.Group(),H=4.2;bx(g,1.7,H,1.7,0,0,0,pick3([0xaeb4b8,0xc4bba2]));bx(g,1.8,0.08,1.8,0,H,0,0x5d6168);
 for(let f=0;f<9;f++)for(const k of[-0.4,0.4])for(const s of[-1,1]){bx(g,0.03,0.22,0.3,s*0.85,0.15+f*0.46,k,0x3b4650);bx(g,0.3,0.22,0.03,k,0.15+f*0.46,s*0.85,0x3b4650);}return g;}
function mkDacha(){const g=new THREE.Group();bx(g,0.6,0.4,0.6,0,0,0,0x9a6b44);const r=new THREE.Mesh(new THREE.ConeGeometry(0.55,0.35,4),M(0x59636a));r.rotation.y=Math.PI/4;r.position.y=0.58;r.castShadow=true;g.add(r);return g;}
function mkFactory(){const g=new THREE.Group();bx(g,2.8,0.04,1.8,0,0,0,0x5d5f60);bx(g,2.6,1,1.6,0,0.04,0,0xa5553f);
 for(let i=0;i<3;i++)bx(g,0.8,0.35,1.6,-0.9+i*0.9,1.04,0,0x59636a);bx(g,2.6,0.2,0.03,0,0.5,0.81,0x2f3d45);
 const c=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.14,2.2,8),M(0x7b3f33));c.position.set(1.1,1.1,-0.5);c.castShadow=true;g.add(c);return g;}
function mkPlant(){const g=new THREE.Group();bx(g,2.9,0.04,2.9,0,0,0,0x5d5f60);bx(g,1.6,1.4,2.4,-0.6,0.04,0,0x8f9398);bx(g,1.7,0.08,2.5,-0.6,1.44,0,0x4a4f54);
 for(const z of[-0.8,0.5]){const t=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,1.2,12),M(0xc7c9c4));t.position.set(0.9,0.64,z);t.castShadow=true;g.add(t);}
 for(const x of[-1,-0.2]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.18,3,8),M(0x9a9a9a));c.position.set(x,1.5,-1);c.castShadow=true;g.add(c);const t=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,0.14,8),M(0x8a3a3a));t.position.set(x,3.05,-1);g.add(t);}return g;}
function mkStation(){const g=new THREE.Group();bx(g,3,0.1,0.7,0,0,0.65,0x9a9a94);bx(g,1.6,0.8,0.8,0,0.1,-0.4,0xd9cfa8);bx(g,1.8,0.08,1,0,0.9,-0.4,0x6a4f45);
 bx(g,2.6,0.06,0.6,0,0.8,0.65,0x4a6a7a);for(const x of[-1.2,1.2])bx(g,0.05,0.7,0.05,x,0.1,0.9,0x333333);return g;}
function mkTrain(){const g=new THREE.Group();bx(g,0.7,0.3,0.28,0,0.05,0,0xb23a30);bx(g,0.25,0.2,0.28,0.2,0.35,0,0x2d3a40);for(let i=1;i<=2;i++)bx(g,0.6,0.28,0.26,-0.7*i-0.1,0.05,0,0x4a6a7a);return g;}
function mkMarker(){const g=new THREE.Group();bx(g,1,0.05,1,0,0,0,0xffffff);return g;}

const MK={road:mkRoad,dirt:mkDirt,rail:mkRail,panel:mkPanel,tower:mkTower,house:mkHouse,dacha:mkDacha,shop:mkShop,factory:mkFactory,plant:mkPlant,boiler:mkBoiler,station:mkStation,bulldoze:mkMarker};
const defs=SPECS;for(const k in defs)defs[k].mk=MK[k]||(()=>mkGen(defs[k]));
const isRoad=o=>o&&defs[o.t]&&defs[o.t].road;
function mkGen(D){const g=new THREE.Group(),w=D.w-0.2,d=D.d-0.2,h=D.h||1,c=D.col||0xb0b0a8,st=D.st||'b';
 if(st==='w'){bx(g,0.12,2.6,0.12,0,0,0,0xe8e8e8);const p=new THREE.Group();p.position.y=2.6;for(let i=0;i<3;i++){const q=new THREE.Group();q.rotation.z=i*2.094;bx(q,0.06,0.9,0.03,0,0,0,0xf4f4f4);p.add(q);}g.add(p);return g;}
 if(st==='s'){bx(g,w,0.04,d,0,0,0,0x6a7a5a);for(let i=-1;i<=1;i++){const m=bx(g,w*0.85,0.04,0.55,0,0.25,i*(d/3),0x24407a);m.rotation.x=-0.5;}return g;}
 if(st==='c'){const t=new THREE.Mesh(new THREE.CylinderGeometry(w/2,w/2,h,12),M(c));t.position.y=h/2;t.castShadow=true;g.add(t);const r=new THREE.Mesh(new THREE.ConeGeometry(w/2+0.05,0.3,12),M(0x4a4f54));r.position.y=h+0.15;g.add(r);return g;}
 if(st==='p'){bx(g,w,0.04,d,0,0,0,0x5a8a48);for(let i=0;i<4;i++){const t=mkTree();t.scale.setScalar(0.5);t.position.set((i%2?0.4:-0.4)*w/1.2,0,(i<2?0.4:-0.4)*d/1.2);g.add(t);}return g;}
 if(st==='f'){bx(g,w,h,d,0,0,0,c);bx(g,w-0.7,h+0.02,d-0.7,0,0,0,0x5a8a48);return g;}
 bx(g,w,h,d,0,0,0,c);
 if(st==='g'){const r=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*0.78,0.6,4),M(0x6a4f45));r.rotation.y=Math.PI/4;r.position.y=h+0.3;r.castShadow=true;g.add(r);}
 else bx(g,w+0.06,0.06,d+0.06,0,h,0,0x5d6168);
 if(st==='d'){const s=new THREE.Mesh(new THREE.SphereGeometry(0.4,12,8),M(0xd4a82a));s.position.y=h+0.4;g.add(s);}
 if(st==='k')for(const x of[-0.3,0.3]){const k=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,h+1.4,8),M(0x8a6a58));k.position.set(x*w,(h+1.4)/2,-d*0.3);k.castShadow=true;g.add(k);}
 if(st!=='g')for(let f=0;f<Math.floor(h/0.5);f++){bx(g,w+0.03,0.18,d*0.6,0,0.15+f*0.5,0,0x3b4650);bx(g,w*0.6,0.18,d+0.03,0,0.15+f*0.5,0,0x3b4650);}
 return g;}
const order=Object.keys(defs);

const grid=new Array(N*N).fill(null),all=[];
let money=1500,pop=0,tool='road',rot=0,down=false,cur={ax:0,az:0};
const at=(x,z)=>(x<0||z<0||x>=N||z>=N)?undefined:grid[z*N+x];
const dims=(t,r)=>{const D=defs[t];return r%2?{fw:D.d,fd:D.w}:{fw:D.w,fd:D.d};};

function remove(o){scene.remove(o.mesh);o.cells.forEach(i=>grid[i]=null);const k=all.indexOf(o);if(k>-1)all.splice(k,1);}
function build(t,ax,az,r){const {fw,fd}=dims(t,r),cells=[];
 for(let x=ax;x<ax+fw;x++)for(let z=az;z<az+fd;z++){const o=grid[z*N+x];if(o)remove(o);cells.push(z*N+x);}
 const mesh=defs[t].mk();mesh.position.set(ax+fw/2,0,az+fd/2);mesh.rotation.y=r*Math.PI/2;scene.add(mesh);
 const o={t,mesh,cells,a:[ax,az,r]};cells.forEach(i=>grid[i]=o);all.push(o);return o;}
function near(ax,az,fw,fd,fn){
 for(let x=ax;x<ax+fw;x++)for(const z of[az-1,az+fd])if(fn(at(x,z)))return true;
 for(let z=az;z<az+fd;z++)for(const x of[ax-1,ax+fw])if(fn(at(x,z)))return true;
 return false;}
function check(t,ax,az,r){const {fw,fd}=dims(t,r);
 for(let x=ax;x<ax+fw;x++)for(let z=az;z<az+fd;z++){if(x<0||z<0||x>=N||z>=N)return 'За границей карты';const o=grid[z*N+x];if(o&&o.t!=='tree')return 'Клетка занята';}
 if(!defs[t].road&&t!=='rail'){
  if(!near(ax,az,fw,fd,isRoad))return 'Нужна дорога рядом';
  if(t==='station'&&!near(ax,az,fw,fd,o=>o&&o.t==='rail'))return 'Вокзалу нужны рельсы рядом';}
 if(money<defs[t].cost)return 'Не хватает денег';
 return null;}
function act(){
 if(tool==='bulldoze'){const o=at(cur.ax,cur.az);if(o){remove(o);stats(1);}return;}
 const err=check(tool,cur.ax,cur.az,rot);if(err){say(err);return;}
 money-=defs[tool].cost;build(tool,cur.ax,cur.az,rot);stats(1);}

let msgT;function say(t){const m=document.getElementById('msg');m.textContent=t;m.style.opacity=1;clearTimeout(msgT);msgT=setTimeout(()=>m.style.opacity=0,1600);}
function stats(ch){
 if(ch){refreshRails();setupTrains();save();}
 let cap=0,jobs=0,prod=0;const sup={},dem={};for(const k in NEEDS){sup[k]=0;dem[k]=0;}
 all.forEach(o=>{const D=defs[o.t];if(!D||o.t==='tree')return;cap+=D.cap||0;jobs+=D.j||0;prod+=D.pr||0;
  for(const k in D.p||{})sup[k]+=D.p[k];for(const k in D.u||{})dem[k]+=D.u[k];
  if(D.cap)for(const k in NEEDS)if(!(k==='heat'&&D.nh))dem[k]+=D.cap*NEEDS[k][1];});
 const lv={};let sum=0,low=null;
 for(const k in NEEDS){lv[k]=dem[k]?Math.min(1,sup[k]/dem[k]):1;sum+=lv[k];if(!low||lv[k]<lv[low])low=k;}
 const hap=sum/Object.keys(NEEDS).length;pop=Math.round(cap*(0.4+0.6*hap));
 const emp=Math.min(Math.round(pop*0.6),jobs),fill=jobs?emp/jobs:0;
 const inc=Math.round(pop*0.1*hap+emp*0.5+prod*fill*lv.power+trains.length*15);stats.inc=inc;
 money_.textContent=money+' ₽';pop_.textContent=pop;inc_.textContent='+'+inc+' ₽';jobs_.textContent=emp+' заняты из '+jobs;
 cold_.textContent=lv[low]<1?'Не хватает: '+NEEDS[low][0]:'';
 needs_.innerHTML=Object.keys(NEEDS).map(k=>'<div class="n"><span>'+NEEDS[k][0]+'</span><i><u style="width:'+Math.round(lv[k]*100)+'%;background:'+(lv[k]<0.5?'var(--acc)':'#6a9a52')+'"></u></i></div>').join('');
 document.querySelectorAll('#bar button').forEach(b=>{const t=b.dataset.t;b.querySelector('small').textContent=t==='bulldoze'?'бесплатно':defs[t].cost+' ₽';});}
const money_=document.getElementById('money'),pop_=document.getElementById('pop'),inc_=document.getElementById('inc'),cold_=document.getElementById('cold'),jobs_=document.getElementById('jobs'),needs_=document.getElementById('needs');
setInterval(()=>{if(playing)money+=stats.inc||0;stats();},3000);

let ghost=null;const gmat=new THREE.MeshBasicMaterial({color:0x6fd36f,transparent:true,opacity:0.55,depthWrite:false});
function setTool(t){tool=t;if(ghost)scene.remove(ghost);ghost=defs[t].mk();ghost.traverse(m=>{if(m.isMesh){m.material=gmat;m.castShadow=false;}});scene.add(ghost);
 document.querySelectorAll('#bar button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));moveGhost();}
function moveGhost(){if(!ghost)return;const {fw,fd}=dims(tool,rot);ghost.position.set(cur.ax+fw/2,0.02,cur.az+fd/2);ghost.rotation.y=rot*Math.PI/2;
 const bad=tool==='bulldoze'?!at(cur.ax,cur.az):!!check(tool,cur.ax,cur.az,rot);gmat.color.set(bad?0xe05a4a:(tool==='bulldoze'?0xe0a04a:0x6fd36f));}

const bar=document.getElementById('bar'),tabs=document.getElementById('tabs');let curList=[];
function showCat(c){curList=order.filter(k=>defs[k].c===c);bar.innerHTML='';
 curList.forEach((t,i)=>{const b=document.createElement('button');b.dataset.t=t;b.innerHTML=(i<9?(i+1)+'. ':'')+defs[t].n+'<small></small>';b.onclick=()=>setTool(t);bar.appendChild(b);});
 [...tabs.children].forEach(x=>x.classList.toggle('on',x.dataset.c===c));setTool(curList.includes(tool)?tool:curList[0]);stats();}
Object.keys(CATS).forEach(c=>{const b=document.createElement('button');b.dataset.c=c;b.textContent=CATS[c];b.onclick=()=>showCat(c);tabs.appendChild(b);});

const ray=new THREE.Raycaster(),mouse=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
function move(e){mouse.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(mouse,cam);
 if(!ray.ray.intersectPlane(plane,hit))return;const {fw,fd}=dims(tool,rot);
 cur.ax=Math.floor(hit.x-fw/2+0.5);cur.az=Math.floor(hit.z-fd/2+0.5);moveGhost();}
cv.addEventListener('pointerdown',e=>{if(e.button!==0)return;down=true;move(e);act();});
cv.addEventListener('pointermove',e=>{move(e);if(down&&(defs[tool].road||tool==='rail'||tool==='bulldoze'))act();});
addEventListener('pointerup',()=>down=false);
cv.addEventListener('wheel',e=>{view.dist=Math.max(12,Math.min(50,view.dist+e.deltaY*0.02));e.preventDefault();},{passive:false});
const keys={};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=true;
 if(k==='r'){rot=(rot+1)%4;moveGhost();}
 const n=parseInt(k);if(n>=1&&n<=curList.length)setTool(curList[n-1]);});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);

for(let i=0;i<150;i++){const x=Math.random()*N|0,z=Math.random()*N|0;if(x>13&&x<27&&z>14&&z<26)continue;if(grid[z*N+x])continue;
 const mesh=mkTree();mesh.position.set(x+0.5,0,z+0.5);scene.add(mesh);const o={t:'tree',mesh,cells:[z*N+x]};grid[z*N+x]=o;all.push(o);}
for(let x=14;x<=25;x++)build('road',x,20,0);

const D4=[[1,0],[-1,0],[0,1],[0,-1]];let trains=[];
function refreshRails(){all.forEach(o=>{if(o.t!=='rail')return;const x=o.cells[0]%N,z=o.cells[0]/N|0;
 const r=(a,b)=>{const q=at(x+a,z+b);return q&&(q.t==='rail'||q.t==='station');};
 const hx=r(1,0)||r(-1,0),hz=r(0,1)||r(0,-1);o.mesh.gx.visible=hx||!hz;o.mesh.gz.visible=hz;});}
function setupTrains(){trains.forEach(t=>scene.remove(t.mesh));trains=[];
 all.filter(o=>o.t==='station').forEach(s=>{let st=null;
  for(const i of s.cells){for(const [dx,dz] of D4){const o=at(i%N+dx,(i/N|0)+dz);if(o&&o.t==='rail')st=o.cells[0];}}
  if(st===null)return;
  const par=new Map([[st,null]]),q=[st];let far=st;
  while(q.length){const c=q.shift();far=c;for(const [dx,dz] of D4){const o=at(c%N+dx,(c/N|0)+dz);if(o&&o.t==='rail'){const i=o.cells[0];if(!par.has(i)){par.set(i,c);q.push(i);}}}}
  if(far===st)return;
  const path=[];for(let c=far;c!==null;c=par.get(c))path.push([c%N+0.5,(c/N|0)+0.5]);path.reverse();
  const mesh=mkTrain();scene.add(mesh);trains.push({mesh,path,p:0,dir:1});});}
function moveTrains(dt){trains.forEach(t=>{const len=t.path.length-1;t.p+=t.dir*dt*2.5;
 if(t.p>=len){t.p=len;t.dir=-1;}if(t.p<=0){t.p=0;t.dir=1;}
 const i=Math.min(Math.floor(t.p),len-1),f=t.p-i,a=t.path[i],b=t.path[i+1];
 t.mesh.position.set(a[0]+(b[0]-a[0])*f,0.03,a[1]+(b[1]-a[1])*f);
 t.mesh.rotation.y=Math.atan2(-(b[1]-a[1])*t.dir,(b[0]-a[0])*t.dir);});}
let last=performance.now();
function loop(now){const dt=Math.min((now-last)/1000,0.1);last=now;
 const sp=dt*view.dist*0.6,sy=Math.sin(view.yaw),cy=Math.cos(view.yaw);let fx=0,rx=0;
 if(keys.w||keys.arrowup)fx+=1;if(keys.s||keys.arrowdown)fx-=1;if(keys.d||keys.arrowright)rx+=1;if(keys.a||keys.arrowleft)rx-=1;
 view.x+=(-sy*fx+cy*rx)*sp;view.z+=(-cy*fx-sy*rx)*sp;
 view.x=Math.max(0,Math.min(N,view.x));view.z=Math.max(0,Math.min(N,view.z));
 if(keys.q)view.yaw-=dt*1.5;if(keys.e)view.yaw+=dt*1.5;
 if(!playing)view.yaw+=dt*0.08;moveTrains(dt);updateCam();renderer.render(scene,cam);requestAnimationFrame(loop);}
let playing=false;const $=i=>document.getElementById(i);
function save(){try{localStorage.setItem('gorodok1',JSON.stringify({m:money,b:all.filter(o=>o.t!=='tree').map(o=>[o.t,...o.a])}));}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem('gorodok1'));if(!d)return false;all.slice().forEach(o=>o.t!=='tree'&&remove(o));money=d.m;d.b.forEach(b=>build(b[0],b[1],b[2],b[3]));stats(1);return true;}catch(e){return false;}}
function play(){playing=true;$('menu').style.display='none';try{screen.orientation.lock('landscape').catch(()=>{});}catch(e){}}
function toMenu(){playing=false;$('menu').style.display='flex';}
let has=false;try{has=!!localStorage.getItem('gorodok1');}catch(e){}
$('cont').style.display=has?'':'none';
$('cont').onclick=()=>{if(load())play();};
$('newg').onclick=()=>{all.slice().forEach(o=>o.t!=='tree'&&remove(o));money=1500;for(let x=14;x<=25;x++)build('road',x,20,0);stats(1);play();};
$('howb').onclick=()=>$('how').classList.toggle('open');
$('pause').onclick=toMenu;
addEventListener('keydown',e=>{if(e.key==='Escape'&&playing)toMenu();});
showCat('road');stats(1);requestAnimationFrame(loop);
