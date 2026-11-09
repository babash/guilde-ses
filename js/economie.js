/* =====================================================================
   La Guilde des SES · économie et animations
   Catalogue de l'échoppe, scène animée, écus, quêtes du jour, hauts faits, compagnon, sauvegarde claude.ai.
   ===================================================================== */
"use strict";
const PRIX={base:0,commun:50,rare:150,epique:400,hautfait:null};
const NOM_RARETE={base:"Offert",commun:"Commun",rare:"Rare",epique:"Épique",hautfait:"Haut fait"};
const ITEMS=[];
function art(slot,v,nom,rar,desc,x){const it=Object.assign({id:slot+":"+v,slot,v,nom,rar,prix:PRIX[rar],desc},x||{});ITEMS.push(it);return it;}
[["tunique","Tunique d'apprenti·e","base","La tenue de toute recrue de la guilde, ceinturée de cuir."],["robe-mage","Robe de mage","rare","Longue robe semée d'étoiles d'or, manches évasées."],["salopette","Salopette","commun","Toile solide, bretelles et boutons dorés."],["sweat","Sweat à capuche","commun","Poche ventrale et cordons pour les longues veillées."],["jabot","Chemise à jabot","rare","Volants blancs et broche d'or : très mondain."],["armure","Armure de cuir","rare","Épaulières, sangles et rivets d'argent."],["pull","Pull oversize","commun","Trop grand, très doux, manches jusqu'aux doigts."],["gilet","Gilet de bibliothécaire","hautfait","Gilet tricoté, stylo en poche.",{hf:"bibliothecaire"}],["crop","Crop top","commun","Court, avec un petit cœur brodé."],["costume","Costume trois pièces","epique","Veste, gilet, cravate et pochette."],["robe-bal","Robe de bal","epique","Jupon immense, volants et paillettes."]].forEach(a=>art("haut",...a));
[["pantalon","Pantalon","base","Coupe droite."],["jupe","Jupe","base","Évasée au genou."],["short","Short","base","Pour les beaux jours."],["jupe-culotte","Jupe-culotte","commun","Ample comme une jupe, pratique comme un pantalon."],["bouffant","Pantalon bouffant","commun","Large et resserré aux chevilles."]].forEach(a=>art("bas",...a));
art("jambes","collants","Collants rayés","commun","Rayures noir et violet, visibles sous une jupe ou un short.");
[["rangers","Rangers à semelle très haute","rare","Cuir noir, lacets violets, boucles de métal : trois pixels de plus."],["bottes","Bottes de marche","base","Cuir brun, faites pour les longues routes."],["sandales","Sandales","base","Lanières de cuir."],["baskets","Baskets","commun","Blanches à bande bleue."],["chaussons","Chaussons","commun","Duveteux, avec un pompon."],["nus","Pieds nus","base","Ou sabots, pour les faunes."]].forEach(a=>art("pieds",...a));
[["bonnet-tisseuse","Bonnet tisseuse","rare","Bonnet noir à bord violet, araignée brodée et pompons en pattes."],["gamelle","Gamelle ronde en métal","rare","Portée en casque, brillante, avec sa petite anse."],["diademe","Diadème de lune","rare","Fin bandeau d'argent et croissant de lune."],["couronne","Couronne de fleurs","commun","Fleurs des prés tressées."],["chapeau-mage","Chapeau pointu de mage","rare","Large bord, pointe tordue, étoile d'or."],["beret","Béret","commun","Rouge sombre, posé de travers."],["casquette","Casquette à l'envers","commun","Visière dans le dos."]].forEach(a=>art("tete",...a));
[["lunettes-rondes","Lunettes rondes","commun","Fine monture dorée."],["monocle","Monocle","commun","Cerclé d'or, avec sa chaîne."],["lunettes-coeur","Lunettes cœur","hautfait","Verres roses en forme de cœur.",{hf:"sansfaute"}],["bandeau","Bandeau de pirate","hautfait","Pour les duellistes aguerri·es.",{hf:"duelliste"}]].forEach(a=>art("visage",...a));
art("oreilles","oreilles-elfe","Oreilles d'elfe","commun","Oreilles pointues ornées d'anneaux argentés, pour toutes les espèces.");
[["ailes-spectrales","Ailes spectrales","hautfait","Translucides, bleu pâle, contour lumineux, battement lent.",{hf:"serie7"}],["ailes-fee","Ailes de fée","rare","Quatre lobes irisés."],["ailes-chauve","Ailes de chauve-souris","rare","Membrane sombre et os fins."],["cape-fiertes","Cape aux couleurs des fiertés","base","Reprend le drapeau choisi dans l'onglet Fiertés."],["sac-livres","Sac à dos de livres","commun","Les grimoires dépassent des épaules."]].forEach(a=>art("dos",...a));
[["bottin","Bottin mondain","hautfait","Gros annuaire rouge et or, porté sous le bras.",{hf:"annuaire"}],["grimoire","Grimoire","commun","Reliure violette, fermoir d'or."],["plume","Plume géante","hautfait","Plus haute que son porteur.",{hf:"lexicographe"}],["lanterne","Lanterne","commun","Une lueur chaude pour les veillées."],["the","Tasse de thé fumante","commun","La vapeur monte doucement."],["baton","Bâton de mage","hautfait","Cristal luminescent au sommet.",{hf:"forgeron"}],["balance","Petite balance","hautfait","Pour peser les ordres de grandeur.",{hf:"marchand"}]].forEach(a=>art("main",...a));
[["rose","Rose pastel","commun","#f4a6c8"],["lavande","Lavande","commun","#b9a3e8"],["menthe","Menthe","commun","#9fe0c4"],["ciel","Bleu ciel","commun","#9ccdf2"],["peche","Pêche","commun","#f6c29a"],["neonvert","Vert néon","rare","#5dff6a"],["fuchsia","Fuchsia néon","rare","#ff3fb4"],["electrique","Bleu électrique","rare","#3f7bff"],["neonorange","Orange néon","rare","#ff8a1f"],["arcenciel","Arc-en-ciel","epique",null]].forEach(([v,nom,rar,c])=>art("teinte",v,nom,rar,c?"Teinture pour cheveux.":"Six couleurs, mèche après mèche.",{c}));
Object.entries(FAMILIERS).forEach(([v,F_])=>{const rar={chat:"base",chouette:"base",grenouille:"base",dragonnet:"epique",slime:"rare",axolotl:"rare",fantome:"rare",golem:"rare"}[v]||"commun";art("familier",v,F_.l,rar,"Saute de joie quand vous réussissez, se cache quand vous vous trompez.");});
[["noeud","Nœud","Un ruban rose sur la tête."],["chapeau","Petit chapeau","Haut-de-forme miniature."],["echarpe","Écharpe","Rouge et or, pour l'hiver."]].forEach(([v,nom,d])=>art("famAcc",v,nom,"commun",d));
[["saluer","Saluer","base"],["lire","Lire","base"],["etirer","S'étirer","commun"],["hausser","Hausser les épaules","commun"],["reverence","Révérence","commun"],["tournoyer","Tournoyer","commun"],["danser","Danser","rare"],["mediter","Léviter en méditant","rare"],["jongler","Jongler avec des livres","epique"]].forEach(([v,nom,rar])=>art("attitude",v,nom,rar,"Geste joué quand on touche son personnage."));
[["confettis","Confettis","base"],["coeurs","Pluie de cœurs","commun"],["eclat","Éclat doré","commun"],["fanfare","Fanfare","commun"],["feu","Feu d'artifice","rare"],["arcenciel","Arc-en-ciel","rare"],["dansefam","Danse du familier","rare"]].forEach(([v,nom,rar])=>art("succes",v,nom,rar,"Jouée après une bonne réponse."));
[["oups","Bulle « oups »","base"],["pluie","Nuage de pluie","commun"],["soupir","Soupir du familier","commun"],["chute","Chute sur les fesses","commun"],["chapeau","Chapeau qui s'envole","commun"],["livre","Livre sur la tête","rare"]].forEach(([v,nom,rar])=>art("erreur",v,nom,rar,"Jouée après une erreur, sans gravité."));
const ITEMS_PAR_ID=Object.fromEntries(ITEMS.map(i=>[i.id,i]));
const ICONE_SLOT={attitude:"epee",succes:"gemme",erreur:"masque"};
const possede=id=>{const it=ITEMS_PAR_ID[id];return !it||it.prix===0||(S.inv||[]).includes(id);};
const libItem=(slot,v)=>{const it=ITEMS_PAR_ID[slot+":"+v];return it?it.nom:v;};

