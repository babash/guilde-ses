/* =====================================================================
   La Guilde des SES · rendu du personnage
   Personnage en pixel art (espèces, coiffures, tenues, accessoires) et familiers.
   ===================================================================== */
"use strict";
const CW=40,CH=64,CX=20,CONTOUR="#1b1530";
const _cc={};
function rgba(c){if(_cc[c])return _cc[c];const h=c.slice(1);const v=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),h.length>=8?parseInt(h.slice(6,8),16):255];_cc[c]=v;return v;}
const h2=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,"0");
function mix(a,b,t){const A=rgba(a),B=rgba(b);return "#"+h2(A[0]+(B[0]-A[0])*t)+h2(A[1]+(B[1]-A[1])*t)+h2(A[2]+(B[2]-A[2])*t);}
const fonce=(c,t=.22)=>mix(c,CONTOUR,t),clair=(c,t=.25)=>mix(c,"#ffffff",t);
const alpha=(c,a)=>c.slice(0,7)+h2(a*255);
class Calque{
  constructor(w=CW,h=CH){this.w=w;this.h=h;this.d=new Uint8ClampedArray(w*h*4);this.m=new Uint8Array(w*h);}
  px(x,y,c,solide=true){x=Math.round(x);y=Math.round(y);if(!c||x<0||y<0||x>=this.w||y>=this.h)return;const[r,g,b,a]=rgba(c);const i=(y*this.w+x)*4,d=this.d;
    if(a>=255){d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;}else{const sa=a/255,da=d[i+3]/255,oa=sa+da*(1-sa);if(oa<=0)return;d[i]=(r*sa+d[i]*da*(1-sa))/oa;d[i+1]=(g*sa+d[i+1]*da*(1-sa))/oa;d[i+2]=(b*sa+d[i+2]*da*(1-sa))/oa;d[i+3]=oa*255;}
    if(solide)this.m[y*this.w+x]=1;}
  rect(x,y,w,h,c,s){for(let j=0;j<h;j++)for(let i=0;i<w;i++)this.px(x+i,y+j,c,s);}
  ligne(x0,x1,y,c,s){for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)this.px(x,y,c,s);}
  carte(x,y,rows,pal,s){rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){const ch=r[i];if(ch!=="."&&pal[ch])this.px(x+i,y+j,pal[ch],s);}});}
  plein(x,y){x=Math.round(x);y=Math.round(y);return x>=0&&y>=0&&x<this.w&&y<this.h&&this.m[y*this.w+x]===1;}
  contour(c){const w=this.w,h=this.h,m=this.m,aj=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(m[y*w+x])continue;if((x>0&&m[y*w+x-1])||(x<w-1&&m[y*w+x+1])||(y>0&&m[(y-1)*w+x])||(y<h-1&&m[(y+1)*w+x]))aj.push(y*w+x);}
    const[r,g,b]=rgba(c);for(const k of aj){const i=k*4;this.d[i]=r;this.d[i+1]=g;this.d[i+2]=b;this.d[i+3]=255;}}
  sur(o,dx=0,dy=0){for(let y=0;y<o.h;y++)for(let x=0;x<o.w;x++){const i=(y*o.w+x)*4;if(!o.d[i+3])continue;const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=this.w||Y>=this.h)continue;const j=(Y*this.w+X)*4,sa=o.d[i+3]/255,da=this.d[j+3]/255,oa=sa+da*(1-sa);for(let k=0;k<3;k++)this.d[j+k]=(o.d[i+k]*sa+this.d[j+k]*da*(1-sa))/oa;this.d[j+3]=oa*255;}}
  toile(){const c=document.createElement("canvas");c.width=this.w;c.height=this.h;c.getContext("2d").putImageData(new ImageData(this.d,this.w,this.h),0,0);return c;}
}

/* ----- Catalogue de l'identité (gratuit) ----- */
const PEAUX_H=["#f6d7c0","#eec1a0","#e0ac80","#c68a5e","#a86b45","#8a5236","#6b3f28","#4a2c1d"];
const ESPECES={
  humain:{l:"Humain·e",peaux:PEAUX_H,oreilles:"rondes"},
  sylvestre:{l:"Elfe sylvestre",peaux:[...PEAUX_H,"#c8d8a8"],oreilles:"pointues"},
  lune:{l:"Elfe de lune",peaux:["#c9d8f2","#dfe6f7","#b4c4e8","#e8eef9"],oreilles:"pointues",lueur:true,marque:"lune"},
  nocturne:{l:"Elfe nocturne",peaux:["#7d6fc4","#9a86d6","#5f52a8","#b29ae0"],oreilles:"pointues",lueur:true,marque:"etoiles"},
  faune:{l:"Faune",peaux:PEAUX_H,oreilles:"chevre",cornes:true},
  renard:{l:"Renardin·e",peaux:["#d9772f","#b8562a","#e8a060","#8a8a92","#f2ece2","#4a3a3a"],oreilles:"renard",queue:"renard",museau:true},
  felin:{l:"Félin·e",peaux:["#9a8f86","#e09a4a","#2e2a36","#f2ece2","#c8b090","#7a6a8a"],oreilles:"chat",queue:"chat",moustaches:true},
  saurien:{l:"Saurien·ne",peaux:["#5f9a62","#4a8ab8","#c8553d","#8a6ad0","#d8b04a","#3f6a4a"],oreilles:"aucune",crete:true,queue:"lezard",ecailles:true,fente:true},
  champi:{l:"Champignonnier·e",peaux:["#efe2cf","#e2cdb0","#d8c8e8"],oreilles:"aucune",chapeauChampi:true},
  slime:{l:"Gélatineux·se",peaux:["#6fd6a8","#8ab8f2","#f2a6c8","#c8a6f2","#f2d06a"],oreilles:"aucune",jambes:"blob",translucide:.78},
  golem:{l:"Golem de mousse",peaux:["#8f9493","#a89a88","#7a8088"],oreilles:"aucune",mousse:true,lueur:true,carre:true},
  spectre:{l:"Spectre",peaux:["#dfe8ff","#e8dfff","#d8f2ec"],oreilles:"rondes",jambes:"brume",translucide:.82,lueur:true,flotte:true},
};
const PRONOMS=[["","Non précisés"],["il","il"],["elle","elle"],["iel","iel"],["ael","ael"],["ol","ol"],["libre","autre…"]];
const IRIS={brun:"#5a3a22",noisette:"#8a6a2a",vert:"#3f8a4a",bleu:"#3d6fd8",gris:"#7a8494",violet:"#7a4ac8",ambre:"#d99a1f",rouge:"#c03a3a",argent:"#cfe0ff",or:"#e8b84a"};
const YEUX={ronds:"Ronds",amande:"En amande",rieurs:"Rieurs",endormis:"Mi-clos"};
const BOUCHES={sourire:"Sourire",neutre:"Neutre",rire:"Rire",o:"Étonnée",mutin:"Mutine"};
const COIFFURES={aucun:"Sans cheveux",rase:"Rasé",court:"Court",undercut:"Undercut",mulet:"Mulet",carre:"Carré",long:"Long",tresses:"Tresses",locs:"Locs",afro:"Afro",chignon:"Chignon",couettes:"Couettes",crete:"Crête",frange:"Frange"};
const TEINTES_NAT={noir:["Noir","#1f1a24"],brun:["Brun","#4a2e1e"],chatain:["Châtain","#7a4e2d"],auburn:["Auburn","#8e3b1f"],roux:["Roux","#c2571d"],blond:["Blond","#d9b45a"],platine:["Platine","#eee3b8"],gris:["Gris","#9a9aa6"],blanc:["Blanc","#f2f0ea"]};
const ARCENCIEL=["#e8404a","#f08a2a","#f2d04a","#4ab86a","#4a86e0","#9a5ad8"];
const COULEURS_TENUE=["#4a6fa5","#3f8a5f","#8e3b4f","#7a5ad0","#2f2f3f","#e8e0d0","#c8553d","#e8b84a","#5a9ad8","#d87aa8","#6a4a2a","#3a7a7a","#1f1a24","#f2f0ea"];
const BARBES={aucune:"Aucune",courte:"Courte",longue:"Longue",moustache:"Moustache",bouc:"Bouc"};
const FARDS={"":"Aucun","#e8b84a":"Or","#b48ae8":"Violet","#5ad8d0":"Turquoise","#f08ab8":"Rose"};
const LEVRES={"":"Aucun","#1f1a24":"Noir","#c8243e":"Rouge","#7a2a8a":"Violet"};
const DRAPEAUX={
  progres:{l:"Arc-en-ciel inclusif",b:["#e40303","#ff8c00","#ffed00","#008026","#004dff","#750787"],chevron:["#ffffff","#f5a9b8","#5bcefa","#613915","#000000"]},
  trans:{l:"Trans",b:["#5bcefa","#f5a9b8","#ffffff","#f5a9b8","#5bcefa"]},
  nb:{l:"Non-binaire",b:["#fcf434","#ffffff","#9c59d1","#2c2c2c"]},
  bi:{l:"Bi",b:["#d60270","#d60270","#9b4f96","#0038a8","#0038a8"]},
  pan:{l:"Pan",b:["#ff218c","#ffd800","#21b1ff"]},
  lesbienne:{l:"Lesbienne",b:["#d52d00","#ff9a56","#ffffff","#d362a4","#a30262"]},
  gay:{l:"Gay",b:["#078d70","#26ceaa","#98e8c1","#ffffff","#7bade2","#5049cc","#3d1a78"]},
  ace:{l:"Asexuel·le",b:["#000000","#a3a3a3","#ffffff","#800080"]},
  aro:{l:"Aromantique",b:["#3da542","#a7d379","#ffffff","#a9a9a9","#000000"]},
  inter:{l:"Intersexe",b:["#ffd800"],anneau:"#7902aa"},
  fluide:{l:"Genderfluid",b:["#ff75a2","#ffffff","#be18d6","#000000","#333ebd"]},
  agenre:{l:"Agenre",b:["#000000","#bcc4c7","#ffffff","#b7f684","#ffffff","#bcc4c7","#000000"]},
};
const PERSO0={nom:"",pronom:"",pronomLibre:"",espece:"humain",silhouette:"moyenne",taille:"moyenne",peau:"#e0ac80",yeux:"ronds",iris:"#5a3a22",bouche:"sourire",
  rousseur:false,vitiligo:false,grain:false,cicatrice:false,blush:false,barbe:"aucune",eyeliner:false,fard:"",levres:"",septum:false,arcade:false,boucles:false,
  coiffure:"court",teinte:"brun",haut:"tunique",hautC:"#4a6fa5",bas:"pantalon",basC:"#3a3450",jambes:"",pieds:"bottes",tete:"",visage:"",oreilles:"",dos:"",main:"",
  drapeau:"",badge:false,badgePronoms:false,champi:"rouge",familier:"chat",famAcc:"",famNom:"",attitude:"saluer",succes:"confettis",erreur:"oups",compagnon:true};