/* =====================================================================
   SCÈNE ANIMÉE (personnage + familier)
   ===================================================================== */
const COUL_FETE=["#e8404a","#f2d04a","#4ab86a","#4a86e0","#c86ae0","#ff9ad0","#ffffff"];
const CARTES_FX={coeur:[".x.x.","xxxxx",".xxx.","..x.."],note:["..xx","..x.","..x.","xxx.","xx.."],etoile:[".x.","xxx",".x."],nuage:["...xxx......",".xxxxxxxx...","xxxxxxxxxxx.","xxxxxxxxxxxx",".xxxxxxxxxx."],livre:["xxxxxx","xyyyyx","xyyyyx","xxxxxx"]};
const MOUV_REDUIT=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}};
const sautFam=t=>t<900?-Math.round(Math.abs(Math.sin(t/140))*4):0;
const ANIMS={
  divers:{saut:{d:520,f:t=>({dy:t<260?-1:0,fdy:-Math.round(Math.sin(t/520*Math.PI)*3)})}},
  attitude:{
    saluer:{d:1800,f:t=>({pose:{bras:"salut",onde:(t/220|0)%2}})},
    lire:{d:2600,f:t=>({pose:{bras:"lecture",livre:1,yeux:t>1200&&t<1400?"endormis":null}})},
    etirer:{d:1800,f:t=>{const on=t>250&&t<1500;return{pose:{bras:on?"haut":"repos",yeux:on?"endormis":null},dy:on?-1:0};}},
    hausser:{d:1400,f:t=>({pose:{bras:"epaules",yeux:"rieurs"},dy:(t/350|0)%2?-1:0})},
    reverence:{d:1900,f:t=>{const on=t>300&&t<1500;return{pose:{bras:on?"reverence":"repos",tete:on?"baisse":null,yeux:on?"endormis":null}};}},
    tournoyer:{d:1600,f:t=>({flip:(t/200|0)%2===1,dy:(t/100|0)%2?-1:0})},
    danser:{d:2400,f:t=>{const k=(t/300|0)%2;return{pose:{bras:k?"danseG":"danseD",yeux:"rieurs"},dx:k?-1:1,dy:(t/150|0)%2?-1:0,fdy:k?-2:0};}},
    mediter:{d:3200,f:(t,p,sc)=>({pose:{bras:"ecartesBas",yeux:"endormis"},dy:-2-Math.round(2*Math.sin(t/320)),fx:[P=>{const c=sc.centre();for(let i=0;i<6;i++){const a=t/500+i*1.05;P(c.x+Math.cos(a)*13,c.yM+4+Math.sin(a)*5-2,i%2?"#cfe0ff":"#f2d06a");}}]})},
    jongler:{d:3000,f:(t,p,sc)=>({pose:{bras:(t/250|0)%2?"jongleA":"jongleB"},fx:[P=>{const c=sc.centre();["#c8453d","#3f8a5f","#3d6fd8"].forEach((col,i)=>{const a=t/260+i*2.09;P.carte(c.x-3+Math.round(Math.cos(a)*7),c.yT-6-Math.round(Math.abs(Math.sin(a))*7),CARTES_FX.livre,{x:fonce(col,.3),y:col});});}]})},
  },
  succes:{
    confettis:{d:1700,init:sc=>({q:Array.from({length:46},()=>({x:Math.random()*sc.o.W,y:-Math.random()*30,v:.025+Math.random()*.03,c:COUL_FETE[rint(7)],ph:Math.random()*6}))}),f:(t,p)=>({pose:{bras:t<1100?"haut":"repos",yeux:"rieurs"},fdy:sautFam(t),fx:[P=>p.q.forEach(q=>P(q.x+Math.sin(t/180+q.ph)*2,q.y+q.v*t,q.c))]})},
    coeurs:{d:1900,init:sc=>({q:Array.from({length:9},(_,i)=>({x:sc.centre().x-16+Math.random()*32,y:sc.centre().yM+8+Math.random()*12,v:.012+Math.random()*.014,c:i%2?"#f06a9a":"#e8405a",ph:Math.random()*6}))}),f:(t,p)=>({pose:{bras:t<1000?"haut":"repos",yeux:"rieurs"},fdy:sautFam(t),fx:[P=>p.q.forEach(q=>P.carte(q.x+Math.sin(t/260+q.ph)*2,q.y-q.v*t,CARTES_FX.coeur,{x:q.c}))]})},
    eclat:{d:1400,f:(t,p,sc)=>({pose:{bras:"haut",yeux:"rieurs"},fdy:sautFam(t),fx:[P=>{const c=sc.centre();const r=4+t*.022;for(let i=0;i<14;i++){const a=i/14*6.283;const x=c.x+Math.cos(a)*r,y=c.yM-2+Math.sin(a)*r*.8;P.carte(x-1,y-1,CARTES_FX.etoile,{x:i%2?"#f2d06a":"#fff6c8"});}}]})},
    fanfare:{d:2000,init:sc=>({q:Array.from({length:7},(_,i)=>({x:sc.centre().x+(i%2?10:-14)+Math.random()*4,d:i*220,c:i%2?"#f2d06a":"#c8a6f2"}))}),f:(t,p,sc)=>{const k=(t/250|0)%2;return{pose:{bras:k?"danseG":"danseD",yeux:"rieurs"},dy:k?-1:0,fdy:sautFam(t),fx:[P=>p.q.forEach(q=>{const u=t-q.d;if(u<0)return;P.carte(q.x+Math.sin(u/200)*2,sc.centre().yM-u*.02,CARTES_FX.note,{x:q.c});})]};}},
    feu:{d:2300,init:sc=>{const c=sc.centre();return{b:[0,420,860].map(d=>({d,x:c.x-14+Math.random()*28,y:c.yT-4+Math.random()*10,c:COUL_FETE[rint(6)],n:18}))};},f:(t,p)=>({pose:{bras:t<1600?"haut":"repos",yeux:"rieurs"},fdy:sautFam(t),fx:[P=>p.b.forEach(b=>{const u=t-b.d;if(u<0)return;if(u<180){P(b.x,b.y+(180-u)*.12,"#fff6c8");return;}const w=u-180;if(w>900)return;for(let i=0;i<b.n;i++){const a=i/b.n*6.283;P(b.x+Math.cos(a)*w*.028,b.y+Math.sin(a)*w*.028+w*w*.000012,w>650?alpha(b.c,.5):b.c);}})]})},
    arcenciel:{d:2300,f:(t,p,sc)=>({pose:{bras:t>300&&t<1800?"haut":"repos",yeux:"rieurs"},fdy:sautFam(t),fond:[P=>{const c=sc.centre();const fin=Math.PI*Math.min(1,t/700);ARCENCIEL.forEach((col,i)=>{const r=26-i;for(let a=0;a<=fin;a+=1/(r*1.6))P(c.x+Math.cos(Math.PI-a)*r,c.yM+6-Math.sin(Math.PI-a)*r,col);});}]})},
    dansefam:{d:2200,f:(t,p,sc)=>({pose:{yeux:"rieurs",bras:(t/400|0)%2?"salut":"repos",onde:(t/200|0)%2},fdy:-Math.round(Math.abs(Math.sin(t/160))*5),fflip:(t/320|0)%2===1,fx:[P=>{const f=sc.famPos();for(let i=0;i<3;i++){const u=(t+i*500)%1500;P.carte(f.x+3+i*3,f.y-2-u*.012,CARTES_FX.coeur,{x:"#f06a9a"});}}]})},
  },
  erreur:{
    oups:{d:1600,f:(t,p,sc)=>({pose:{bras:"epaules"},fcache:true,bulle:t>120?"Oups !":null})},
    pluie:{d:2100,f:(t,p,sc)=>({pose:{yeux:"endormis"},dy:1,fcache:true,fx:[P=>{const c=sc.centre();const nx=c.x-6,ny=c.yT-13;P.carte(nx,ny,CARTES_FX.nuage,{x:"#8a90a4"});P.carte(nx+1,ny+1,["..xx......",".xxxxxx..."],{x:"#b4b8c8"});for(let i=0;i<6;i++){const u=(t+i*170)%700;P(nx+1+i*2,ny+5+u*.018,"#7ab8f2");}}]})},
    soupir:{d:1900,f:(t,p,sc)=>({pose:{bras:"epaules"},fdy:1,fferme:t>200&&t<1500,fx:[P=>{const f=sc.famPos();for(let i=0;i<3;i++){const u=t-i*260;if(u<0||u>1100)continue;const x=f.x+12+u*.01,y=f.y+5-u*.008;const r=u>700?"#e8e8f080":"#e8e8f0";P(x,y,r,2,2);}}]})},
    chute:{d:1900,f:(t,p,sc)=>({pose:{bras:t<380?"haut":"ecartesBas",yeux:t>380?"endormis":null},dy:Math.min(6,Math.round(t/380*6)),fcache:true,fx:t>380?[P=>{const c=sc.centre();for(let i=0;i<3;i++){const a=t/180+i*2.09;P.carte(c.x-1+Math.cos(a)*7,c.yT+4+Math.sin(a)*2,CARTES_FX.etoile,{x:"#f2d06a"});}}]:[]})},
    chapeau:{d:1900,f:(t,p,sc)=>({pose:{sansChapeau:true,yeux:"rieurs"},fcache:true,chapeau:{dx:Math.round(t*.016),dy:-Math.round(t*.03+Math.sin(t/120)*1.5),flip:(t/240|0)%2===1}})},
    livre:{d:1900,f:(t,p,sc)=>({pose:{yeux:t>500?"endormis":null},fcache:true,dy:t>500&&t<650?1:0,fx:[P=>{const c=sc.centre();if(t<500)P.carte(c.x-3,c.yT-20+t*.034,CARTES_FX.livre,{x:"#4a2a6a",y:"#7a4ac8"});else if(t<1100){const u=t-500;P.carte(c.x-3+u*.02,c.yT-3-u*.012+u*u*.00003,CARTES_FX.livre,{x:"#4a2a6a",y:"#7a4ac8"});}if(t>500)for(let i=0;i<3;i++){const a=t/170+i*2.09;P.carte(c.x-1+Math.cos(a)*7,c.yT+3+Math.sin(a)*2,CARTES_FX.etoile,{x:"#f2d06a"});}}]})},
  },
};
class Scene{
  constructor(cv,o){this.cv=cv;this.o=Object.assign({W:64,H:72,s:4,cx:12,cy:4,fx:1,fy:51,fond:true,sol:true},o);cv.width=this.o.W*this.o.s;cv.height=this.o.H*this.o.s;this.ctx=cv.getContext("2d");this.ctx.imageSmoothingEnabled=false;this.cache=new Map();this.fcache=new Map();this.anim=null;this.dernier=0;this.boucle=this.boucle.bind(this);this.raf=requestAnimationFrame(this.boucle);}
  setPerso(cfg){this.cfg=Object.assign({},cfg);this.cache.clear();this.fcache.clear();this.g=geom(this.cfg);this.chap=null;const E=this.g.E;this.anime=/^ailes/.test(cfg.dos)||["lanterne","the","baton"].includes(cfg.main)||!!E.queue||!!E.flotte;this.dessiner(performance.now(),true);}
  centre(){return{x:this.o.cx+CX,yT:this.o.cy+this.g.hy,yM:this.o.cy+this.g.ty,yB:this.o.cy+this.g.G};}
  famPos(){return{x:this.o.fx,y:this.o.fy};}
  image(pose){const k=JSON.stringify(pose);let c=this.cache.get(k);if(!c){c=peindre(this.cfg,pose).c.toile();if(this.cache.size>48)this.cache.clear();this.cache.set(k,c);}return c;}
  imgFam(ferme){const k=ferme?1:0;let c=this.fcache.get(k);if(!c){c=peindreFamilier(this.cfg.familier,this.cfg.famAcc,ferme).toile();this.fcache.set(k,c);}return c;}
  jouer(type,id){const A=ANIMS[type]&&ANIMS[type][id];if(!A||!this.cfg)return;this.anim={A,t0:performance.now(),p:A.init?A.init(this):{}};if(MOUV_REDUIT())this.anim.fige=Math.min(A.d*.45,700);}
  arreter(){cancelAnimationFrame(this.raf);}
  boucle(now){if(!this.cv.isConnected&&this.dernier){this.arreter();return;}this.raf=requestAnimationFrame(this.boucle);if(now-this.dernier<85)return;this.dernier=now;this.dessiner(now);}
  fondImg(){const jour=document.documentElement.classList.contains("jour");if(this.fondC&&this.fondJour===jour)return this.fondC;const{W,H}=this.o;const L=new Calque(W,H);
    const ciel=jour?["#9cc8ee","#b4d6f2","#cfe4f6"]:["#161b46","#1c2256","#262d6a"];for(let y=0;y<H;y++){const c=ciel[Math.min(2,Math.floor(y/(H*.33)))];L.rect(0,y,W,1,c);}
    if(!jour){for(let i=0;i<26;i++){const x=(i*37+11)%W,y=(i*23+5)%Math.floor(H*.55);L.px(x,y,i%5?"#cfe0ff":"#f2d06a");}L.carte(W-14,4,["..xxx.",".xx...","xx....","xx....",".xx...","..xxx."],{x:"#f4f0d8"});}
    else{L.carte(W-14,4,[".xxxx.","xxxxxx","xxxxxx","xxxxxx",".xxxx."],{x:"#fff1a8"});}
    for(let x=0;x<W;x++){const h=Math.round(6+4*Math.sin(x/7)+2*Math.sin(x/3.1));for(let y=H-8-h;y<H-7;y++)L.px(x,y,jour?"#7aa86a":"#232a63");}
    this.fondC=L.toile();this.fondJour=jour;return this.fondC;}
  sol(ctx){const{W,H,s}=this.o;const jour=document.documentElement.classList.contains("jour");for(let y=H-7;y<H;y++){ctx.fillStyle=y===H-7?(jour?"#7fc85f":"#4f8a5a"):y===H-6?(jour?"#5fae4a":"#3f7a4f"):(jour?"#8a6a4a":"#3a2e52");ctx.fillRect(0,y*s,W*s,s);}
    ctx.fillStyle=jour?"#a8865e":"#4a3c66";for(let x=2;x<W;x+=6)ctx.fillRect(x*s,(H-3)*s,2*s,s);}
  dessiner(now,force){if(!this.cfg)return;const ctx=this.ctx,{s,W,H}=this.o;ctx.imageSmoothingEnabled=false;
    let e={},t=0;if(this.anim){t=this.anim.fige!=null?this.anim.fige:now-this.anim.t0;const dureeReelle=this.anim.fige!=null?900:this.anim.A.d;if(now-this.anim.t0>dureeReelle){this.anim=null;}else e=this.anim.A.f(t,this.anim.p,this)||{};}
    const cyc=Math.floor(now/520)%2;const cl=(now%3600)<150;
    const pose=Object.assign({},e.pose||{});if(!pose.yeux&&cl)pose.yeux="endormis";if(this.anime)pose.f=cyc;
    const P=(x,y,c,w=1,h=1)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x)*s,Math.round(y)*s,w*s,h*s);};P.carte=(x,y,rows,pal)=>rows.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!=="."&&pal[r[i]])P(x+i,y+j,pal[r[i]]);});
    ctx.clearRect(0,0,W*s,H*s);if(this.o.fond)ctx.drawImage(this.fondImg(),0,0,W*s,H*s);
    (e.fond||[]).forEach(f=>f(P));
    let dy=e.dy||0;if(this.g.E.flotte)dy+=cyc?-1:0;const img=this.image(pose);const X=(this.o.cx+(e.dx||0))*s,Y=(this.o.cy+dy)*s;
    if(!this.o.fond){ctx.fillStyle="rgba(8,10,30,.28)";ctx.fillRect((this.o.cx+CX-7)*s,(this.o.cy+this.g.G+1)*s,14*s,s);}
    if(e.flip){ctx.save();ctx.translate(X+CW*s,Y);ctx.scale(-1,1);ctx.drawImage(img,0,0,CW*s,CH*s);ctx.restore();}else ctx.drawImage(img,X,Y,CW*s,CH*s);
    if(e.chapeau){if(!this.chap)this.chap=peindreChapeauSeul(this.cfg).toile();const cx=X+e.chapeau.dx*s,cy=Y+e.chapeau.dy*s;if(e.chapeau.flip){ctx.save();ctx.translate(cx+CW*s,cy);ctx.scale(-1,1);ctx.drawImage(this.chap,0,0,CW*s,CH*s);ctx.restore();}else ctx.drawImage(this.chap,cx,cy,CW*s,CH*s);}
    if(this.cfg.familier&&FAMILIERS[this.cfg.familier]){const fi=this.imgFam(e.fferme||(Math.floor(now/2900)%3===0&&now%2900<160));let fdy=e.fdy||0;if(e.fcache)fdy=this.o.sol?7:2;if(!e.fdy&&!e.fcache&&["fantome","slime"].includes(this.cfg.familier))fdy=cyc?-1:0;
      const fx=this.o.fx*s,fyy=(this.o.fy+fdy)*s;ctx.globalAlpha=e.fcache&&!this.o.sol?.45:1;if(e.fflip){ctx.save();ctx.translate(fx+14*s,fyy);ctx.scale(-1,1);ctx.drawImage(fi,0,0,14*s,15*s);ctx.restore();}else ctx.drawImage(fi,fx,fyy,14*s,15*s);ctx.globalAlpha=1;}
    if(this.o.sol)this.sol(ctx);
    (e.fx||[]).forEach(f=>f(P));
    if(e.bulle){const c=this.centre();const bx=Math.min(W-24,c.x+5),by=Math.max(1,c.yT-11);P(bx,by,"#1b1530",23,10);P(bx+1,by+1,"#fffaf0",21,8);P(bx+3,by+10,"#1b1530",3,2);P(bx+4,by+9,"#fffaf0",1,1);ctx.fillStyle="#2b2143";ctx.font=`${6*s}px "Pixelify Sans", monospace`;ctx.textBaseline="middle";ctx.fillText(e.bulle,(bx+2)*s,(by+5)*s);}
  }
}