/* ----- Géométrie du corps ----- */
function geom(cfg){
  const E=ESPECES[cfg.espece]||ESPECES.humain;const sj=!!E.jambes;
  const rangers=cfg.pieds==="rangers"&&!sj;const shoeH=rangers?6:3;const legLen={petite:6,moyenne:8,grande:10}[cfg.taille]||8;
  const G=CH-4,legTop=G-shoeH-legLen+1,ty=legTop-10,hy=ty-15;const tw={fine:8,moyenne:10,ronde:12}[cfg.silhouette]||10;
  const tx0=CX-tw/2,tx1=CX+tw/2-1,legW=tw>=12?4:3;
  return{E,sj,rangers,shoeH,legLen,G,legTop,ty,hy,tw,tx0,tx1,legW,lx0:CX-1-legW,rx0:CX+1,hx0:CX-7,hx1:CX+6,sy0:G-shoeH+1,ey:hy+7};
}
function leve(c,x,y0,y1,s){for(let y=y0,k=0;y>=y1;y--,k++){const dx=s*Math.floor(k/2);c.push([x+dx,y],[x+1+dx,y]);}}
function vseg(c,x,y0,y1){const s=y0<=y1?1:-1;for(let y=y0;s>0?y<=y1:y>=y1;y+=s)c.push([x,y],[x+1,y]);}
function hseg(c,y,x0,x1){const s=x0<=x1?1:-1;for(let x=x0;s>0?x<=x1:x>=x1;x+=s)c.push([x,y],[x,y+1]);}
function brasPose(g,pose,onde){
  const ty=g.ty,l=g.tx0-2,r=g.tx1+1,L=[],R=[];const bas=(c,x)=>vseg(c,x,ty+1,ty+9);
  switch(pose){
    case "salut":bas(L,l);leve(R,r,ty+1,ty-4,1);{const o=(onde?1:0)+3;R.push([r+o,ty-5],[r+1+o,ty-5],[r+o+(onde?1:0),ty-6],[r+1+o+(onde?1:0),ty-6]);}break;
    case "haut":leve(L,l,ty+1,ty-6,-1);leve(R,r,ty+1,ty-6,1);break;
    case "danseD":bas(L,l);leve(R,r,ty+1,ty-6,1);break;
    case "danseG":leve(L,l,ty+1,ty-6,-1);bas(R,r);break;
    case "ecartes":hseg(L,ty+1,g.tx0-1,g.tx0-9);hseg(R,ty+1,g.tx1+1,g.tx1+9);break;
    case "ecartesBas":vseg(L,l,ty+1,ty+4);hseg(L,ty+5,l-1,l-4);vseg(R,r,ty+1,ty+4);hseg(R,ty+5,r+2,r+5);break;
    case "epaules":vseg(L,l,ty+1,ty+4);vseg(L,l-2,ty+4,ty+1);vseg(R,r,ty+1,ty+4);vseg(R,r+2,ty+4,ty+1);break;
    case "lecture":vseg(L,l,ty+1,ty+5);hseg(L,ty+6,l+2,CX-3);vseg(R,r,ty+1,ty+5);hseg(R,ty+6,r-1,CX+2);break;
    case "reverence":bas(L,l);vseg(R,r,ty+1,ty+3);hseg(R,ty+4,r-1,CX);break;
    case "jongleA":leve(L,l,ty+1,ty-6,-1);leve(R,r,ty+1,ty-2,1);break;
    case "jongleB":leve(L,l,ty+1,ty-2,-1);leve(R,r,ty+1,ty-6,1);break;
    default:bas(L,l);bas(R,r);
  }
  return{L,R};
}
/* longueur des manches, en cellules (2 par rangée) ; -1 = jusqu'au poignet */
const MANCHES={tunique:8,"robe-mage":-1,salopette:6,sweat:-1,jabot:-1,armure:0,pull:-2,gilet:-1,crop:4,costume:-1,"robe-bal":6};
function couleurCheveux(cfg){if(cfg.teinte==="arcenciel")return null;const n=TEINTES_NAT[cfg.teinte];if(n)return n[1];const it=ITEMS_PAR_ID["teinte:"+cfg.teinte];return it?it.c:"#4a2e1e";}