/* =====================================================================
   ÉCONOMIE : écus, inventaire, quêtes du jour, hauts faits
   ===================================================================== */
const BUS={};function on(t,f){(BUS[t]=BUS[t]||[]).push(f);}function emit(t,d={}){(BUS[t]||[]).forEach(f=>{try{f(d);}catch(e){console.error(e);}});apresEvenement(t,d);}
function normaliser(){
  if(typeof S.ecus!=="number")S.ecus=Math.floor((S.xp||0)/5)+60;
  if(!Array.isArray(S.inv))S.inv=[];S.perso=Object.assign({},PERSO0,S.perso||{});if(!S.hf)S.hf={};
  S.st=Object.assign({jeux:[],forge:0,bonnes:0,serieMax:0,atelierMax:0},S.st||{});if(!Array.isArray(S.atelier))S.atelier=[];if(!S.brouillons)S.brouillons={};
  S.st.serieMax=Math.max(S.st.serieMax||0,S.serie&&S.serie.n||0);
}
function gagner(n){S.ecus=(S.ecus||0)+n;}
function acheter(it){if(possede(it.id)||it.prix==null||(S.ecus||0)<it.prix)return false;S.ecus-=it.prix;S.inv.push(it.id);sauver();majHud();toast("Achat réussi",`${it.nom} rejoint votre garde-robe.`,"coffre");return true;}
function equiper(it,ou){S.perso[it.slot]=it.v;sauver();majPerso();}
const PRONOM_AFF=()=>{const p=S.perso;return p.pronom==="libre"?(p.pronomLibre||"").trim():p.pronom;};
function accord(m,f,n){const p=S.perso&&S.perso.pronom;return p==="il"?m:p==="elle"?f:n;}
const RANGS_G={"Apprenti":["Apprenti","Apprentie","Apprenti·e"],"Compagnon":["Compagnon","Compagne","Compagnon·ne"],"Érudit":["Érudit","Érudite","Érudit·e"],"Maître":["Maître","Maîtresse","Maître·sse"],"Grand Maître":["Grand Maître","Grande Maîtresse","Grand·e Maître·sse"]};
const nomRang=n=>RANGS_G[n]?accord(...RANGS_G[n]):n;
const nbMaitrises=type=>DB[type].filter(x=>boite(x.id)>=3).length;
const HF=[
  {id:"etincelle",nom:"Première étincelle",d:"Donner une première bonne réponse.",prog:()=>[Math.min(1,S.st.bonnes),1],rec:{ecus:20}},
  {id:"quete",nom:"Quête accomplie",d:"Terminer une première quête du jour.",prog:()=>[Math.min(1,Object.keys(S.rituel).length),1],rec:{ecus:50}},
  {id:"sansfaute",nom:"Sans faute",d:"Réussir la quête du jour à 7 sur 7.",prog:()=>[Object.values(S.rituel).some(r=>r.score===r.total)?1:0,1],rec:{item:"visage:lunettes-coeur"}},
  {id:"serie3",nom:"Trois jours d'affilée",d:"Accomplir la quête du jour trois jours de suite.",prog:()=>[Math.min(3,S.st.serieMax),3],rec:{ecus:80}},
  {id:"serie7",nom:"Sept jours d'affilée",d:"Accomplir la quête du jour sept jours de suite.",prog:()=>[Math.min(7,S.st.serieMax),7],rec:{item:"dos:ailes-spectrales"}},
  {id:"bibliothecaire",nom:"Bibliothécaire",d:"Maîtriser 25 fiches d'auteurs.",prog:()=>[Math.min(25,nbMaitrises("auteurs")),25],rec:{item:"haut:gilet"}},
  {id:"annuaire",nom:"Grand annuaire",d:"Maîtriser 100 fiches d'auteurs.",prog:()=>[Math.min(100,nbMaitrises("auteurs")),100],rec:{item:"main:bottin"}},
  {id:"lexicographe",nom:"Lexicographe",d:"Maîtriser 30 notions.",prog:()=>[Math.min(30,nbMaitrises("notions")),30],rec:{item:"main:plume"}},
  {id:"marchand",nom:"Marchand·e",d:"Maîtriser 15 chiffres clés.",prog:()=>[Math.min(15,nbMaitrises("chiffres")),15],rec:{item:"main:balance"}},
  {id:"duelliste",nom:"Duelliste",d:"Enchaîner 10 victoires au Duel des Âges.",prog:()=>[Math.min(10,S.best.eclipse||0),10],rec:{item:"visage:bandeau"}},
  {id:"plumedor",nom:"Plume d'or",d:"Obtenir au moins 14 / 20 à l'Atelier de rédaction.",prog:()=>[S.st.atelierMax>=14?1:0,1],rec:{ecus:250}},
  {id:"explorateur",nom:"Explorateur·ice",d:"Jouer à 8 jeux différents.",prog:()=>[Math.min(8,S.st.jeux.length),8],rec:{ecus:100}},
  {id:"forgeron",nom:"Forgeron·ne",d:"Forger 5 mécanismes sans faute.",prog:()=>[Math.min(5,S.st.forge),5],rec:{item:"main:baton"}},
  {id:"erudit",nom:"Rang d'Érudit",d:"Atteindre 750 XP.",prog:()=>[Math.min(750,S.xp||0),750],rec:{ecus:150}},
];
const libRecompense=r=>r.ecus?`${r.ecus} écus`:ITEMS_PAR_ID[r.item].nom;
function verifierHF(){let n=0;for(const h of HF){if(S.hf[h.id])continue;const[a,b]=h.prog();if(a<b)continue;S.hf[h.id]=Date.now();n++;if(h.rec.ecus)gagner(h.rec.ecus);if(h.rec.item&&!S.inv.includes(h.rec.item))S.inv.push(h.rec.item);toast(`Haut fait : ${h.nom}`,`Récompense : ${libRecompense(h.rec)}.`,"trophee");}return n;}
const QJ=[
  {id:"r-auteurs",g:"a",t:"Répondre juste à 10 questions sur les auteurs et les œuvres",ev:"reponse",f:d=>d.juste&&d.type==="auteur",n:10,lien:"paires-auteurs"},
  {id:"r-notions",g:"a",t:"Répondre juste à 8 questions sur les notions",ev:"reponse",f:d=>d.juste&&d.type==="notion",n:8,lien:"grille-notions"},
  {id:"r-dates",g:"a",t:"Situer correctement 8 dates",ev:"reponse",f:d=>d.juste&&d.type==="date",n:8,lien:"chronique-evenements"},
  {id:"r-chiffres",g:"a",t:"Trouver 5 chiffres clés",ev:"reponse",f:d=>d.juste&&d.type==="chiffre",n:5,lien:"balance-valeurs"},
  {id:"r-mecas",g:"a",t:"Forger 2 mécanismes sans faute",ev:"partie",f:d=>d.jeu==="forge"&&d.parfait,n:2,lien:"forge"},
  {id:"r-calculs",g:"a",t:"Réussir 3 calculs au Comptoir",ev:"calcul",f:d=>d.juste,n:3,lien:"comptoir"},
  {id:"p-paires",g:"b",t:"Terminer une partie de Paires de runes",ev:"partie",f:d=>d.jeu==="paires",n:1,lien:"paires"},
  {id:"p-sceaux",g:"b",t:"Sceller au moins 4 coffres aux Trois Sceaux",ev:"partie",f:d=>d.jeu==="sceaux"&&d.score>=4,n:1,lien:"sceaux"},
  {id:"p-biblio",g:"b",t:"Ranger au moins 6 ouvrages à leur place à la Bibliothèque",ev:"partie",f:d=>d.jeu==="bibliotheque"&&d.score>=6,n:1,lien:"bibliotheque"},
  {id:"p-grille",g:"b",t:"Trouver 6 mots dans la Grille du Scribe",ev:"mot",f:d=>d.juste,n:6,lien:"grille"},
  {id:"p-chronique",g:"b",t:"Vérifier deux Chroniques",ev:"partie",f:d=>d.jeu==="chronique",n:2,lien:"chronique"},
  {id:"p-duel",g:"b",t:"Atteindre 5 victoires d'affilée au Duel des Âges",ev:"partie",f:d=>d.jeu==="duel"&&d.serie>=5,n:1,lien:"duel"},
  {id:"p-faussaire",g:"b",t:"Voir juste sur 4 parchemins du Faussaire",ev:"partie",f:d=>d.jeu==="faussaire"&&d.score,n:4,lien:"faussaire"},
  {id:"p-enigme",g:"b",t:"Résoudre 3 énigmes de la Tour",ev:"partie",f:d=>d.jeu==="enigme"&&d.score,n:3,lien:"enigme"},
  {id:"c-quete",g:"c",t:"Accomplir la quête du jour",ev:"quete",f:()=>true,n:1,lien:"quete"},
  {id:"c-atelier",g:"c",t:"Rendre un exercice à l'Atelier de rédaction",ev:"atelier",f:()=>true,n:1,lien:"atelier"},
];
const QJ_ID=Object.fromEntries(QJ.map(q=>[q.id,q]));
function quetesDuJour(){const k=cleJour();if(!S.qj||S.qj.k!==k){const r=mulberry32(Number(k.replace(/-/g,""))*7+3);const pick=g=>{const L=QJ.filter(q=>q.g===g);return L[Math.floor(r()*L.length)].id;};S.qj={k,ids:[pick("a"),pick("b"),r()<.7?"c-quete":"c-atelier"],p:[0,0,0],ok:[0,0,0],bonus:0};}return S.qj;}
function avancerQJ(ev,d){const q=quetesDuJour();let chg=false;q.ids.forEach((id,i)=>{const def=QJ_ID[id];if(q.ok[i]||!def||def.ev!==ev||!def.f(d))return;q.p[i]=Math.min(def.n,q.p[i]+1);chg=true;
  if(q.p[i]>=def.n){q.ok[i]=1;gagner(20);S.xp=(S.xp||0)+30;toast("Quête du jour accomplie",`${def.t} · +20 écus, +30 XP`,"epee");}});
  if(chg&&!q.bonus&&q.ok.every(Boolean)){q.bonus=1;gagner(40);toast("Les trois quêtes du jour !","Prime de 40 écus.","piece");}return chg;}
on("reponse",d=>{if(d.juste){gagner(2);S.st.bonnes++;}});
on("calcul",d=>{if(d.juste){gagner(2);S.st.bonnes++;}});
on("partie",d=>{if(d.jeu&&!S.st.jeux.includes(d.jeu))S.st.jeux.push(d.jeu);if(d.jeu==="forge"&&d.parfait)S.st.forge++;});
on("quete",d=>{if(!S.st.jeux.includes("quete"))S.st.jeux.push("quete");S.st.serieMax=Math.max(S.st.serieMax,S.serie.n||0);if(d.premier)gagner(10);});
on("atelier",d=>{if(!S.st.jeux.includes("atelier"))S.st.jeux.push("atelier");if(typeof d.note==="number")S.st.atelierMax=Math.max(S.st.atelierMax,d.note);});
let _sauvAtt=null;
function apresEvenement(t,d){avancerQJ(t,d);verifierHF();clearTimeout(_sauvAtt);_sauvAtt=setTimeout(()=>{sauver();majHud();},30);}

/* ----- Annonces ----- */
function toast(titre,texte,ic="trophee"){const z=$("#toasts");if(!z)return;const t=el("div",{class:"toast cadre-nuit"},sprite(ic,28),el("div",{},el("b",{},titre),el("span",{},texte)));z.append(t);annonce(`${titre}. ${texte}`);setTimeout(()=>t.remove(),5200);while(z.children.length>3)z.firstChild.remove();}