function peindre(cfg,pose={}){
  const g=geom(cfg),E=g.E;const B=new Calque(),L=new Calque(),F=new Calque();
  const sk=cfg.peau||E.peaux[0],T=E.translucide||1;const S_=c=>T<1?alpha(c,T):c;
  const skS=fonce(sk,.18),skH=clair(sk,.18);
  const hcBase=couleurCheveux(cfg);const hc=y=>hcBase||ARCENCIEL[((y-g.hy+6)>>1)%6];
  const H=(x,y)=>L.px(x,y,hc(y)),HR=(x0,x1,y)=>{for(let x=x0;x<=x1;x++)H(x,y);};
  const hy=pose.tete==="baisse"?g.hy+2:g.hy,ey=hy+7,x0=g.hx0,x1=g.hx1,ty=g.ty;
  const haut=cfg.haut||"tunique",hC=cfg.hautC,hS=fonce(hC,.22),hH=clair(hC,.2);
  const robe=haut==="robe-mage"||haut==="robe-bal";
  const coif=E.chapeauChampi?"aucun":(cfg.coiffure||"aucun");
  const pointues=E.oreilles==="pointues"||cfg.oreilles==="oreilles-elfe";
  /* ---------- arrière : ailes ---------- */
  if(cfg.dos==="ailes-spectrales"||cfg.dos==="ailes-fee"||cfg.dos==="ailes-chauve")peindreAiles(B,g,cfg.dos,pose.f||0);
  /* ---------- arrière : cape, sac, queue, cheveux longs, capuche ---------- */
  if(cfg.dos==="cape-fiertes"){const D=DRAPEAUX[cfg.drapeau]||DRAPEAUX.progres;const h=g.legTop+7-ty;
    for(let k=0;k<h;k++){const half=g.tw/2+2+Math.floor(k/4);const c=D.b[Math.min(D.b.length-1,Math.floor(k*D.b.length/h))];for(let x=CX-half;x<CX+half;x++)L.px(x,ty+k,x===CX-half||x===CX+half-1?fonce(c,.12):c);}
    if(D.anneau){for(let a=0;a<12;a++){L.px(CX+Math.round(Math.cos(a/12*6.283)*3)-1,ty+h-6+Math.round(Math.sin(a/12*6.283)*3),D.anneau);}}}
  if(cfg.dos==="sac-livres"){L.rect(g.tx0-1,ty+1,g.tw+2,8,"#7a5320");[["#c8453d",0],["#3f8a5f",2],["#3d6fd8",4]].forEach(([c,o])=>L.rect(g.tx1-4+o,ty-4+(o%4?1:0),2,5,c));L.rect(g.tx0-1,ty-2,2,3,"#e8b84a");}
  if(E.queue&&!g.sj)peindreQueue(L,g,E.queue,sk,pose.f||0);
  if(["long","frange","locs"].includes(coif)){for(let y=hy+2;y<=ty+7;y++){const w=y>ty+5?1:2;HR(x0-w,x0-1,y);HR(x1+1,x1+w,y);HR(x0,x1,y);}}
  if(coif==="mulet")for(let y=hy+8;y<=ty+1;y++)HR(x0+1,x1-1,y);
  if(coif==="afro"){const cy=hy+4;for(let y=hy-7;y<=hy+14;y++)for(let x=CX-12;x<=CX+11;x++){const dx=x-CX+.5,dy=y-cy;if(dx*dx+dy*dy<=11.6*11.6)L.px(x,y,((x*7+y*3)%5===0)?fonce(hc(y),.18):hc(y));}}
  if(haut==="sweat")L.rect(g.tx0-1,ty-2,g.tw+2,4,hS);
  /* ---------- jambes ---------- */
  const legC=E.cornes?"#6b4a30":sk;
  if(E.jambes){
    if(E.jambes==="blob"){for(let y=g.legTop;y<=g.G;y++){const k=y-g.legTop;const half=g.tw/2+Math.floor(k/3)+(y>=g.G-1?2:0);L.rect(CX-half,y,half*2,1,S_(k%5===2?skH:sk));}L.px(CX-3,g.legTop+3,alpha("#ffffff",.6));L.px(CX+2,g.G-3,alpha("#ffffff",.5));}
    else{for(let y=g.legTop;y<=g.G-2;y++){const k=y-g.legTop;const half=Math.max(1,g.tw/2-Math.floor(k/2));const sw=Math.round(Math.sin(k*.8)*1.2);const a=Math.max(.15,.85-k*.07);L.rect(CX-half+sw,y,half*2,1,alpha(sk,a),k<3);}}
  }else{
    [g.lx0,g.rx0].forEach((lx,i)=>{L.rect(lx,g.legTop,g.legW,g.legLen,S_(legC));for(let y=g.legTop;y<g.legTop+g.legLen;y++)L.px(i?lx:lx+g.legW-1,y,S_(fonce(legC,.14)));});
    if(E.cornes)for(let y=g.legTop+1;y<g.legTop+g.legLen;y+=2){L.px(g.lx0,y,"#8a6a4a");L.px(g.rx0+g.legW-1,y,"#8a6a4a");}
    if(E.ecailles)for(let y=g.legTop+1;y<g.legTop+g.legLen;y+=3){L.px(g.lx0+1,y,skS);L.px(g.rx0+1,y+1,skS);}
    if(cfg.jambes==="collants")[g.lx0,g.rx0].forEach(lx=>{for(let y=g.legTop;y<g.legTop+g.legLen;y++)L.rect(lx,y,g.legW,1,((y-g.legTop)>>1)%2?"#8a5ad0":"#1f1a2a");});
    peindreBas(L,g,cfg,haut,robe);
    peindreChaussures(L,g,cfg,sk,E);
  }
  /* ---------- torse ---------- */
  L.rect(g.tx0,ty,g.tw,10,S_(sk));L.rect(CX-2,ty-1,4,1,S_(skS));
  peindreHaut(L,g,cfg,haut,hC,hS,hH,sk,S_);
  if(cfg.badge&&cfg.drapeau){const D=DRAPEAUX[cfg.drapeau];const bx=g.tx0+1,by=ty+2;for(let j=0;j<4;j++)for(let i=0;i<4;i++){let c=D.b[Math.floor(j*D.b.length/4)];if(D.chevron&&i===0)c=D.chevron[j%5];if(D.anneau&&(i===1||i===2)&&(j===1||j===2))c=D.anneau;L.px(bx+i,by+j,c);}}
  if(cfg.dos==="sac-livres"){L.rect(g.tx0+1,ty,1,6,"#5a3d18");L.rect(g.tx1-1,ty,1,6,"#5a3d18");}
  if(cfg.dos==="cape-fiertes"){L.px(g.tx0,ty,"#e8b84a");L.px(g.tx1,ty,"#e8b84a");}
  if(E.mousse){[[g.tx0,ty],[g.tx0+1,ty],[g.tx1,ty],[g.tx1-1,ty],[g.tx1,ty+1]].forEach(([x,y],i)=>L.px(x,y,i%2?"#7fbf4f":"#5f9a3f"));}
  /* ---------- bras ---------- */
  const{L:bl,R:br}=brasPose(g,pose.bras||"repos",pose.onde);
  const man=MANCHES[haut]??8;
  const mc=(haut==="salopette"||haut==="gilet")?"#efe6d2":haut==="jabot"?hC:hC;
  [bl,br].forEach((cells,side)=>{const n=cells.length;const lim=man===-1?n-2:man===-2?n-1:man;cells.forEach(([x,y],i)=>{let c;if(i<lim){c=i%2?fonce(mc,.16):mc;if(haut==="robe-mage"&&i>=n-6)c=i%2?"#c9963b":"#e8b84a";if(haut==="sweat"&&i>=lim-2)c=fonce(mc,.3);if(haut==="jabot"&&i>=lim-2)c="#fffaf0";}else c=i%2?skS:sk;L.px(x,y,S_(c));});
    if(haut==="armure"&&cells.length>8){for(let i=n-6;i<n-2;i++){const[x,y]=cells[i];L.px(x,y,i%2?"#5a3a22":"#7a5532");}}
    if(haut==="robe-mage"&&pose.bras!=="haut"&&!pose.bras){const[x,y]=cells[n-3];L.px(side?x+2:x-1,y,"#e8b84a");}
  });
  if(haut==="armure"){[[g.tx0-3,1],[g.tx1,0]].forEach(([px0])=>{L.rect(px0,ty-1,4,1,"#7a5532");L.rect(px0,ty,4,2,"#8a6a42");L.ligne(px0,px0+3,ty+2,"#5a3a22");L.px(px0+1,ty,"#cfd4e0");});}
  if(haut==="robe-bal"){[[g.tx0-3],[g.tx1+1]].forEach(([px0])=>{L.rect(px0,ty,3,3,hH);L.ligne(px0,px0+2,ty+2,hS);});}
  if(E.ecailles)[[bl,3],[br,5]].forEach(([c,i])=>{if(c[i])L.px(c[i][0],c[i][1],skS);});
  const main=br[br.length-1];
  /* ---------- tête ---------- */
  const tete=(x,y,c)=>L.px(x,y,S_(c));
  for(let y=hy;y<=hy+13;y++){const k=y-hy;let a=x0,b=x1;if(!E.carre){if(k===0||k===13){a+=3;b-=3;}else if(k===1||k===12){a+=1;b-=1;}}else if(k===0||k===13){a+=1;b-=1;}for(let x=a;x<=b;x++)tete(x,y,x===b||(k>=11&&x>=b-1)?skS:(k===2&&x<=a+2?skH:sk));}
  if(E.oreilles==="rondes"&&!pointues){[[x0-1],[x1+1]].forEach(([x])=>{tete(x,ey,sk);tete(x,ey+1,skS);tete(x,ey+2,sk);});}
  if(E.oreilles==="chevre"){[[x0-4,1],[x1+1,-1]].forEach(([x,s])=>{for(let i=0;i<4;i++){tete(x+i,ey-1,sk);tete(x+i,ey,i===(s>0?1:2)?"#f0a6b8":sk);}tete(s>0?x:x+3,ey+1,sk);});}
  if(E.marque==="lune"){[[CX-1,hy+3],[CX,hy+2],[CX,hy+4]].forEach(([x,y])=>L.px(x,y,"#f4f8ff"));}
  if(E.marque==="etoiles"){L.px(x0+2,ey+3,"#f4f0ff");L.px(x1-2,ey+3,"#f4f0ff");L.px(x0+3,ey+4,alpha("#f4f0ff",.7));}
  if(E.museau){for(let y=ey+3;y<=hy+13;y++)for(let x=x0+3;x<=x1-3;x++)if(L.plein(x,y))L.px(x,y,"#fbf3e8");L.rect(CX-1,ey+2,2,1,"#2b1f2a");}
  if(E.moustaches)L.rect(CX-1,ey+2,2,1,"#e89ab0");
  if(E.ecailles){[[x0+1,ey+3],[x0+2,ey+4],[x1-1,ey+3],[x1-2,ey+4],[x0+3,hy+3],[x1-3,hy+4]].forEach(([x,y])=>L.px(x,y,skS));}
  if(cfg.vitiligo){[[CX-6,ey-1],[CX-5,ey-1],[CX-6,ey],[CX-6,ey+1],[CX+3,hy+11],[CX+4,hy+11],[CX+4,hy+12],[CX+5,hy+10]].forEach(([x,y])=>L.px(x,y,mix(sk,"#fff4ea",.55)));main&&L.px(main[0],main[1],mix(sk,"#fff4ea",.55));}
  if(cfg.rousseur){[[CX-5,ey+2],[CX-3,ey+3],[CX-6,ey+3],[CX+2,ey+3],[CX+4,ey+2],[CX+5,ey+3]].forEach(([x,y])=>L.px(x,y,fonce(sk,.3)));}
  if(cfg.blush||cfg.espece==="slime"){L.px(CX-6,ey+3,alpha("#ff7fa0",.55));L.px(CX+5,ey+3,alpha("#ff7fa0",.55));}
  if(cfg.grain)L.px(CX+3,hy+11,"#4a2c1d");
  /* yeux */
  const iris=cfg.iris||"#5a3a22",forme=pose.yeux||cfg.yeux;const lid=E.lueur?fonce(iris,.55):"#2b2143";
  [[CX-4,-1],[CX+2,1]].forEach(([ex,s])=>{
    if(E.carre&&E.mousse){L.rect(ex,ey+1,2,1,clair(iris,.35));return;}
    if(forme==="endormis"){L.rect(ex,ey+1,2,1,"#2b2143");return;}
    if(forme==="rieurs"){L.px(s<0?ex:ex+1,ey+1,"#2b2143");L.px(s<0?ex+1:ex,ey,"#2b2143");L.px(s<0?ex-1:ex+2,ey+1,"#2b2143");return;}
    L.rect(ex,ey,2,1,lid);L.rect(ex,ey+1,2,1,E.lueur?clair(iris,.3):iris);
    if(E.fente)L.px(s<0?ex+1:ex,ey+1,"#1b1530");else if(forme!=="amande")L.px(s<0?ex+1:ex,ey+1,"#ffffff");
    if(forme==="amande"||cfg.eyeliner)L.px(s<0?ex-1:ex+2,ey,"#1b1530");
    if(cfg.fard)L.px(s<0?ex:ex+1,ey-1,cfg.fard);
    if(E.lueur)F.px(s<0?ex-1:ex+2,ey+1,alpha(clair(iris,.5),.55),false);
  });
  if(cfg.cicatrice){[[CX-3,ey-2],[CX-3,ey-1],[CX-4,ey+2],[CX-4,ey+3]].forEach(([x,y])=>L.px(x,y,mix(sk,"#a8404a",.45)));}
  /* sourcils (sauf frange épaisse) */
  if(coif!=="frange"){const bc=hcBase?fonce(hcBase,.1):"#4a2e1e";[[CX-4],[CX+2]].forEach(([x])=>{L.rect(x,ey-2,2,1,coif==="aucun"&&!hcBase?fonce(sk,.25):bc);});}
  /* bouche */
  const BM={sourire:["d..d",".dd."],neutre:["....",".dd."],rire:["dddd",".rr."],o:[".dd.",".dd."],mutin:["...d","ddd."]};
  const lev=cfg.levres||"";const bm=BM[cfg.bouche]||BM.sourire;
  L.carte(CX-2,hy+10,bm,{d:lev||(E.lueur?fonce(sk,.5):"#5a2a35"),r:"#e8606a"});
  if(lev&&cfg.bouche==="neutre")L.rect(CX-2,hy+11,4,1,lev);
  if(cfg.septum)L.px(CX-1,hy+9,"#dfe6f7");
  /* barbe */
  if(cfg.barbe&&cfg.barbe!=="aucune"){const bh=y=>hc(y);
    if(cfg.barbe==="courte"||cfg.barbe==="longue"){for(let y=hy+9;y<=hy+13;y++)for(let x=x0;x<=x1;x++){if(!L.plein(x,y))continue;const bouche=y>=hy+10&&y<=hy+11&&x>=CX-2&&x<=CX+1;if(bouche)continue;if(y>=hy+12||x<=x0+2||x>=x1-2||y===hy+9&&x>=CX-3&&x<=CX+2)L.px(x,y,bh(y));}}
    if(cfg.barbe==="longue"){for(let k=0;k<4;k++)L.rect(CX-4+Math.floor(k/1.5),hy+14+k,8-2*Math.floor(k/1.5),1,bh(hy+14+k));}
    if(cfg.barbe==="moustache"){L.rect(CX-3,hy+9,6,1,bh(hy+9));L.px(CX-3,hy+10,bh(hy+10));L.px(CX+2,hy+10,bh(hy+10));}
    if(cfg.barbe==="bouc"){L.rect(CX-2,hy+12,4,2,bh(hy+12));L.rect(CX-1,hy+14,2,1,bh(hy+14));}
  }
  /* cheveux devant */
  peindreCoiffure(L,g,coif,hy,hc,sk);
  /* oreilles pointues (par-dessus la chevelure) */
  if(pointues){const OP=["x....",".xx..",".xxx.","..xxx","...xx","....x"];OP.forEach((r,j)=>{for(let i=0;i<5;i++)if(r[i]==="x"){tete(x0-5+i,hy+4+j,j===3&&i===3?skS:sk);tete(x1+5-i,hy+4+j,j===3&&i===3?skS:sk);}});
    if(cfg.oreilles==="oreilles-elfe"){[[x0-3,hy+6],[x0-2,hy+8]].forEach(([x,y])=>{L.px(x,y,"#e8eef9");L.px(2*CX-1-x,y,"#e8eef9");});}
    if(cfg.boucles)L.px(x0-1,hy+9,"#dfe6f7"),L.px(x1+1,hy+9,"#dfe6f7");}
  else if(cfg.boucles&&E.oreilles==="rondes"){L.px(x0-1,ey+2,"#dfe6f7");L.px(x1+1,ey+2,"#dfe6f7");}
  if(cfg.arcade)L.px(CX+4,ey-2,"#dfe6f7");
  if(E.oreilles==="renard"||E.oreilles==="chat"){const fox=E.oreilles==="renard";const M=fox?["x...","xx..","xix.","xiix","xxxx"]:[".x..","xx..","xix.","xxxx"];const top=hy-M.length+1;
    M.forEach((r,j)=>{for(let i=0;i<4;i++){if(r[i]==="."||!r[i])continue;const c=r[i]==="i"?(fox?"#fbf3e8":"#f0a6b8"):sk;tete(x0+1+i,top+j,c);tete(x1-1-i,top+j,c);}});}
  if(E.cornes){const C=[[CX-5,hy-1],[CX-5,hy-2],[CX-6,hy-3],[CX-6,hy-4],[CX-7,hy-5],[CX-8,hy-5],[CX-4,hy-1],[CX-4,hy-2],[CX-5,hy-3]];C.forEach(([x,y],i)=>{const c=i%3===1?"#a89870":"#e2d4b0";L.px(x,y,c);L.px(2*CX-1-x,y,c);});}
  if(E.crete){[[CX-1,hy-1],[CX,hy-1],[CX-1,hy-2],[CX,hy-3],[CX+1,hy],[CX+2,hy-1],[CX-3,hy],[CX-2,hy-1],[CX-3,hy-1]].forEach(([x,y])=>L.px(x,y,fonce(sk,.35)));}
  if(E.mousse){for(let x=x0;x<=x1;x++){const h=(x*5)%3;for(let y=hy;y<=hy+h;y++)if(L.plein(x,y))L.px(x,y,(x+y)%2?"#5f9a3f":"#7fbf4f");}L.px(x0+3,hy,"#f0a6c8");L.px(x1-4,hy+1,"#f2d06a");}
  let hatY=hy;if(coif==="afro")hatY=hy-5;else if(coif==="crete")hatY=hy-3;else if(coif==="chignon")hatY=hy-2;
  if(E.chapeauChampi){peindreChampi(L,F,cfg.champi,hy);hatY=hy-5;}
  /* visage : lunettes */
  peindreVisage(L,F,g,cfg.visage,ey,x0,x1,ty);
  /* couvre-chef */
  if(!pose.sansChapeau&&cfg.tete)peindreChapeau(L,g,cfg.tete,hatY,x0,x1,hy);
  /* objet tenu */
  if(pose.livre)peindreLivreOuvert(L,ty);
  else if(cfg.main&&(!pose.bras||pose.bras==="repos"))peindreObjet(L,F,g,cfg.main,main,pose.f||0);
  if(pose.livre&&bl.length){[bl[bl.length-1],br[br.length-1]].forEach(([x,y])=>{L.px(x,y,S_(sk));L.px(x,y+1,S_(skS));});}
  /* finition */
  L.contour(T<1?fonce(sk,.5):CONTOUR);
  if(E.moustaches){[[x0-2,ey+3],[x0-1,ey+3],[x0-2,ey+5],[x0-1,ey+4],[x1+1,ey+3],[x1+2,ey+3],[x1+1,ey+4],[x1+2,ey+5]].forEach(([x,y])=>F.px(x,y,"#2b2143",false));}
  if(E.translucide){F.px(x0+2,hy+2,alpha("#ffffff",.75),false);F.px(x0+3,hy+2,alpha("#ffffff",.5),false);if(cfg.espece==="slime"){for(let a=0;a<8;a++)F.px(CX+2+Math.round(Math.cos(a*.785)*1.5),ty+4+Math.round(Math.sin(a*.785)*1.5),alpha("#ffffff",.55),false);}}
  const R=new Calque();R.sur(B);R.sur(L);R.sur(F);
  return{c:R,g,main,hatY};
}
function peindreChapeauSeul(cfg){const g=geom(cfg);const L=new Calque();const coif=g.E.chapeauChampi?"aucun":cfg.coiffure;let hatY=g.hy;if(coif==="afro")hatY-=5;else if(coif==="crete")hatY-=3;else if(coif==="chignon")hatY-=2;if(g.E.chapeauChampi)hatY=g.hy-5;peindreChapeau(L,g,cfg.tete||"beret",hatY,g.hx0,g.hx1,g.hy);L.contour(CONTOUR);return L;}

function peindreCoiffure(L,g,coif,hy,hc,sk){
  const x0=g.hx0,x1=g.hx1,ty=g.ty;const H=(x,y,c)=>L.px(x,y,c||hc(y));const HR=(a,b,y,c)=>{for(let x=a;x<=b;x++)H(x,y,c);};const hl=y=>clair(hc(y),.22);
  const casque=(fr)=>{HR(x0+3,x1-3,hy-1);HR(x0+1,x1-1,hy);HR(x0,x1,hy+1);HR(x0,x1,hy+2);if(fr)HR(x0,x1,hy+3);HR(x0+3,x0+6,hy,hl(hy));};
  const stub=c=>mix(sk,hc(hy),c);
  switch(coif){
    case "rase":HR(x0+3,x1-3,hy,stub(.55));HR(x0+1,x1-1,hy+1,stub(.5));[hy+2,hy+3,hy+4].forEach(y=>{H(x0,y,stub(.45));H(x1,y,stub(.45));});break;
    case "court":casque(1);[x0,x0+1,x0+5,x0+6,x0+7,x1-1,x1].forEach(x=>H(x,hy+4));[hy+5,hy+6].forEach(y=>{H(x0,y);H(x1,y);});break;
    case "undercut":HR(x0+3,x1-5,hy-2);HR(x0+1,x1-3,hy-1);HR(x0,x1-2,hy);HR(x0,x1-2,hy+1);HR(x0,x1-3,hy+2);HR(x0,x0+7,hy+3);HR(x0,x0+4,hy+4);H(x0,hy+5);HR(x0+2,x0+5,hy-1,hl(hy));
      for(let y=hy+1;y<=hy+6;y++){H(x1-1,y,stub(.45));H(x1,y,stub(.45));}H(x1-2,hy+1,stub(.45));break;
    case "mulet":casque(1);[x0,x0+1,x0+4,x0+5,x1-4,x1-1,x1].forEach(x=>H(x,hy+4));for(let y=hy+5;y<=hy+11;y++){H(x0,y);H(x1,y);}break;
    case "carre":case "long":casque(1);for(let x=x0;x<=x1;x++)if(x!==CX-1&&x!==CX)H(x,hy+4);
      {const bas=coif==="long"?ty+3:hy+11;for(let y=hy+1;y<=bas;y++){H(x0-1,y);H(x0,y);H(x1,y);H(x1+1,y);}if(coif==="carre"){H(x0+1,hy+11);H(x1-1,hy+11);}}break;
    case "frange":HR(x0+3,x1-3,hy-1);HR(x0+1,x1-1,hy);for(let y=hy+1;y<=hy+5;y++)HR(x0,x1,y);HR(x0+3,x0+6,hy,hl(hy));for(let y=hy+1;y<=hy+12;y++){H(x0-1,y);H(x0,y);H(x1,y);H(x1+1,y);}break;
    case "tresses":casque(1);H(CX-1,hy+1,fonce(hc(hy+1),.25));H(CX-1,hy+2,fonce(hc(hy+2),.25));HR(x0,x0+2,hy+4);HR(x1-2,x1,hy+4);for(let y=hy+5;y<=hy+9;y++){H(x0,y);H(x1,y);}
      for(let y=hy+9;y<=ty+8;y++){const c=(y%2)?hc(y):fonce(hc(y),.2);H(x0-1,y,c);H(x0,y,c);H(x1,y,c);H(x1+1,y,c);}[[x0-1],[x1]].forEach(([x])=>{L.rect(x,ty+9,2,1,"#c8453d");L.px(x+(x<CX?0:1),ty+10,hc(ty+10));});break;
    case "locs":casque(1);for(let y=hy+4;y<=hy+10;y++){H(x0,y);H(x0+2,y);H(x1-2,y);H(x1,y);}
      for(let y=hy+3;y<=ty+6;y++){[x0-2,x0-1,x1+1,x1+2].forEach((x,i)=>{if((i+(y>>2))%2===0||y<hy+8)H(x,y,(y%3)?hc(y):fonce(hc(y),.25));});}L.px(x0-2,ty+7,"#e8b84a");L.px(x1+2,ty+7,"#e8b84a");break;
    case "afro":HR(x0+1,x1-1,hy);HR(x0,x1,hy+1);HR(x0,x1,hy+2);[hy+3,hy+4,hy+5,hy+6].forEach(y=>{H(x0,y);H(x1,y);});break;
    case "chignon":HR(x0+3,x1-3,hy-1);HR(x0+1,x1-1,hy);HR(x0,x1,hy+1);HR(x0,x1,hy+2);H(x0,hy+3);H(x1,hy+3);
      HR(CX-2,CX+1,hy-5);HR(CX-3,CX+2,hy-4);HR(CX-3,CX+2,hy-3);HR(CX-3,CX+2,hy-2);HR(CX-2,CX+1,hy-1);H(CX-2,hy-4,hl(hy));L.px(CX+3,hy-5,"#e8b84a");L.px(CX+4,hy-6,"#e8b84a");break;
    case "couettes":casque(1);HR(x0,x0+1,hy+4);HR(x1-1,x1,hy+4);
      {const P=[[3,-2,-1],[4,-3,-1],[5,-4,-1],[6,-5,-2],[7,-5,-2],[8,-5,-2],[9,-5,-3],[10,-4,-4]];P.forEach(([dy,a,b])=>{for(let x=a;x<=b;x++){H(x0+x,hy+dy);H(x1-x,hy+dy);}});L.rect(x0-2,hy+3,2,1,"#f08ab8");L.rect(x1+1,hy+3,2,1,"#f08ab8");}break;
    case "crete":for(let y=hy-6;y<=hy+2;y++){const w=y===hy-6?0:1;HR(CX-1-w,CX+w,y);}H(CX-1,hy-5,hl(hy));
      HR(x0+3,CX-3,hy,stub(.5));HR(CX+2,x1-3,hy,stub(.5));for(let y=hy+1;y<=hy+5;y++){H(x0,y,stub(.45));H(x0+1,y,stub(.4));H(x1,y,stub(.45));H(x1-1,y,stub(.4));}break;
  }
}
function peindreChampi(L,F,v,hy){const cap={rouge:"#c8453d",brun:"#8a5a32",bleu:"#3f6ad8"}[v]||"#c8453d";const sp=v==="bleu"?"#9ff2ff":v==="brun"?"#c8a06a":"#fbf3e8";
  const R=[[-6,-4,3],[-5,-7,6],[-4,-8,7],[-3,-9,8],[-2,-9,8],[-1,-9,8],[0,-9,8],[1,-9,8],[2,-10,9],[3,-10,9]];R.forEach(([dy,a,b])=>L.ligne(CX+a,CX+b,hy+dy,dy>=2?fonce(cap,.15):cap));
  L.ligne(CX-9,CX+8,hy+4,"#efe2c8");for(let x=CX-8;x<=CX+7;x+=2)L.px(x,hy+4,"#d6c4a0");
  [[-5,-3],[-1,-5],[3,-2],[6,0],[-7,0],[1,1]].forEach(([dx,dy])=>{L.px(CX+dx,hy+dy,sp);L.px(CX+dx+1,hy+dy,sp);if(v==="bleu")F.px(CX+dx,hy+dy-1,alpha("#9ff2ff",.4),false);});}