/* ----- Compagnon qui réagit pendant les jeux ----- */
let COMP=null;
function initCompagnon(){const b=$("#compagnon");if(!b)return;COMP=new Scene(b.querySelector("canvas"),{W:56,H:68,s:2,cx:14,cy:2,fx:0,fy:52,fond:false,sol:false});COMP.setPerso(S.perso);b.onclick=()=>COMP.jouer("attitude",S.perso.attitude);majCompagnon();}
function majCompagnon(){const b=$("#compagnon");if(!b)return;const cache=!S.perso.compagnon||["accueil","loge","echoppe"].some(v=>vueCourante===v||vueCourante.startsWith("echoppe"));b.hidden=cache;document.body.classList.toggle("avec-compagnon",!cache);b.setAttribute("aria-label",`${S.perso.nom||"Votre personnage"} : toucher pour faire un geste`);}
function majPerso(){if(COMP)COMP.setPerso(S.perso);majCompagnon();}
function reagir(juste,o={}){if(!COMP||$("#compagnon").hidden)return;if(o.leger)COMP.jouer("divers","saut");else COMP.jouer(juste?"succes":"erreur",juste?S.perso.succes:S.perso.erreur);}

/* =====================================================================
   SAUVEGARDE SUR LE COMPTE (db privée par personne), repli local
   ===================================================================== */