function peindreQueue(L,g,q,sk,f){const b=g.tx1+1,y0=g.legTop-1;
  if(q==="renard"){const P=[[0,4,2],[1,3,3],[2,2,4],[3,1,5],[4,0,5],[5,-1,5],[6,-2,4],[7,-3,3]];P.forEach(([dx,dy,h])=>{for(let k=0;k<h;k++)L.px(b+dx,y0+dy-k+(f&&dx>5?1:0),dx>=6?"#fbf3e8":k===0?fonce(sk,.15):sk);});}
  else if(q==="chat"){const P=[[0,4],[1,3],[2,2],[2,1],[3,0],[3,-1],[3,-2],[2,-3],[2+(f?1:0),-4]];P.forEach(([dx,dy])=>{L.px(b+dx,y0+dy,sk);});}
  else{for(let k=0;k<9;k++){const h=Math.max(1,4-Math.floor(k/2.5));for(let j=0;j<h;j++)L.px(b-2+k,g.G-1-j-Math.floor((8-k)/3),j===0?fonce(sk,.2):sk);}}}
function peindreAiles(B,g,t,f){const ty=g.ty;
  const cote=s=>{const ax=s<0?g.tx0-1:g.tx1+1;const P=(i,y,c,sol)=>B.px(ax+s*i,y,c,!!sol);
    if(t==="ailes-spectrales"){const yt=g.hy+1-f,yb=g.legTop+1,M=14+(f?1:0);const dans=(i,y)=>{if(y<yt||y>yb||i<0)return false;const inner=y<ty?Math.round(M*(ty-y)/(ty-yt))-1:0;let outer=Math.round(3+(M-3)*(1-Math.pow((y-yt)/(yb-yt),.85)));if(y>ty+2)outer-=((y-ty)%3===0?2:(y-ty)%3===1?1:0);return i>=inner&&i<=outer;};
      for(let y=yt;y<=yb;y++)for(let i=0;i<=M+1;i++){if(!dans(i,y))continue;const bord=!dans(i+1,y)||!dans(i,y-1)||!dans(i,y+1);const ang=Math.atan2(y-ty,i+.5);const veine=[-.75,-.2,.35,.85].some(v=>Math.abs(ang-v)<.06);P(i,y,bord?alpha("#f2fbff",.92):veine?alpha("#d6efff",.6):alpha("#9fd0ff",.3));}}
    else if(t==="ailes-fee"){const lobes=[[7,-4+f,6,4,"#ffc6ec"],[5,5-f,4,3,"#c6f2ff"]];lobes.forEach(([cx,cy,rx,ry,c])=>{for(let y=ty+cy-ry-1;y<=ty+cy+ry+1;y++)for(let i=0;i<=cx+rx+1;i++){const u=(i-cx)/rx,v=(y-ty-cy)/ry;const d=u*u+v*v;if(d>1)continue;const bord=d>.62;P(i,y,bord?alpha("#ffffff",.85):alpha(((i+y)%3===0)?"#d8c6ff":c,.5));}});}
    else{const top=i=>ty-Math.round(7*i/13);const fing=[4,8,12];const bot=i=>{let best=ty+8;for(let k=0;k<fing.length;k++){const a=k?fing[k-1]:0,b=fing[k];if(i>=a&&i<=b){const tt=(i-a)/(b-a);best=Math.round(ty+7-Math.sin(Math.PI*tt)*3-(k===2?2:0));}}return i>12?top(i)+1:best;};
      for(let i=1;i<=13;i++)for(let y=top(i);y<=bot(i);y++){const os=y===top(i)||fing.some(fi=>Math.abs((y-ty)-(i/fi)*(bot(fi)-ty))<.6&&i<=fi);P(i,y,y===top(i)||y===bot(i)?"#1b1530":os?"#5a4078":"#3a2450",true);}}};
  cote(-1);cote(1);}
function peindreBas(L,g,cfg,haut,robe){if(robe)return;const bt=g.legTop,ll=g.legLen,lw=g.legW;let t=cfg.bas,c=cfg.basC;
  if(haut==="salopette"){t="pantalon";c=cfg.hautC;}if(haut==="costume"){t="pantalon";c=fonce(cfg.hautC,.08);}
  const cS=fonce(c,.22),cH=clair(c,.15);
  const jambe=(lx,y0,y1,dx0=0,dx1=0)=>{for(let y=y0;y<=y1;y++){L.rect(lx-dx0,y,lw+dx0+dx1,1,c);L.px(lx-dx0,y,cH);}};
  switch(t){
    case "jupe":for(let k=0;k<5;k++){const e=Math.floor(k/2);L.rect(g.lx0-e,bt+k,(g.rx0+lw)-(g.lx0)+2*e,1,k===4?cS:c);}break;
    case "short":jambe(g.lx0,bt,bt+2,1,0);jambe(g.rx0,bt,bt+2,0,1);L.rect(CX-1,bt,2,2,c);L.ligne(g.lx0-1,g.rx0+lw,bt,cS);break;
    case "jupe-culotte":[0,0,1,1,2,2].forEach((e,k)=>{jambe(g.lx0,bt+k,bt+k,e,0);jambe(g.rx0,bt+k,bt+k,0,e);});L.rect(CX-1,bt,2,2,c);break;
    case "bouffant":jambe(g.lx0,bt,bt,0,0);jambe(g.rx0,bt,bt,0,0);jambe(g.lx0,bt+1,bt+ll-2,1,0);jambe(g.rx0,bt+1,bt+ll-2,0,1);L.rect(g.lx0,bt+ll-1,lw,1,cS);L.rect(g.rx0,bt+ll-1,lw,1,cS);L.rect(CX-1,bt,2,3,c);break;
    default:jambe(g.lx0,bt,bt+ll-1);jambe(g.rx0,bt,bt+ll-1);L.rect(CX-1,bt,2,2,c);L.ligne(g.lx0,g.rx0+lw-1,bt,cS);
      if(haut==="salopette"){L.rect(g.lx0,bt+ll-1,lw,1,cH);L.rect(g.rx0,bt+ll-1,lw,1,cH);}
  }}
function peindreChaussures(L,g,cfg,sk,E){const y0=g.sy0,G=g.G,lw=g.legW;if(cfg.haut==="robe-bal")return;
  [[g.lx0,-1],[g.rx0,1]].forEach(([lx,s])=>{const ox=s<0?lx-1:lx,w=lw+1;
    switch(cfg.pieds){
      case "rangers":L.rect(ox,y0,w,G-y0-1,"#1c1a22");L.rect(ox,G-1,w,1,"#3a3640");L.rect(ox,G,w,1,"#4a4652");for(let x=ox;x<ox+w;x+=2)L.px(x,G,"#6a6676");
        for(let y=y0+1;y<=y0+3;y++)L.px(lx+1+(y%2),y,"#a77ef0");L.px(s<0?ox:ox+w-1,y0+1,"#cfd4e0");L.px(s<0?ox:ox+w-1,y0+3,"#cfd4e0");L.px(s<0?ox+1:ox+w-2,G-2,"#4a4a5a");L.rect(ox,y0,w,1,"#2a2832");break;
      case "sandales":L.rect(lx,y0,lw,3,sk);L.rect(s<0?lx-1:lx,G,lw+1,1,"#8a5a32");L.ligne(lx,lx+lw-1,y0+1,"#6b4423");break;
      case "baskets":L.rect(ox,y0,w,3,"#f4f2ee");L.ligne(ox,ox+w-1,y0+1,"#3d6fd8");L.ligne(ox,ox+w-1,G,"#bfc3cc");L.px(lx+1,y0,"#9a9eaa");break;
      case "chaussons":L.rect(ox-(s<0?1:0),y0,w+1,3,"#f2b6c8");L.ligne(ox-(s<0?1:0),ox+w-(s<0?1:0),G,"#e08aa8");L.px(lx+1,y0-1,"#ffffff");break;
      case "nus":if(E.cornes){L.rect(lx,y0,lw,2,"#6b4a30");L.rect(lx,y0+2,lw,1,"#3a2a20");L.px(lx+1,G,"#6b4a30");}else{L.rect(lx,y0,lw,3,sk);L.ligne(s<0?lx-1:lx,s<0?lx+lw-1:lx+lw,G,sk);L.px(s<0?lx-1:lx+lw,G,fonce(sk,.2));}break;
      default:L.rect(lx,y0-2,lw,2,"#7a5532");L.rect(ox,y0,w,2,"#6b4423");L.rect(ox,G,w,1,"#3a2618");L.ligne(lx,lx+lw-1,y0-2,"#8a6a42");
    }});}
function peindreHaut(L,g,cfg,h,c,cS,cH,sk,S_){const ty=g.ty,a=g.tx0,b=g.tx1,tw=g.tw;
  const corps=(y0,y1,col=c)=>{for(let y=y0;y<=y1;y++){L.rect(a,y,tw,1,col);L.px(a,y,clair(col,.18));L.px(b,y,fonce(col,.2));}};
  switch(h){
    case "robe-mage":corps(ty,ty+9);for(let y=ty+10;y<=g.G-g.shoeH;y++){const e=1+Math.floor((y-ty-10)/3);L.rect(a-e,y,tw+2*e,1,y===g.G-g.shoeH?"#e8b84a":c);L.px(a-e,y,cH);L.px(b+e,y,cS);}
      L.ligne(CX-2,CX+1,ty,"#e8b84a");[[a+2,ty+12],[b-2,ty+15],[CX,ty+18],[a+1,ty+5],[b-1,ty+3]].forEach(([x,y])=>{if(y<g.G-g.shoeH)L.px(x,y,"#f2d06a");});L.ligne(a,b,ty+7,cS);break;
    case "salopette":corps(ty,ty+9,"#efe6d2");L.rect(CX-3,ty+3,6,7,c);L.rect(a+1,ty,1,4,c);L.rect(b-1,ty,1,4,c);L.px(a+1,ty+3,"#e8b84a");L.px(b-1,ty+3,"#e8b84a");L.rect(CX-1,ty+5,2,2,cS);L.rect(a,ty+9,tw,1,c);break;
    case "sweat":corps(ty,ty+10);L.rect(a,ty+9,tw,2,cS);L.ligne(CX-3,CX+2,ty+6,cS);L.rect(CX-3,ty+7,6,2,fonce(c,.1));L.px(CX-2,ty+1,"#fffaf0");L.px(CX-2,ty+2,"#fffaf0");L.px(CX+1,ty+1,"#fffaf0");L.px(CX+1,ty+2,"#fffaf0");L.ligne(CX-2,CX+1,ty,cS);break;
    case "jabot":corps(ty,ty+9);for(let y=ty;y<=ty+5;y++){const w=y%2?1:2;L.rect(CX-w,y,2*w,1,"#fffaf0");}L.rect(CX-1,ty,2,1,"#e8b84a");L.rect(a,ty+9,tw,1,cS);break;
    case "armure":corps(ty,ty+9);L.ligne(a,b,ty+3,cS);L.ligne(a,b,ty+6,cS);for(let k=0;k<tw;k++)L.px(a+k,ty+1+Math.floor(k*0.8),fonce(c,.35));[[a+1,ty+1],[b-1,ty+4],[a+1,ty+7],[b-1,ty+7]].forEach(([x,y])=>L.px(x,y,"#cfd4e0"));L.ligne(a,b,ty+8,"#4a3018");L.px(CX-1,ty+8,"#e8b84a");L.px(CX,ty+8,"#e8b84a");break;
    case "pull":for(let y=ty;y<=ty+11;y++){L.rect(a-1,y,tw+2,1,((y+a)%3===0)?fonce(c,.08):c);L.px(a-1,y,cH);L.px(b+1,y,cS);}for(let x=a-1;x<=b+1;x++){L.px(x,ty+10,x%2?cS:c);L.px(x,ty+11,x%2?cS:c);}L.ligne(CX-2,CX+1,ty,cS);break;
    case "gilet":corps(ty,ty+9,"#f2ead8");for(let y=ty;y<=ty+9;y++){const v=y<ty+5?Math.max(0,3-(y-ty)):0;for(let x=a;x<=b;x++){if(Math.abs(x-CX+.5)<v+0.5)continue;L.px(x,y,((x+y)%3===0)?fonce(c,.08):c);}}L.px(CX-1,ty+6,"#e8b84a");L.px(CX-1,ty+8,"#e8b84a");L.rect(b-3,ty+3,2,1,cS);L.px(b-3,ty+2,"#3d6fd8");L.ligne(a,b,ty+9,cS);break;
    case "crop":corps(ty,ty+4);L.ligne(a,b,ty+4,cS);L.px(CX-1,ty+7,S_(fonce(sk,.22)));if(cfg.basC)L.ligne(a,b,ty+9,fonce(cfg.basC,.1));L.px(CX-1,ty+2,"#f08ab8");L.px(CX,ty+2,"#f08ab8");L.px(CX-1,ty+1,"#f08ab8");L.px(CX,ty+1,"#f08ab8");break;
    case "costume":corps(ty,ty+10);L.rect(CX-2,ty,4,1,"#fffaf0");L.rect(CX-1,ty+1,2,5,"#fffaf0");L.rect(CX-1,ty+1,2,1,"#8e2b3f");L.rect(CX-1,ty+2,2,5,"#a8304a");L.rect(CX-3,ty+5,6,4,fonce(c,.35));L.rect(CX-1,ty+5,2,2,"#a8304a");L.px(CX-1,ty+7,"#e8b84a");L.px(CX-1,ty+8,"#e8b84a");
      for(let k=0;k<5;k++){L.px(CX-3+Math.floor(k/2.5),ty+k,cS);L.px(CX+2-Math.floor(k/2.5),ty+k,cS);}L.px(b-2,ty+3,"#fffaf0");L.px(b-1,ty+3,"#fffaf0");break;
    case "robe-bal":corps(ty,ty+8);L.rect(CX-3,ty,6,1,S_(sk));L.rect(CX-2,ty+1,4,1,S_(sk));L.ligne(CX-3,CX+2,ty+1,cS);L.ligne(a,b,ty+7,"#e8b84a");
      for(let y=ty+8;y<=g.G-1;y++){const k=y-ty-8;const e=Math.min(9,1+Math.floor(k*0.7));const x0=a-e,x1=b+e,w=x1-x0;for(let x=x0;x<=x1;x++){const u=(x-x0)/w;let col=u<.22?cH:u>.8?cS:c;if((k===7||k===13)&&(x%2===0))col=clair(c,.35);if((k===8||k===14)&&(x%2===1))col=cS;L.px(x,y,col);}if((k*7)%5===1)L.px(x0+2+((k*11)%(w-3)),y,"#fff4fb");}L.ligne(a-9,b+9,g.G,fonce(c,.3));break;
    default:corps(ty,ty+9);L.rect(CX-2,ty,4,1,S_(sk));L.rect(CX-1,ty+1,2,1,S_(sk));L.ligne(a,b,ty+7,"#6b4423");L.px(CX-1,ty+7,"#e8b84a");L.px(CX,ty+7,"#e8b84a");
      L.rect(a,ty+10,tw,1,c);L.rect(a-1,ty+11,tw+2,1,cS);
  }}