const COMPTE={ref:null,refA:null,ecr:false,att:false,min:null,dernier:"",mode:"local"};
const avecDelai=(p,ms)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r({code:"delai"}),ms))]);
function etatPartage(){const o=Object.assign({},S);delete o.atelier;delete o.brouillons;return JSON.stringify(o);}
function planifierSync(){planifierSauvegarde();if(!COMPTE.ref)return;clearTimeout(COMPTE.min);COMPTE.min=setTimeout(pousser,2500);}
async function pousser(){if(!COMPTE.ref)return;if(COMPTE.ecr){COMPTE.att=true;return;}const s=etatPartage();if(s===COMPTE.dernier)return;COMPTE.ecr=true;
  try{await COMPTE.ref.set({maj:S.maj||Date.now(),v:3,etat:s});COMPTE.dernier=s;}catch(e){const c=e&&e.code;if(["quota_exceeded","resource_exhausted","revoked","not_granted","invalid_argument"].includes(c)){COMPTE.ref=null;COMPTE.mode="local";majPied();}}
  finally{COMPTE.ecr=false;if(COMPTE.att){COMPTE.att=false;planifierSync();}}}
async function pousserAtelier(){pousserAtelierCode();if(!COMPTE.refA)return;try{await COMPTE.refA.set({maj:Date.now(),items:S.atelier.slice(0,12)});}catch(e){}}
async function initCompte(){
  const C=window.claude;if(!C||typeof C.use!=="function")return;
  try{const[db,user]=await Promise.all([C.use("db"),C.use("user")]);if(!db||!user)return;const uid=await user.id();if(!uid)return;
    const ref=db.doc(`data/users/${uid}/etat`),refA=db.doc(`data/users/${uid}/atelier`);
    const snap=await avecDelai(ref.get(),10000);const d=snap&&snap.exists?snap.data():null;
    if(d&&typeof d.etat==="string"&&(d.maj||0)>(S.maj||0)){const loc={atelier:S.atelier,brouillons:S.brouillons};S=Object.assign({m:{},rituel:{},serie:{last:null,n:0},best:{},theme:"nuit",filtres:null,xp:0},JSON.parse(d.etat),loc);normaliser();COMPTE.dernier=d.etat;try{localStorage.setItem(CLE,JSON.stringify(S));}catch(e){}COMPTE.ref=ref;appliquerTheme();majHud();majPerso();route();}
    else{COMPTE.ref=ref;pousser();}
    COMPTE.mode="compte";COMPTE.refA=refA;
    try{const sa=await avecDelai(refA.get(),10000);const items=sa&&sa.exists&&Array.isArray(sa.data().items)?sa.data().items:[];const vus=new Set(S.atelier.map(x=>x.t));let ajout=false;items.forEach(x=>{if(x&&x.t&&!vus.has(x.t)){S.atelier.push(x);ajout=true;}});S.atelier.sort((a,b)=>b.t-a.t);S.atelier=S.atelier.slice(0,12);if(ajout){try{localStorage.setItem(CLE,JSON.stringify(S));}catch(e){}if(vueCourante==="atelier")route();}}catch(e){}
    majPied();
  }catch(e){}
}
function majPied(){const p=$("#pied");if(!p)return;let fin;if(COMPTE.mode==="compte")fin="Progression, personnage et copies sauvegardés sur votre compte Claude.";else if(supaActif())fin=el("span",{},SAUVE.code?"Progression sauvegardée en ligne avec votre code · ":"Progression gardée dans ce navigateur · ",el("a",{href:"#sauvegarde"},SAUVE.code?"sauvegarde":"créer un code de sauvegarde"),".");else fin="Progression sauvegardée dans ce navigateur.";
  p.replaceChildren(el("p",{},`La Guilde des SES · ${fr(TOUT.length)} fiches · vérification du ${DATA.meta.date} · `,el("a",{href:"#archives"},"sources et méthode"),". ",fin));}