function peindreVisage(L,F,g,v,ey,x0,x1,ty){if(!v)return;
  if(v==="lunettes-rondes"){const or="#c9963b";[[CX-5],[CX+1]].forEach(([a])=>{L.ligne(a+1,a+2,ey-1,or);L.ligne(a+1,a+2,ey+2,or);L.px(a,ey,or);L.px(a,ey+1,or);L.px(a+3,ey,or);L.px(a+3,ey+1,or);});L.ligne(CX-1,CX,ey,or);L.px(x0,ey,or);L.px(x0+1,ey,or);L.px(x1,ey,or);L.px(x1-1,ey,or);}
  if(v==="lunettes-coeur"){const M=["xx.xx","xxxxx",".xxx.","..x.."];[[CX-6],[CX+1]].forEach(([a])=>M.forEach((r,j)=>{for(let i=0;i<5;i++)if(r[i]==="x"){const bord=j===0||i===0||i===4||j===3||r[i-1]!=="x"||r[i+1]!=="x";L.px(a+i,ey-1+j,bord?"#d8245e":alpha("#ff6fae",.55));}}));L.ligne(CX-1,CX,ey,"#d8245e");}
  if(v==="monocle"){const or="#e8b84a";L.ligne(CX+2,CX+3,ey-1,or);L.ligne(CX+2,CX+3,ey+2,or);L.px(CX+1,ey,or);L.px(CX+1,ey+1,or);L.px(CX+4,ey,or);L.px(CX+4,ey+1,or);[[CX+4,ey+3],[CX+5,ey+5],[CX+5,ey+7],[CX+4,ey+9]].forEach(([x,y])=>L.px(x,y,or));}
  if(v==="bandeau"){L.rect(CX-5,ey-1,4,3,"#1f1a24");L.rect(CX-4,ey+2,2,1,"#1f1a24");let x=CX-1,y=ey-2;while(x<=x1){L.px(x,y,"#2b2133");x++;if((x-CX)%2===0)y--;}L.ligne(x0,CX-6,ey-1,"#2b2133");}}
function peindreChapeau(L,g,t,Y,x0,x1,hy){
  switch(t){
    case "bonnet-tisseuse":{const n="#24202e",v="#7a4ac8";L.ligne(x0+4,x1-4,Y-3,n);L.ligne(x0+2,x1-2,Y-2,n);L.ligne(x0+1,x1-1,Y-1,n);for(let y=Y;y<=Y+2;y++)L.ligne(x0,x1,y,n);for(let x=x0-1;x<=x1+1;x++){L.px(x,Y+3,x%2?v:fonce(v,.25));L.px(x,Y+4,x%2?fonce(v,.25):v);}
      L.carte(CX-3,Y-1,["x....x",".xxxx.","x.xx.x",".x..x."],{x:"#c8a6f2"});L.px(CX-1,Y-3,"#e8e0ff");L.px(CX-1,Y-2,"#e8e0ff");
      [-1,1].forEach(s=>{const bx=s<0?x0:x1;[[1,5],[2,6],[3,7],[3,8]].forEach(([dx,dy])=>L.px(s<0?bx-dx:bx+dx,Y+dy,n));L.rect(s<0?bx-4:bx+3,Y+9,2,2,v);});break;}
    case "gamelle":{const m="#c8ccd8",d="#8a90a4",cl="#f2f4fa",r="#6e748a";L.ligne(CX-1,CX,Y-7,d);L.px(CX-2,Y-6,d);L.px(CX+1,Y-6,d);
      const R=[[-5,-4,3],[-4,-6,5],[-3,-7,6],[-2,-8,7],[-1,-8,7],[0,-8,7],[1,-8,7]];R.forEach(([dy,a,b])=>{for(let x=CX+a;x<=CX+b;x++){const u=(x-CX-a)/(b-a);L.px(x,Y+dy,u<.25?cl:u>.78?d:m);}});
      L.ligne(CX-9,CX+8,Y+2,r);L.ligne(CX-8,CX+7,Y+3,fonce(r,.2));L.px(CX-5,Y-3,"#ffffff");L.px(CX-4,Y-3,"#ffffff");L.px(CX+3,Y-1,d);break;}
    case "diademe":L.ligne(x0+1,x1-1,Y+3,"#dfe6f7");L.carte(CX-2,Y-1,[".xx.","x...","x..y",".xx."],{x:"#bfe4ff",y:"#ffffff"});L.px(x0+3,Y+3,"#9fd0ff");L.px(x1-3,Y+3,"#9fd0ff");break;
    case "couronne":{const C=["#f2a6c8","#fbf3e8","#c8a6f2","#f2d06a"];for(let k=0;k<6;k++){const fx=x0-1+k*3;const c=C[k%4];L.px(fx,Y+1,c);L.px(fx+1,Y+1,c);L.px(fx,Y+2,c);L.px(fx+1,Y+2,"#f2d06a");L.px(fx+2,Y+2,"#4a9a4a");}break;}
    case "chapeau-mage":{const c="#4a3a9a";L.ligne(x0-4,x1+4,Y+2,c);L.ligne(x0-3,x1+3,Y+3,fonce(c,.3));for(let k=0;k<=14;k++){const half=Math.max(1,7-Math.floor(k/2.2));const sh=k>9?1:0,sh2=k>12?1:0;L.ligne(CX-half+sh+sh2,CX+half-1+sh+sh2,Y+1-k,k%5===0?clair(c,.12):c);}L.ligne(CX-6,CX+5,Y,"#e8b84a");L.ligne(CX-6,CX+5,Y+1,"#c9963b");L.px(CX,Y-5,"#f2d06a");L.px(CX-1,Y-5,"#f2d06a");L.px(CX,Y-6,"#f2d06a");L.px(CX,Y-4,"#f2d06a");break;}
    case "beret":{const c="#8e2b3f";L.px(CX+2,Y-3,fonce(c,.2));L.ligne(CX-5,CX+5,Y-2,c);L.ligne(CX-7,CX+8,Y-1,c);L.ligne(CX-8,CX+8,Y,c);L.ligne(x0,x1,Y+1,fonce(c,.3));L.ligne(CX-4,CX-1,Y-2,clair(c,.2));break;}
    case "casquette":{const c="#3d6fd8";L.ligne(CX+2,CX+7,Y-3,fonce(c,.25));L.ligne(CX+3,CX+8,Y-4,fonce(c,.1));L.ligne(CX-4,CX+3,Y-2,c);L.ligne(CX-6,CX+5,Y-1,c);for(let y=Y;y<=Y+2;y++)for(let x=x0;x<=x1;x++){if(y>=Y+1&&x>=CX-2&&x<=CX+1)continue;L.px(x,y,y===Y+2?fonce(c,.3):(x<CX-2?"#f4f2ee":c));}break;}
  }}
function peindreObjet(L,F,g,t,m,f){if(!m)return;const[hx,hy]=m;const ty=g.ty;
  switch(t){
    case "bottin":{const x=g.tx1-1,y=ty+3;L.rect(x,y,6,8,"#a8242e");L.rect(x,y,1,8,"#7a1820");L.ligne(x+1,x+5,y+1,"#e8b84a");L.ligne(x+1,x+5,y+6,"#e8b84a");L.ligne(x+2,x+4,y+3,"#f2d06a");L.ligne(x+2,x+3,y+4,"#f2d06a");L.ligne(x+1,x+5,y+7,"#f2e8d8");break;}
    case "grimoire":L.rect(hx-1,hy-3,5,6,"#5a3a9a");L.rect(hx-1,hy-3,1,6,"#3a2470");L.rect(hx+3,hy-1,1,2,"#e8b84a");L.px(hx+1,hy-1,"#9ff2ff");L.ligne(hx,hx+2,hy+2,"#f2e8d8");break;
    case "plume":for(let k=0;k<15;k++){const x=hx+1+Math.floor(k/4),y=hy-k;L.px(x,y,k<2?"#2b2143":"#e8e0d0");if(k>3){L.px(x-1,y,k%3?"#fbf3e8":"#9fd0ff");L.px(x+1,y,"#fbf3e8");if(k>6)L.px(x-2,y,alpha("#cfe8ff",.9));}}break;
    case "lanterne":L.px(hx,hy+1,"#3a3640");L.ligne(hx-1,hx+2,hy+2,"#3a3640");L.rect(hx-1,hy+3,4,3,"#ffd86a");L.px(hx-1,hy+3,"#3a3640");L.px(hx+2,hy+3,"#3a3640");L.ligne(hx-1,hx+2,hy+6,"#3a3640");halo(F,hx+.5,hy+4.5,4+f,"#ffe9a0");break;
    case "the":L.rect(hx-1,hy-2,4,3,"#fbf3e8");L.ligne(hx-1,hx+2,hy-2,"#b8702a");L.px(hx+3,hy-1,"#fbf3e8");L.px(hx,hy,"#7a9ad8");[[0,-4],[1,-5],[0,-6],[1,-7]].forEach(([dx,dy],i)=>F.px(hx+dx+((f+i)%2),hy+dy,alpha("#ffffff",.6-i*.1),false));break;
    case "baton":for(let y=g.hy-2;y<=g.G;y++)L.px(hx+1,y,y%5===0?"#5a3d18":"#7a5320");L.rect(hx,g.hy-1,3,1,"#e8b84a");L.carte(hx-1,g.hy-7,["..x..",".xyx.","xyyyx",".xyx.","..x.."],{x:"#7a64e0",y:"#cfe0ff"});halo(F,hx+1,g.hy-5,4+f,"#cfe0ff");break;
    case "balance":{const o="#e8b84a",d="#9a6a1e";for(let y=hy-8;y<=hy;y++)L.px(hx+1,y,d);L.ligne(hx-4,hx+6,hy-8,o);[hx-4,hx+6].forEach(x=>{L.px(x,hy-7,d);L.px(x,hy-6,d);L.ligne(x-2,x+2,hy-5,o);L.ligne(x-1,x+1,hy-4,o);});L.px(hx+1,hy-9,o);break;}
  }}
function halo(F,cx,cy,r,c){for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const d=Math.hypot(x-cx,y-cy);if(d<=r&&d>1.5)F.px(x,y,alpha(c,.12+.16*(1-d/r)),false);}}
function peindreLivreOuvert(L,ty){L.rect(CX-5,ty+3,10,5,"#fbf3e8");L.rect(CX-1,ty+3,2,5,"#d8cdb4");L.ligne(CX-5,CX+4,ty+8,"#5a3a9a");for(let y=ty+4;y<=ty+6;y+=2){L.ligne(CX-4,CX-2,y,"#b8ae98");L.ligne(CX+1,CX+3,y,"#b8ae98");}}

/* ----- Familiers (sprites originaux 14 × 12) ----- */
const FAMILIERS={
  chat:{l:"Chat noir",p:{k:CONTOUR,K:"#2e2640",H:"#4a3f66",y:"#f2d14b",e:"#1b1530",p:"#e89ab0"},cou:8,ferme:{y:"K",e:"k"},g:["..kk......kk..",".kKKk....kKKk.",".kKpKkkkkKpKk.",".kKKKKKKKKKKk.","kKKKKKKKKKKKKk","kKyyKKKKKKyyKk","kKyeKKKKKKeyKk","kKKKKKppKKKKKk",".kKKKKKKKKKKk.","kKKHHKKKKHHKKk","kKKKKKKKKKKKKk",".kkkkkkkkkkkk."]},
  chouette:{l:"Chouette",p:{k:CONTOUR,B:"#8a6a4a",b:"#6b4f35",c:"#e8d6b0",w:"#fbf3e8",y:"#f2b13b",e:"#1b1530",o:"#e8a03b"},cou:7,ferme:{w:"B",y:"b",e:"b"},g:[".k..........k.",".kk........kk.",".kBkkkkkkkkBk.","kBBBBBBBBBBBBk","kBwwwBBBBwwwBk","kBwyewBBweywBk","kBwwwBooBwwwBk","kbBBBBBBBBBBbk","kbBccccccccBbk","kbBcbccbcbcBbk",".kbBccccccBbk.","..kkokkkkokk.."]},
  grenouille:{l:"Grenouille",p:{k:CONTOUR,G:"#5fae4a",g:"#3f8a3a",w:"#fbf3e8",e:"#1b1530",p:"#e89ab0",l:"#cfe8a0"},cou:8,ferme:{w:"G",e:"G"},g:["..kkk....kkk..",".kwwwk..kwwwk.",".kwewk..kwewk.","kGkkkGGGGkkkGk","kGGGGGGGGGGGGk","kGpGGGGGGGGpGk","kGGkGGGGGGkGGk","kGGGkkkkkkGGGk",".kGGllllllGGk.","kGgGllllllGgGk","kgGGGGGGGGGGgk","kkkk.kkkk.kkkk"]},
  renard:{l:"Renard",p:{k:CONTOUR,O:"#d9772f",w:"#fbf3e8",e:"#1b1530",n:"#1b1530"},cou:9,ferme:{e:"O"},g:["kk..........kk","kOk........kOk","kOOk......kOOk","kOwOkkkkkkOwOk","kOOOOOOOOOOOOk","kOOeOOOOOOeOOk","kOOeOOOOOOeOOk","kwwOOOnnOOOwwk",".kwwwwwwwwwwk.","..kwwwwwwwwk..",".kOOkkkkkkOOk.",".kkk......kkk."]},
  lapin:{l:"Lapin",p:{k:CONTOUR,W:"#f2efe8",S:"#d8d2c8",p:"#f0a6b8",e:"#1b1530"},cou:9,ferme:{e:"S"},g:["...kk....kk...","..kWWk..kWWk..","..kWpk..kpWk..","..kWpk..kpWk..","..kWWkkkkWWk..",".kWWWWWWWWWWk.","kWWWeWWWWeWWWk","kWpWWWppWWWpWk","kWWWWWkkWWWWWk",".kSWWWWWWWWSk.",".kSSWWWWWWSSk.","..kkkk..kkkk.."]},
  herisson:{l:"Hérisson",p:{k:CONTOUR,B:"#7a5320",b:"#4a3214",F:"#e8c9a0",e:"#1b1530",n:"#1b1530",p:"#f0a6b8"},cou:9,ferme:{e:"F"},g:["....k.k.k.k...","..kkBkBkBkBk..",".kBBbBBbBBbBk.","kBbBBbBBbBBbBk","kBbBkFFFFkBbBk","kBBkFFFFFFkBBk","kBkFFeFFeFFkBk","kBkFFFnnFFFkBk","kBkpFFFFFFpkBk",".kBkFFFFFFkBk.","..kBkkkkkkBk..","...kk....kk..."]},
  corbeau:{l:"Corbeau",p:{k:CONTOUR,K:"#24203a",H:"#3d3760",e:"#e8e0ff",g:"#5a5470"},cou:6,ferme:{e:"K"},g:["....kkkkkk....","...kKKKKKKk...","..kKKKKKKKKk..","..kKeKKKKeKk..","..kKKKggKKKk..","..kKKKggKKKk..",".kHKKKKKKKKHk.","kHHKKKKKKKKHHk","kHHKKKKKKKKHHk",".kHKKKKKKKKHk.","..kkKKKKKKkk..","....gk..kg...."]},
  champi:{l:"Champignon qui marche",p:{k:CONTOUR,R:"#c8453d",r:"#962e28",w:"#fbf3e8",S:"#efe2cf",s:"#d6c4a8",e:"#1b1530"},cou:6,ferme:{e:"S"},g:["....kkkkkk....","..kkRRwwRRkk..",".kRRwwRRRRwRk.","kRRRwwRRRRRRRk","kRwRRRRRwwRRrk","krrrrrrrrrrrrk",".kkkSSSSSSkkk.","...kSeSSeSk...","...kSSSSSSk...","...kSSkkSSk...","...ksSSSSsk...","....kk..kk...."]},
  slime:{l:"Slime",p:{k:CONTOUR,G:"#6fd6a8",h:"#d8fff0",e:"#1b1530"},cou:8,ferme:{e:"G"},g:["..............","......kk......",".....kGGk.....","....kGhGGk....","...kGhGGGGk...","..kGGGGGGGGk..",".kGGeGGGGeGGk.",".kGGeGGGGeGGk.","kGGGGGkkGGGGGk","kGGGGGGGGGGGGk","kGGGGGGGGGGGGk",".kkkkkkkkkkkk."]},
  axolotl:{l:"Axolotl",p:{k:CONTOUR,P:"#f6a8c8",p:"#e07aa8",r:"#e0506a",e:"#1b1530",w:"#fde2ee"},cou:7,ferme:{e:"P"},g:["..............","....kkkkkk....","rr.kPPPPPPk.rr",".rkPPPPPPPPkr.","rrkPePPPPePkrr",".rkPPPPPPPPkr.","rrkPpPkkPpPkrr","..kPPPPPPPPk..","..kPwwwwwwPk..","..kPwwwwwwPk..","..kPPkPPkPPk..","..kkk.kk.kkk.."]},
  golem:{l:"Mini-golem",p:{k:CONTOUR,S:"#8f9493",s:"#6e7372",M:"#5f9a3f",m:"#7fbf4f",e:"#9fffd0",f:"#f0a6c8"},cou:6,ferme:{e:"s"},g:["...kkkkkkkk...","..kMmMMfMmMk..","..kSMSSSMSSk..","..kSSSSSSSSk..","..kSeeSSeeSk..","..kSSSSSSSSk..","..kSSskkSsSk..","kkkSSSSSSSSkkk","kSkSSsSSSSSkSk","kSkSSSSSSsSkSk","kkkSSSkkSSSkkk","...kkk..kkk..."]},
  fantome:{l:"Petit fantôme",p:{k:CONTOUR,W:"#f4f6ff",s:"#c8d0ec",e:"#1b1530",p:"#f0a6c8"},cou:7,ferme:{e:"s"},g:["....kkkkkk....","...kWWWWWWk...","..kWWWWWWWWk..",".kWWWWWWWWWWk.",".kWWeWWWWeWWk.",".kWWeWWWWeWWk.",".kWpWWkkWWpWk.",".kWWWWWWWWWWk.",".kWWWWWWWWWWk.",".ksWWWWWWWWsk.",".kWWWWWWWWWWk.",".kWk.kWWk.kWk."]},
  dragonnet:{l:"Dragonnet",p:{k:CONTOUR,D:"#6a5ad0",d:"#4a3a9a",b:"#f2c46a",w:"#9d8cff",y:"#f2d14b",e:"#1b1530",h:"#f2e6c8"},cou:6,ferme:{y:"D",e:"d"},g:["...h......h...","...khkkkkhk...","..kDDDDDDDDk..","w.kDyeDDeyDk.w","wwkDDDDDDDDkww","wwkDDdkkdDDkww","wwwkDbbbbDkwww",".wwkDbbbbDkww.","..kDDbbbbDDk..","..kDdDDDDdDk..","..kDDkDDkDDk..","..kkk.kk.kkk.."]},
};
function peindreFamilier(id,acc,ferme){const F_=FAMILIERS[id];const C=new Calque(14,15);if(!F_)return C;let pal=F_.p;if(ferme&&F_.ferme){pal=Object.assign({},pal);for(const[a,b]of Object.entries(F_.ferme))pal[a]=F_.p[b]||b;}
  C.carte(0,3,F_.g,pal);const cou=F_.cou+3;
  if(acc==="noeud"){C.carte(9,2,["x.x","xxx","x.x"].map(r=>r),{x:"#e84a7a"});C.px(10,3,"#ffb0c8");}
  if(acc==="chapeau"){C.rect(5,0,4,3,"#1f1a24");C.ligne(4,9,3,"#1f1a24");C.ligne(5,8,2,"#a8304a");}
  if(acc==="echarpe"){C.ligne(2,11,cou,"#c8453d");C.ligne(3,10,cou+1,"#e8b84a");C.px(10,cou+2,"#c8453d");C.px(10,cou+3,"#c8453d");}
  return C;}
