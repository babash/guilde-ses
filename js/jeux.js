/* =====================================================================
   La Guilde des SES · cœur du site
   État, outils, sprites, fiches, générateurs de questions, mini-jeux, accueil et chapitres.
   ===================================================================== */
"use strict";
/* ========== Outils ========== */
const $=(s,r=document)=>r.querySelector(s);
function el(tag,props,...kids){const e=document.createElement(tag);if(props){for(const[k,v]of Object.entries(props)){if(v==null||v===false)continue;if(k==="class")e.className=v;else if(k.startsWith("on")&&typeof v==="function")e.addEventListener(k.slice(2),v);else if(k==="style")e.style.cssText=v;else e.setAttribute(k,v===true?"":v);}}for(const k of kids.flat(Infinity)){if(k==null||k===false||k==="")continue;e.append(k.nodeType?k:document.createTextNode(String(k)));}return e;}
const annonce=t=>{const a=$("#annonce");a.textContent="";setTimeout(()=>a.textContent=t,30);};
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const R0=Math.random;
const rint=(n,r=R0)=>Math.floor(r()*n);
function melange(a,r=R0){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const fr=(n,d=0)=>Number(n).toLocaleString("fr-FR",{minimumFractionDigits:d,maximumFractionDigits:d});
const sansAccent=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"");
const NBSP=" ";

/* ========== Sprites pixel (dessins originaux) ========== */
const PAL={k:"#2b2143",o:"#e8b84a",O:"#9a6a1e",w:"#fffaf0",W:"#d6bf8a",s:"#cfe0ff",S:"#8fa3d8",v:"#7a64e0",V:"#4a3a9a",g:"#3f9a5f",r:"#c8553d",n:"#7a5320",b:"#3d6fd8"};
const SPR={
 livre:[".kkkkkkkkk.","kVvvvvvvvok","kVvvvvvvvok","kVvvoovvvok","kVvoooovvok","kVvvoovvvok","kVvvvvvvvok","kVvvvvvvvok","kwwwwwwwwwk",".kkkkkkkkk."],
 epee:[".........ss","........sSk",".......sSk.","......sSk..",".....sSk...",".o..sSk....","..oSSk.....","..nno......",".nn..o.....","nn........."],
 cle:["..oooo.....",".o....o....",".o....o....",".o....o....","..oooo.....","...oo......","...oo......","...oooo....","...oo......","...ooo....."],
 balance:["....oo....","oooooooooo",".o..oo..o.","o.o.oo.o.o","ooo.oo.ooo","....oo....","....oo....","...oooo...","..oooooo.."],
 enclume:[".kkkkkkkkk.","kSSSSSSSSSk",".kSSSSSSSkk","..kSSSSSk..","...kSSSk...","...kSSSk...","..kSSSSSk..",".kkkkkkkkk."],
 sablier:["oooooooooo",".kwwwwwwk.","..kwwwwk..","...kwwk...","....kk....","....kk....","...kwok...","..kwooOk..",".kooooOOk.","oooooooooo"],
 masque:[".kkkkkkkk.","kvvvvvvvvk","kvkkvvkkvk","kvkkvvkkvk","kvvvvvvvvk",".kvvvvvvk.","..kkvvkk..","....kk...."],
 plume:[".........s","........ss",".......ssS","......ssS.",".....ssS..","....ssS...","...ssS....","..nsS.....",".nn.......","k........."],
 piece:["..oooooo..",".oooooooo.","oooOOOOooo","ooOooooOoo","ooOoooooo","ooOooooOoo","oooOOOOooo",".oooooooo.","..oooooo.."],
 blason:[".kkkkkkkkk.","kssssssssSk","ksvvvvvvvSk","ksvvvoovvSk","ksvvoooovSk","ksvvvoovvSk",".ksvvvvvSk.","..ksvvvSk..","...kssSk...","....kkk...."],
 gemme:["..kkk..",".kvsvk.","kvssSvk",".kvSvk.","..kkk.."],
 gemme0:["..kkk..",".kWWWk.","kWWWWWk",".kWWWk.","..kkk.."],
 carte:["kkkkkkkkkk","kwwWwwwWwk","kwrwWwwWwk","kwwWwgwWwk","kwwWwwwWbk","kwwWwwwWwk","kkkkkkkkkk"],
 tour:["....s....","...sSs...","...kvk...","...kok...","..kvvvk..","..kvovk..","..kvvvk..",".kvvvvvk.","kkkkkkkkk"],
};
function sprite(nom,taille=30,titre){const g=SPR[nom];if(!g)return el("span");const h=g.length,w=Math.max(...g.map(r=>r.length));let r="";g.forEach((row,y)=>{[...row].forEach((c,x)=>{if(c!=="."&&PAL[c])r+=`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${PAL[c]}"/>`;});});const s=document.createElement("span");s.className="sprite";s.innerHTML=`<svg width="${taille}" height="${Math.round(taille*h/w)}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" ${titre?"":'aria-hidden="true"'}>${titre?`<title>${titre}</title>`:""}${r}</svg>`;return s;}

/* ========== Mémoire locale ========== */
const CLE="grimoire-lunaire-ses-v1";
let S={m:{},rituel:{},serie:{last:null,n:0},best:{},theme:"nuit",filtres:null,xp:0};
try{const raw=localStorage.getItem(CLE);if(raw)Object.assign(S,JSON.parse(raw));}catch(e){}
function sauver(){S.maj=Date.now();try{localStorage.setItem(CLE,JSON.stringify(S));}catch(e){}planifierSync();}
function noter(id,juste){if(!id)return;const m=S.m[id]||{b:0,v:0,j:0};m.v++;if(juste){m.j++;m.b=Math.min(4,m.b+1);S.xp=(S.xp||0)+10;}else m.b=0;m.t=Date.now();S.m[id]=m;sauver();majHud();emit("reponse",{id,type:(PAR_ID[id]||{}).type,juste});}
const boite=id=>(S.m[id]&&S.m[id].b)||0;
const RANGS=[[0,"Apprenti"],[250,"Compagnon"],[750,"Érudit"],[1750,"Maître"],[3500,"Grand Maître"]];
function rang(){const xp=S.xp||0;let i=0;while(i<RANGS.length-1&&xp>=RANGS[i+1][0])i++;const bas=RANGS[i][0],haut=RANGS[i+1]?RANGS[i+1][0]:bas;return{nom:RANGS[i][1],xp,suivant:RANGS[i+1]?RANGS[i+1][1]:null,ratio:RANGS[i+1]?(xp-bas)/(haut-bas):1,reste:RANGS[i+1]?haut-xp:0};}

/* ========== Données ========== */
const DISC={eco:"Économie",socio:"Sociologie",sp:"Science politique",epi:"Épistémologie"};
const NIVL={"2":"Seconde","1":"Première","T":"Terminale","HP":"Histoire de la pensée"};
const NIV=c=>c==="HP"?"HP":c[0];
const CHAP=DATA.chapitres,PROG=DATA.programmes,OFF=DATA.officiel;
const DB={auteurs:DATA.auteurs,notions:DATA.notions,dates:DATA.dates,mecas:DATA.mecas,chiffres:DATA.chiffres};
const TOUT=[].concat(DB.auteurs,DB.notions,DB.dates,DB.mecas,DB.chiffres);
const PAR_ID=Object.fromEntries(TOUT.map(x=>[x.id,x]));
TOUT.forEach(x=>{x.niv=[...new Set(x.chap.map(NIV))];});
const nbSourcees=TOUT.filter(x=>x.verif).length;
const chapHash=c=>"ch-"+c.toLowerCase();
const CHAP_DE_HASH=Object.fromEntries(Object.keys(CHAP).map(c=>[chapHash(c),c]));

/* Ce que l'on apprend, et pour quelle épreuve */
const SAVOIRS={
 auteurs:{l:"Auteurs, œuvres et idées",icone:"livre",type:"auteurs",bref:"la dissertation (écrit 1), la question d'histoire de la pensée (bac + 5), les questions sans préparation de l'oral (bac + 3)",
   usage:"Mobiliser des auteurs dans la dissertation (écrit 1), traiter la question d'histoire de la pensée (bac + 5) et les questions sans préparation de l'oral (bac + 3). Le jury attend les courants, leurs représentants et des noms correctement orthographiés."},
 notions:{l:"Notions et définitions",icone:"plume",type:"notions",bref:"les définitions de l'introduction, la question sur un concept du domaine mineur (écrit 1, bac + 3)",
   usage:"Poser des définitions précises dès l'introduction, ce que le jury exige, et traiter la question sur un concept du domaine mineur (écrit 1, bac + 3)."},
 dates:{l:"Dates et repères historiques",icone:"sablier",type:"dates",bref:"la contextualisation historique de la dissertation",
   usage:"Contextualiser une dissertation avec des repères sûrs : le jury relève des erreurs de chronologie, par exemple sur les Trente Glorieuses."},
 mecas:{l:"Mécanismes",icone:"enclume",type:"mecas",bref:"la question sur un mécanisme ou un processus du domaine mineur (écrit 1, bac + 3)",
   usage:"Répondre à la question sur un mécanisme ou un processus du domaine mineur (écrit 1, bac + 3) et enchaîner les arguments sans rupture logique."},
 chiffres:{l:"Chiffres clés",icone:"balance",type:"chiffres",bref:"les ordres de grandeur attendus par le jury, les documents statistiques (écrit 2, oral)",
   usage:"Connaître les ordres de grandeur des principaux indicateurs, comme le demande le jury, et situer un document statistique (écrit 2, oral)."},
 calculs:{l:"Calculs sur données",icone:"piece",type:null,bref:"l'exploitation de données quantitatives (écrit 2 et oral 1, bac + 3 ; leçon, bac + 5)",
   usage:"Exploiter les données quantitatives d'un document statistique : écrit 2 et oral 1 (bac + 3), exercice de la leçon (bac + 5)."},
};
const JEUX={
 quete:{nom:"Quête du jour",icone:"epee",savoirs:["auteurs","notions","dates","chiffres","mecas"],fluff:"Chaque matin, le tableau de la guilde affiche une nouvelle quête.",regle:"Sept questions tirées de tout le programme, une de chaque sorte. Le tirage dépend de la date : il est le même pour tous ce jour-là. Revenez chaque jour pour allonger votre série.",epreuve:"Un entretien quotidien de toutes les connaissances des écrits et des oraux."},
 paires:{nom:"Paires de runes",icone:"gemme",fluff:"Les tablettes runiques vont par paires : retrouvez-les.",regle:"Retournez deux cartes. Si elles vont ensemble, elles restent ouvertes et la fiche correspondante s'affiche sous le plateau, avec sa source.",
   modes:{auteurs:{l:"Auteur ↔ notion clé",savoirs:["auteurs"]},oeuvres:{l:"Œuvre ↔ année",savoirs:["auteurs","dates"]},notions:{l:"Notion ↔ définition",savoirs:["notions"]},dates:{l:"Événement ↔ année",savoirs:["dates"]}},def:"auteurs"},
 sceaux:{nom:"Les Trois Sceaux",icone:"cle",savoirs:["auteurs"],fluff:"Chaque coffre se ferme par trois sceaux : un nom, une idée, une année.",regle:"Touchez un auteur puis la notion qui lui correspond ; touchez une notion puis l'année de l'œuvre. Vérifiez quand les cinq chaînes sont tracées."},
 bibliotheque:{nom:"La Bibliothèque en désordre",icone:"livre",fluff:"Les ouvrages ont glissé des rayonnages. Remettez chacun à sa place.",regle:"Touchez un ouvrage, puis le rayonnage où il doit aller. Un ouvrage déjà rangé revient dans la pile si vous le touchez.",
   modes:{courants:{l:"Par courant de pensée",savoirs:["auteurs"]},disciplines:{l:"Par discipline",savoirs:["auteurs","notions"]},periodes:{l:"Par période",savoirs:["auteurs","dates"]},niveaux:{l:"Par niveau du programme",savoirs:["notions","auteurs"]}},def:"courants"},
 grille:{nom:"La Grille du Scribe",icone:"plume",fluff:"Le scribe a laissé une grille à compléter dans la marge du registre.",regle:"Touchez une définition ou une case, puis écrivez. Les accents ne comptent pas. Un mot juste dévoile sa source.",
   modes:{notions:{l:"Notions",savoirs:["notions"]},auteurs:{l:"Noms d'auteurs (orthographe)",savoirs:["auteurs"]}},def:"notions"},
 chronique:{nom:"La Chronique",icone:"sablier",fluff:"Les pages de la chronique ont été mélangées.",regle:"Classez du plus ancien (en haut) au plus récent à l'aide des flèches, puis vérifiez.",
   modes:{mixte:{l:"Œuvres et événements",savoirs:["dates","auteurs"]},oeuvres:{l:"Œuvres",savoirs:["auteurs"]},evenements:{l:"Événements",savoirs:["dates"]}},def:"mixte"},
 duel:{nom:"Le Duel des Âges",icone:"epee",savoirs:["dates","auteurs"],fluff:"Deux parchemins s'affrontent : lequel est le plus ancien ?",regle:"Touchez le plus ancien des deux. À chaque victoire, les dates se rapprochent."},
 forge:{nom:"La Forge des Mécanismes",icone:"enclume",savoirs:["mecas"],fluff:"Un mécanisme se forge maillon par maillon.",regle:"Touchez les étapes dans l'ordre logique. Touchez une étape déjà placée pour la retirer."},
 faussaire:{nom:"Le Faussaire",icone:"masque",savoirs:["auteurs","dates"],fluff:"Un faussaire a peut-être altéré ce parchemin.",regle:"L'œuvre (ou l'événement) est authentique. Touchez l'élément falsifié, ou déclarez le parchemin authentique."},
 enigme:{nom:"L'Énigme de la Tour",icone:"tour",savoirs:["auteurs"],fluff:"La gardienne de la tour décrit un savant : qui est-ce ?",regle:"Chaque indice supplémentaire coûte un point. Choisissez l'auteur dès que vous l'avez reconnu."},
 balance:{nom:"La Balance du Marchand",icone:"balance",fluff:"Le marchand ne se laisse pas tromper sur les ordres de grandeur.",regle:"Choisissez la bonne valeur parmi quatre, ou dites si la vraie valeur est au-dessus ou en dessous de celle annoncée.",
   modes:{valeurs:{l:"Quatre valeurs",savoirs:["chiffres"]},"plus-moins":{l:"Au-dessus ou en dessous",savoirs:["chiffres"]}},def:"valeurs"},
 comptoir:{nom:"Le Comptoir du Trésorier",icone:"piece",savoirs:["calculs"],fluff:"Le trésorier vérifie chaque calcul avant de signer le registre.",regle:"Calculez puis saisissez votre résultat (virgule ou point). La solution détaillée s'affiche après validation."},
 codex:{nom:"Le Codex",icone:"livre",savoirs:["auteurs","notions","dates","mecas","chiffres"],fluff:"Toutes les fiches de la guilde, avec leurs sources.",regle:"Recherchez une fiche, filtrez par type et ouvrez-la pour voir ses sources et son chapitre."},
};
const savoirsDe=(id,mode)=>{const j=JEUX[id];return j.modes?j.modes[mode].savoirs:j.savoirs;};
const ORDRE_SAVOIRS=["auteurs","notions","dates","mecas","chiffres","calculs"];
const PLAN={
 auteurs:[["paires-auteurs"],["paires-oeuvres"],["sceaux"],["faussaire"],["enigme"],["bibliotheque-courants"],["grille-auteurs"],["chronique-oeuvres"]],
 notions:[["grille-notions"],["paires-notions"],["bibliotheque-disciplines"],["bibliotheque-niveaux"]],
 dates:[["chronique-evenements"],["duel"],["paires-dates"],["bibliotheque-periodes"]],
 mecas:[["forge"]],
 chiffres:[["balance-valeurs"],["balance-plus-moins"]],
 calculs:[["comptoir"]],
};
function decoupe(h){for(const id of Object.keys(JEUX)){if(h===id)return{id,mode:JEUX[id].def||null};if(JEUX[id].modes&&h.startsWith(id+"-")){const m=h.slice(id.length+1);if(JEUX[id].modes[m])return{id,mode:m};}}return null;}
function libJeu(h){const d=decoupe(h);const j=JEUX[d.id];return{nom:j.nom,mode:d.mode&&j.modes?j.modes[d.mode].l:null,icone:j.icone};}

/* ========== Périmètre ========== */
let F=Object.assign({disc:["eco","socio","sp","epi"],niv:["2","1","T","HP"],chap:"",jury:false,verif:false},S.filtres||{});
F.disc=new Set(F.disc);F.niv=new Set(F.niv);
function sauverFiltres(){S.filtres={disc:[...F.disc],niv:[...F.niv],chap:F.chap,jury:F.jury,verif:F.verif};sauver();}
function passe(x){if(!F.disc.has(x.disc))return false;if(F.jury&&!x.jury)return false;if(F.verif&&!x.verif)return false;if(F.chap)return x.chap.includes(F.chap);return x.niv.some(n=>F.niv.has(n));}
function reserve(types,min){const all=[].concat(...types.map(t=>DB[t]));const p=all.filter(passe);if(p.length>=min)return{items:p,elargi:false};const p2=all.filter(x=>!F.verif||x.verif);if(p2.length>=min)return{items:p2,elargi:true};return{items:all,elargi:true};}
function tirer(arr,k,{r=R0,cle=null,pondere=true,exclure=null}={}){const pool=arr.filter(x=>!exclure||!exclure(x));const out=[];const vus=new Set();while(out.length<k&&pool.length){let i;if(pondere){const w=pool.map(x=>1/Math.pow(1+boite(x.id),1.4));let s=w.reduce((a,b)=>a+b,0),t=r()*s;i=0;while(i<pool.length-1&&t>w[i]){t-=w[i];i++;}}else i=Math.floor(r()*pool.length);const x=pool.splice(i,1)[0];if(cle){const v=cle(x);if(vus.has(v))continue;vus.add(v);}out.push(x);}return out;}
function resumePerimetre(){if(F.chap)return `${NIVL[NIV(F.chap)]} — ${CHAP[F.chap].court}${F.jury?" · cités par le jury":""}${F.verif?" · sources vérifiées":""}`;const d=F.disc.size===4?"toutes disciplines":[...F.disc].map(k=>DISC[k]).join(", ");const n=F.niv.size===4?"tous niveaux":[...F.niv].map(n=>NIVL[n]).join(", ");return `${d} · ${n}${F.jury?" · cités par le jury":""}${F.verif?" · sources vérifiées":""}`;}
function panneauFiltres(onChange){
  const det=el("details",{class:"perimetre"});
  const sum=el("summary",{},el("span",{},"Périmètre de révision ▾"),el("b",{},resumePerimetre()));
  const maj=()=>{sum.lastChild.textContent=resumePerimetre();sauverFiltres();onChange&&onChange();};
  const puces=(obj,set,disc)=>Object.entries(obj).map(([k,v])=>{const b=el("button",{class:"puce"+(disc?" d-"+k:""),"aria-pressed":String(set.has(k)),type:"button"},disc?el("span",{class:"point"}):null,v);b.onclick=()=>{if(set.has(k)){if(set.size>1)set.delete(k);}else set.add(k);b.setAttribute("aria-pressed",String(set.has(k)));maj();};return b;});
  const sel=el("select",{id:"sel-chap-"+Math.random().toString(36).slice(2,7)});
  sel.append(el("option",{value:""},"Tous les chapitres des niveaux choisis"));
  for(const n of ["2","1","T","HP"]){const g=el("optgroup",{label:NIVL[n]});for(const[k,c]of Object.entries(CHAP))if(NIV(k)===n)g.append(el("option",{value:k},c.court));sel.append(g);}
  sel.value=F.chap;sel.onchange=()=>{F.chap=sel.value;maj();};
  const tj=el("button",{class:"puce","aria-pressed":String(F.jury),type:"button"},"Références citées par le jury 2026");tj.onclick=()=>{F.jury=!F.jury;tj.setAttribute("aria-pressed",String(F.jury));maj();};
  const tv=el("button",{class:"puce","aria-pressed":String(F.verif),type:"button"},"Fiches à source vérifiée");tv.onclick=()=>{F.verif=!F.verif;tv.setAttribute("aria-pressed",String(F.verif));maj();};
  det.append(sum,el("div",{class:"filtres"},
    el("div",{class:"ligne"},el("span",{class:"oeil"},"Disciplines"),el("div",{class:"rangee"},puces(DISC,F.disc,true))),
    el("div",{class:"ligne"},el("span",{class:"oeil"},"Niveaux du programme"),el("div",{class:"rangee"},puces(NIVL,F.niv,false))),
    el("div",{class:"ligne"},el("label",{class:"oeil",for:sel.id},"Un chapitre précis"),sel),
    el("div",{class:"ligne"},el("span",{class:"oeil"},"Restreindre aux"),el("div",{class:"rangee"},tj,tv))));
  return det;
}
const avisElargi=e=>e?el("p",{class:"avis"},"Ce périmètre contient trop peu de fiches pour ce jeu : la partie puise dans tout le programme."):document.createTextNode("");

/* ========== Fiches ========== */
const lienExt=(u,...k)=>el("a",{href:u,target:"_blank",rel:"noopener noreferrer"},...k);
const NOM_TYPE={auteur:"Auteur et œuvre",notion:"Notion",date:"Date",meca:"Mécanisme",chiffre:"Chiffre clé"};
function tagsFiche(x){return el("div",{class:"tags"},el("span",{class:`etiquette plein d-${x.disc}`},DISC[x.disc]),el("span",{class:"etiquette"},NOM_TYPE[x.type]),x.chap.slice(0,2).map(c=>el("a",{class:"etiquette",href:"#"+chapHash(c),style:"text-decoration:none"},`${NIVL[NIV(c)]} · ${CHAP[c].court}`)));}
function sourcesEl(x){
  const box=el("div",{class:"sources"});
  if(x.verif)x.src.forEach(s=>box.append(lienExt(s.u,"Source : ",s.l," ↗")));
  else box.append(el("span",{},el("span",{class:"a-confirmer"},"source à confirmer")," ",lienExt(x.recherche,"Rechercher cette référence ↗")));
  x.chap.slice(0,2).forEach(c=>{const p=PROG[NIV(c)];if(p){const a=lienExt(p.u,`Programme officiel · ${NIVL[NIV(c)]} : « ${CHAP[c].t} » ↗`);a.className="prog";box.append(a);}});
  return box;
}
function titreFiche(x){return x.type==="auteur"?x.auteur:x.type==="notion"?x.terme:x.type==="date"?x.evenement:x.type==="chiffre"?x.indicateur:x.titre;}
function ficheEl(x,etat){
  const box=el("article",{class:`fiche d-${x.disc}${etat?" "+etat:""}`});
  const tete=el("div",{class:"tete"},tagsFiche(x),x.jury?lienExt(OFF.jury.u,"Cité par le jury 2026"):null);if(x.jury)tete.lastChild.className="jury";
  box.append(tete);
  if(x.type==="auteur")box.append(el("h4",{},x.auteur),el("p",{},el("cite",{},x.oeuvre),` (${x.anneeAff||x.annee})`),el("p",{},x.idee),el("p",{class:"meta"},"Notion clé : ",el("strong",{},x.concept),x.courant?` · ${x.courant}`:""));
  else if(x.type==="notion")box.append(el("h4",{},x.terme),el("p",{},x.def));
  else if(x.type==="date")box.append(el("h4",{},x.evenement),el("p",{class:"meta"},x.date),el("p",{},x.detail));
  else if(x.type==="chiffre")box.append(el("h4",{},x.indicateur),el("p",{},el("strong",{style:"font-size:1.2rem"},x.affichage),` · ${x.periode}${x.champ?", "+x.champ:""}`),x.precision?el("p",{class:"meta"},x.precision):null);
  else box.append(el("h4",{},x.titre),el("ol",{},x.etapes.map(s=>el("li",{},s))));
  box.append(sourcesEl(x));return box;
}
function retourEl(juste,texte,fiches){reagir(juste);return el("div",{class:"pile"},el("p",{class:"verdict "+(juste?"juste":"faux")},texte,juste?el("span",{class:"gain"},"  +10 XP · +2 écus"):null),el("div",{class:"liste-fiches"},fiches));}

/* ========== En-tête d'un jeu : ce que l'on apprend ========== */
function entete(id,mode,base){
  const j=JEUX[id];const sv=savoirsDe(id,mode);
  const sec=el("section",{class:"cadre entete"});
  sec.append(el("div",{class:"titre"},sprite(j.icone,40),el("div",{},el("span",{class:"oeil"},(j.oeil||"Quête")+(j.modes?" · "+j.modes[mode].l:"")),el("h1",{},j.nom))),el("p",{class:"fluff"},j.fluff));
  if(j.modes)sec.append(el("nav",{class:"modes","aria-label":"Variantes"},Object.entries(j.modes).map(([k,m])=>el("a",{class:"puce",href:`#${id}-${k}`,"aria-current":k===mode?"page":null},m.l))));
  const obj=el("div",{class:"objectif"},
    el("div",{class:"l"},el("span",{},"Vous révisez"),el("div",{class:"tags"},sv.map(s=>el("span",{class:"etiquette"},sprite(SAVOIRS[s].icone,16),SAVOIRS[s].l)))),
    el("div",{class:"l"},el("span",{},"Utile pour"),j.epreuve?el("span",{},j.epreuve):el("ul",{},sv.map(s=>el("li",{},`${SAVOIRS[s].l.split(",")[0].split(" et ")[0]} : ${SAVOIRS[s].bref}.`)))),
    base!==false?el("div",{class:"l"},el("span",{},"Périmètre"),el("span",{class:"perim"},resumePerimetre())):null,
    el("div",{class:"l"},el("span",{},"Règle"),el("span",{},j.regle)));
  sec.append(obj);return sec;
}
function majPerimetreEntete(){document.querySelectorAll(".objectif .perim").forEach(s=>s.textContent=resumePerimetre());}

/* ========== Date & série ========== */
function cleJour(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function veille(k){const[y,m,d]=k.split("-").map(Number);return cleJour(new Date(y,m-1,d-1));}
function serieActuelle(){const k=cleJour();return(S.serie.last===k||S.serie.last===veille(k))?S.serie.n:0;}
function majHud(){const r=rang();const n=serieActuelle();const bo=$("#bourse");if(bo)bo.replaceChildren(sprite("piece",16),fr(S.ecus||0));const h=$("#hud");if(!h)return;h.replaceChildren(el("span",{},nomRang(r.nom)),el("span",{class:"jauge-xp",title:`${r.xp} XP`},el("i",{style:`width:${Math.round(100*r.ratio)}%`})),el("span",{},`${r.xp} XP`),el("span",{},n?`· ${n} j. d'affilée`:"· quête à faire"));}

/* ========== Générateurs de questions ========== */
const court=x=>x.court||x.auteur;
const estNobel=x=>/^Prix Nobel/.test(x.oeuvre||"");
const libChrono=x=>x.type==="date"?x.evenement:(estNobel(x)?`Prix Nobel d'économie : ${court(x)}`:`« ${x.oeuvre} » (${court(x)})`);
function qAuteur(r,items){const x=tirer(items,1,{r,pondere:r===R0})[0];const autres=tirer(items.filter(y=>court(y)!==court(x)),3,{r,pondere:false,cle:court});const ch=melange([x,...autres],r);return{sorte:"auteurs",prompt:"À quel auteur doit-on cette idée ?",citation:x.idee,choix:ch.map(court),bon:ch.indexOf(x),fiches:[x]};}
function qNotion(r,items){const x=tirer(items,1,{r,pondere:r===R0})[0];const pool=items.filter(y=>y.terme!==x.terme);const memes=pool.filter(y=>y.disc===x.disc);const autres=tirer(memes.length>=3?memes:pool,3,{r,pondere:false,cle:y=>y.terme});const ch=melange([x,...autres],r);return{sorte:"notions",prompt:"Quelle notion correspond à cette définition ?",citation:x.def,choix:ch.map(y=>y.terme),bon:ch.indexOf(x),fiches:[x]};}
function anneesProches(a,r,n=3){const s=new Set([a]);let g=0;while(s.size<n+1&&g<200){g++;const d=(1+rint(12,r))*(r()<.5?-1:1);const v=a+d;if(v>1500&&v<=2026)s.add(v);}return[...s];}
function qDate(r,items){const x=tirer(items,1,{r,pondere:r===R0})[0];const ans=melange(anneesProches(x.annee,r),r);return{sorte:"dates",prompt:"En quelle année ?",citation:x.evenement,choix:ans.map(String),bon:ans.indexOf(x.annee),fiches:[x]};}
function qDuel(r,items,gapMax=400){const a=tirer(items,1,{r,pondere:r===R0})[0];let c=items.filter(y=>y.annee!==a.annee&&Math.abs(y.annee-a.annee)<=gapMax);if(!c.length)c=items.filter(y=>y.annee!==a.annee);const b=c[rint(c.length,r)];const ch=melange([a,b],r);return{sorte:"dates",prompt:"Lequel est le plus ancien ?",choix:ch.map(libChrono),bon:ch[0].annee<ch[1].annee?0:1,fiches:ch,annees:ch.map(y=>y.anneeAff||y.annee)};}
function falsifier(x,r,pool){const alt=r()<0.68?["auteur","annee","concept"][rint(3,r)]:null;let aut=court(x),an=x.anneeAff||String(x.annee),con=x.concept;
  if(alt==="auteur"){let c=pool.filter(y=>y.auteur!==x.auteur&&court(y)!==court(x)&&y.disc===x.disc);if(!c.length)c=pool.filter(y=>y.auteur!==x.auteur);aut=court(c[rint(c.length,r)]);}
  if(alt==="annee"){let d=0;while(d===0)d=(2+rint(25,r))*(r()<.5?-1:1);let v=x.annee+d;if(v>2025)v=x.annee-Math.abs(d);an=String(v);}
  if(alt==="concept"){const c=pool.filter(y=>y.concept!==x.concept&&y.auteur!==x.auteur);con=c[rint(c.length,r)].concept;}
  return{alt,seg:{auteur:aut,annee:an,concept:con}};}
function qFaussaire(r,items){const x=tirer(items,1,{r,pondere:r===R0})[0];const f=falsifier(x,r,items);return{sorte:"auteurs",prompt:"Ce parchemin est-il authentique ?",citation:`« ${x.oeuvre} » — ${f.seg.auteur}, ${f.seg.annee} — notion clé : ${f.seg.concept}.`,choix:["Authentique","Falsifié"],bon:f.alt?1:0,fiches:[x]};}
function qMeca(r,items){const m=items[rint(items.length,r)];const i=rint(m.etapes.length-1,r);const bonne=m.etapes[i+1];const autres=melange(m.etapes.filter((s,j)=>j!==i&&j!==i+1),r).slice(0,3);const ch=melange([bonne,...autres],r);return{sorte:"mecas",prompt:`${m.titre} : quelle étape vient juste après celle-ci ?`,citation:m.etapes[i],choix:ch,bon:ch.indexOf(bonne),fiches:[m]};}
function decimales(x){const s=String(x.valeur);return s.includes(".")?Math.min(3,s.split(".")[1].length):0;}
function fmtC(v,d,x){const u=x.unite||"";if(!u||u==="indice"||u==="rapport")return fr(v,d);return fr(v,d)+NBSP+u;}
function distracteurs(x,r){const v=x.valeur,d=decimales(x);const out=[];const vus=new Set([fmtC(v,d,x)]);for(const f of melange([0.45,0.6,0.75,1.3,1.6,2.1,2.8],r)){let w=v*f;if(/^%/.test(x.unite||"")&&w>100)w=Math.min(99,v+(100-v)*f/3);const s=fmtC(w,d,x);if(!vus.has(s)&&w!==0){vus.add(s);out.push(w);}if(out.length===3)break;}return out;}
function qChiffre(r,items){const x=tirer(items,1,{r,pondere:r===R0})[0];const d=decimales(x);const vals=melange([x.valeur,...distracteurs(x,r)],r);return{sorte:"chiffres",prompt:`Quel est l'ordre de grandeur ? (${x.periode}${x.champ?", "+x.champ:""})`,citation:x.indicateur,choix:vals.map(v=>fmtC(v,d,x)),bon:vals.indexOf(x.valeur),fiches:[x]};}
function rendreQCM(zone,q,onFin){
  zone.replaceChildren();
  const f0=q.fiches[0];
  const tags=el("div",{class:"tags"},el("span",{class:"etiquette"},sprite(SAVOIRS[q.sorte].icone,16),SAVOIRS[q.sorte].l),f0?el("span",{class:"etiquette"},`${NIVL[NIV(f0.chap[0])]} · ${CHAP[f0.chap[0]].court}`):null);
  const p=el("p",{class:"question"},q.prompt,q.citation?el("span",{class:"citation"},q.citation):null);
  const ch=el("div",{class:"choix"});const ret=el("div");
  q.choix.forEach((c,i)=>{const b=el("button",{type:"button"},c);b.onclick=()=>{const ok=i===q.bon;[...ch.children].forEach((bb,j)=>{bb.disabled=true;if(j===q.bon)bb.classList.add("juste");});if(!ok)b.classList.add("faux","secousse");if(q.annees)[...ch.children].forEach((bb,j)=>bb.append(el("span",{class:"doux"},` (${q.annees[j]})`)));q.fiches.forEach(f=>noter(f.id,ok));ret.replaceChildren(retourEl(ok,ok?"Juste.":`Non : la bonne réponse était « ${q.choix[q.bon]} ».`,q.fiches.map(f=>ficheEl(f,ok?"juste":"faux"))));annonce(ok?"Bonne réponse":"Mauvaise réponse");onFin&&onFin(ok);};ch.append(b);});
  zone.append(tags,p,ch,ret);
}

/* ========== Paysage pixel (dessiné à la main, original) ========== */
let paysageStop=null;
function paysage(conteneur){
  const cv=el("canvas",{"aria-hidden":"true"});conteneur.prepend(cv);const cx=cv.getContext("2d");
  const reduit=matchMedia("(prefers-reduced-motion: reduce)").matches;const P=4;let W,H,etoiles=[],lucioles=[],monts1=[],monts2=[],arbres=[];
  const rnd=mulberry32(7);
  function init(){const r=conteneur.getBoundingClientRect();W=Math.max(80,Math.ceil(r.width/P));H=Math.max(40,Math.ceil(r.height/P));cv.width=W;cv.height=H;
    etoiles=Array.from({length:Math.round(W*H/90)},()=>({x:rint(W,rnd),y:rint(Math.round(H*.6),rnd),p:rnd()*6,g:rnd()<.08}));
    lucioles=Array.from({length:Math.max(6,Math.round(W/16))},()=>({x:rnd()*W,y:H*.6+rnd()*H*.35,p:rnd()*6,v:.02+rnd()*.04}));
    monts1=[];let y=H*.5;for(let x=0;x<W;x++){y+=(rnd()-.5)*1.6;y=Math.max(H*.32,Math.min(H*.62,y));monts1.push(Math.round(y));}
    monts2=[];y=H*.7;for(let x=0;x<W;x++){y+=(rnd()-.5)*1.1;y=Math.max(H*.6,Math.min(H*.8,y));monts2.push(Math.round(y));}
    arbres=[];for(let x=2;x<W;x+=3+rint(5,rnd))arbres.push({x,h:4+rint(6,rnd)});}
  function px(x,y,c){cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),1,1);}
  function dessin(t){
    const jour=document.documentElement.classList.contains("jour");
    const ciel=jour?["#3f6fb5","#5d86c2","#88aedd","#c3dcf3","#f2d9b8"]:["#0b0d24","#12163a","#1c2153","#2e2a66","#4a3a7a"];
    const bande=Math.ceil(H*.75/ciel.length);
    for(let i=0;i<ciel.length;i++){cx.fillStyle=ciel[i];cx.fillRect(0,i*bande,W,bande+1);if(i<ciel.length-1){cx.fillStyle=ciel[i+1];for(let x=(i%2);x<W;x+=2)cx.fillRect(x,(i+1)*bande-1,1,1);}}
    cx.fillStyle=ciel[ciel.length-1];cx.fillRect(0,ciel.length*bande,W,H);
    if(!jour){for(const e of etoiles){const a=(Math.sin(t/700+e.p)+1)/2;if(a>.3){px(e.x,e.y,a>.8?"#ffffff":"#aab5dd");if(e.g&&a>.6){px(e.x-1,e.y,"#8fa3d8");px(e.x+1,e.y,"#8fa3d8");px(e.x,e.y-1,"#8fa3d8");px(e.x,e.y+1,"#8fa3d8");}}}}
    // astre : croissant la nuit, soleil pâle le jour
    const ax=Math.round(W*.82),ay=Math.round(H*.2),R=Math.max(4,Math.round(H*.09));
    for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){if(dx*dx+dy*dy<=R*R){if(jour)px(ax+dx,ay+dy,"#fff3c4");else{const ex=dx+Math.round(R*.55),ey=dy-Math.round(R*.25);if(ex*ex+ey*ey>R*R*.8)px(ax+dx,ay+dy,(dx+dy)%5===0?"#cfe0ff":"#eef3ff");}}}
    // montagnes lointaines
    for(let x=0;x<W;x++){cx.fillStyle=jour?"#6a86b8":"#2a2f6e";cx.fillRect(x,monts1[x],1,H-monts1[x]);if(!jour&&monts1[x]<H*.4)px(x,monts1[x],"#8fa3d8");}
    // tour elfique (silhouette originale)
    const tx=Math.max(6,Math.round(W*.1)),base=monts2[Math.min(W-1,tx)]||H*.7,th=Math.round(H*.5);
    cx.fillStyle=jour?"#3d4f80":"#2e3577";cx.fillRect(tx-2,base-th,5,th);cx.fillRect(tx-3,base-Math.round(th*.45),7,2);
    for(let i=0;i<6;i++)cx.fillRect(tx-Math.max(0,2-Math.floor(i/2)),base-th-i,1+2*Math.max(0,2-Math.floor(i/2)),1);
    px(tx,base-th-7,jour?"#3d4f80":"#cfe0ff");
    const lum=jour?"#8aa0c8":((Math.sin(t/900)+1)/2>.2?"#e8b84a":"#b8862b");px(tx,base-Math.round(th*.7),lum);px(tx,base-Math.round(th*.55),lum);px(tx+1,base-Math.round(th*.3),lum);
    // collines proches et forêt
    for(let x=0;x<W;x++){cx.fillStyle=jour?"#2f5a4a":"#141838";cx.fillRect(x,monts2[x],1,H-monts2[x]);}
    for(const a of arbres){const by=monts2[Math.min(W-1,a.x)];cx.fillStyle=jour?"#244a3b":"#0e1130";for(let i=0;i<a.h;i++){const w=Math.floor(i/2);cx.fillRect(a.x-w,by-a.h+i,1+2*w,1);}}
    // lac au pied de la tour
    cx.fillStyle=jour?"#4d79b0":"#1c2153";cx.fillRect(0,H-3,W,3);for(let x=(Math.floor(t/400)%3);x<W;x+=6)px(x,H-2,jour?"#a9cdf0":"#3b4290");
    // lucioles
    for(const l of lucioles){const a=(Math.sin(t/500+l.p)+1)/2;if(a>.4)px(l.x,l.y,jour?"#fff6dc":(a>.8?"#f8dc8a":"#e8b84a"));if(!reduit){l.x+=Math.sin(t/1500+l.p)*.08;l.y+=Math.cos(t/1700+l.p)*.05;}}
  }
  init();let actif=true,der=0;
  const boucle=t=>{if(!actif||!cv.isConnected)return;if(t-der>110){dessin(t);der=t;}requestAnimationFrame(boucle);};
  const ro=new ResizeObserver(()=>{init();dessin(performance.now());});ro.observe(conteneur);
  if(reduit)dessin(0);else requestAnimationFrame(boucle);
  paysageStop=()=>{actif=false;ro.disconnect();};
}

/* ========== Accueil ========== */
function vAccueil(main){
  const k=cleJour(),fait=S.rituel[k],n=serieActuelle(),r=rang();
  const scene=el("div",{class:"paysage"},el("div",{class:"titre-scene"},el("h1",{},"La Guilde des SES"),el("p",{},"Réviser le CAPES externe de sciences économiques et sociales")));
  main.append(scene);paysage(scene);
  const auj=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
  main.append(el("div",{class:"grille2"},
    el("section",{class:"cadre pile"},el("span",{class:"oeil"},"Bienvenue à la guilde"),el("h2",{},"Apprendre en jouant, et savoir ce que l'on apprend"),
      el("p",{},"Chaque jeu entraîne un type de connaissance précis (auteurs, notions, dates, mécanismes, chiffres, calculs) et indique l'épreuve à laquelle il prépare. Chaque réponse renvoie à sa source et au chapitre du programme officiel."),
      el("p",{class:"petit doux"},`${fr(TOUT.length)} fiches, dont ${fr(nbSourcees)} à source vérifiée. Programmes de SES de seconde, première et terminale, histoire de la pensée et épistémologie.`)),
    carteAventurier()));
  // Ce que vous révisez, et où
  const tab=el("section",{class:"pile"},el("div",{class:"cadre pile"},el("span",{class:"oeil"},"Le tableau des quêtes"),el("h2",{},"Ce que vous révisez, et où"),el("p",{},"Choisissez d'abord ce que vous voulez travailler : chaque panneau indique à quoi cela sert le jour du concours, puis les jeux qui l'entraînent."),el("p",{class:"petit"},lienExt(OFF.jury.u,"Rapport du jury 2026 ↗")," · ",lienExt(OFF.bac3.u,"Épreuves bac + 3 ↗")," · ",lienExt(OFF.bac5.u,"Épreuves bac + 5 ↗"))));
  const grille=el("div",{class:"tableau"});
  for(const s of ORDRE_SAVOIRS){const S_=SAVOIRS[s];const nb=S_.type?DB[S_.type].length:null;
    grille.append(el("section",{class:"cadre savoir"},el("div",{class:"tete"},sprite(S_.icone,36),el("div",{},el("h3",{},S_.l),el("span",{class:"pix petit doux"},nb!=null?`${fr(nb)} fiches`:s==="redaction"?`${fr(SUJETS.length)} sujets, correction selon le jury`:"exercices générés à volonté"))),
      el("p",{class:"usage"},el("b",{},"Utile pour : "),S_.usage),
      el("div",{class:"liens-jeux"},PLAN[s].map(([h])=>{const L=libJeu(h);return el("a",{class:"lien-jeu",href:"#"+h},sprite(L.icone,22),el("div",{},el("b",{},L.nom),L.mode?el("span",{},` · ${L.mode}`):null),el("span",{class:"fl"},"›"));}))));}
  tab.append(grille);main.append(tab);
  // Carte du programme
  const carte=el("section",{class:"pile"},el("div",{class:"cadre pile"},el("span",{class:"oeil"},"La carte du programme"),el("h2",{},"Réviser chapitre par chapitre"),el("p",{},"Chaque chapitre ouvre sa propre page : la question du programme officiel, les fiches qu'il contient et les jeux pour le réviser.")));
  const cp=el("div",{class:"carte-prog"});
  for(const nv of ["2","1","T","HP"]){const ul=el("ul");Object.entries(CHAP).filter(([c])=>NIV(c)===nv).forEach(([c,ch])=>{const it=TOUT.filter(x=>x.chap.includes(c));const cnt=["auteur","notion","date","meca","chiffre"].map(t=>[t,it.filter(x=>x.type===t).length]).filter(([,n])=>n);const d=it.length?Object.entries(it.reduce((a,x)=>(a[x.disc]=(a[x.disc]||0)+1,a),{})).sort((a,b)=>b[1]-a[1])[0][0]:"eco";
      ul.append(el("li",{},el("a",{href:"#"+chapHash(c),class:"d-"+d},el("b",{},ch.court),el("small",{},cnt.map(([t,n])=>`${n} ${({auteur:"auteur",notion:"notion",date:"date",meca:"mécanisme",chiffre:"chiffre"})[t]}${n>1?"s":""}`).join(" · ")))));});
    cp.append(el("section",{class:"cadre region pile"},el("h3",{},sprite(nv==="HP"?"tour":"carte",26),NIVL[nv]),ul,lienExt(PROG[nv].u,el("span",{class:"petit"},PROG[nv].l+" ↗"))));}
  carte.append(cp);main.append(carte);
  // Compétences
  const comp=el("section",{class:"cadre pile"},el("span",{class:"oeil"},"Compétences"),el("h2",{},"Votre progression"),el("p",{class:"petit doux"},"Une fiche est maîtrisée après trois bonnes réponses d'affilée. La progression est gardée dans ce navigateur seulement."));
  const ligne=(lab,it,d)=>{const ok=it.filter(x=>boite(x.id)>=3).length;return el("div",{class:"comp"+(d?" d-"+d:"")},el("span",{},lab),el("span",{class:"j"},el("i",{style:`width:${it.length?100*ok/it.length:0}%`})),el("span",{class:"n"},`${ok}/${it.length}`));};
  comp.append(el("div",{class:"grille2"},el("div",{class:"competences"},el("span",{class:"oeil"},"Par discipline"),Object.entries(DISC).map(([d,l])=>ligne(l,TOUT.filter(x=>x.disc===d),d))),el("div",{class:"competences"},el("span",{class:"oeil"},"Par type de savoir"),["auteurs","notions","dates","mecas","chiffres"].map(t=>ligne(SAVOIRS[t].l.split(",")[0].split(" et ")[0],DB[t])))));
  main.append(comp);
  main.append(blocConcours());
}
function blocConcours(){
  const t=rows=>el("div",{class:"defile"},el("table",{},el("thead",{},el("tr",{},el("th",{},"Épreuve"),el("th",{},"Contenu"),el("th",{},"Coef."))),el("tbody",{},rows.map(r=>el("tr",{},r.map(c=>el("td",{},c)))))));
  return el("section",{class:"cadre pile epreuves"},el("span",{class:"oeil"},"Le concours en bref"),el("h2",{},"Les épreuves"),el("p",{},"Les deux voies coexistent jusqu'à la session 2027. Les écrits et le premier oral portent sur les programmes de SES de seconde et du cycle terminal."),
    el("div",{class:"grille2"},
      el("div",{class:"pile"},el("h3",{},"CAPES bac + 3"),el("p",{class:"petit doux"},"Domaine majeur choisi à l'inscription (science économique, ou sociologie et science politique) ; l'autre est le domaine mineur."),
        t([["Écrit 1","5 h : dissertation sur le majeur (14 pts) ; question sur un concept, un mécanisme ou un processus du mineur (6 pts)","3"],["Écrit 2","4 h : question sur un dossier de six documents, majeur (13 pts) ; deux questions sur un document statistique, mineur (7 pts)","2"],["Oral 1","2 h de préparation, 1 h : exposé sur deux documents (majeur, 14 pts), puis questions sans préparation (mineur, 6 pts)","5"],["Oral 2","Entretien de 35 min : motivation, valeurs de la République, mise en situation","3"]]),lienExt(OFF.bac3.u,el("span",{class:"petit"},"Texte officiel ↗"))),
      el("div",{class:"pile"},el("h3",{},"CAPES bac + 5"),el("p",{class:"petit doux"},"Dernière session en 2027."),
        t([["Écrit 1","6 h : dissertation (12 pts) ; deux questions dans l'autre champ, dont une d'histoire de la pensée ou d'épistémologie (8 pts)","2"],["Écrit 2","5 h : séquence pédagogique à partir d'un dossier","2"],["Leçon","3 h de préparation, 1 h 15 : exposé, entretien, exercice sur données quantitatives","5"],["Entretien","35 min : parcours et mises en situation professionnelles","3"]]),lienExt(OFF.bac5.u,el("span",{class:"petit"},"Texte officiel ↗")))),
    el("p",{class:"petit"},lienExt(OFF.programme2027.u,"Programme de la session 2027 ↗")," · ",lienExt(OFF.jury.u,"Rapport du jury 2026 ↗")," · ",el("a",{href:"#archives"},"Toutes les sources")));
}

/* ========== Page d'un chapitre ========== */
function vChapitre(main,c){
  const ch=CHAP[c],nv=NIV(c);const it=TOUT.filter(x=>x.chap.includes(c));
  const par=t=>it.filter(x=>x.type===t);
  const types=[["auteur","auteurs"],["notion","notions"],["date","dates"],["meca","mecas"],["chiffre","chiffres"]].filter(([t])=>par(t).length);
  main.append(el("section",{class:"cadre pile"},el("span",{class:"oeil"},`Carte du programme · ${NIVL[nv]}`),el("h1",{},ch.court),el("p",{},el("b",{},nv==="HP"?"Attendus du concours : ":"Question du programme officiel : "),`« ${ch.t} »`),lienExt(PROG[nv].u,el("span",{class:"petit"},PROG[nv].l+" ↗"))));
  const jeuxPour={auteurs:["paires-auteurs","sceaux","faussaire","enigme","bibliotheque-courants","chronique-oeuvres"],notions:["grille-notions","paires-notions","bibliotheque-disciplines"],dates:["chronique-evenements","duel","paires-dates"],mecas:["forge"],chiffres:["balance-valeurs"]};
  const go=h=>{const b=el("a",{class:"lien-jeu",href:"#"+h},sprite(libJeu(h).icone,22),el("div",{},el("b",{},libJeu(h).nom),libJeu(h).mode?el("span",{},` · ${libJeu(h).mode}`):null),el("span",{class:"fl"},"›"));b.addEventListener("click",()=>{F.chap=c;F.niv.add(nv);sauverFiltres();});return b;};
  main.append(el("section",{class:"cadre pile"},el("h2",{},"Réviser ce chapitre"),el("p",{class:"petit doux"},"Ces liens limitent le jeu à ce chapitre. Le périmètre reste modifiable dans chaque jeu."),
    el("div",{class:"tableau"},types.map(([t,s])=>el("div",{class:"pile"},el("h3",{class:"rangee"},sprite(SAVOIRS[s].icone,24),`${SAVOIRS[s].l} (${par(t).length})`),el("div",{class:"liens-jeux"},jeuxPour[s].map(go)))))));
  for(const[t,s]of types){const det=el("details",{class:"cadre"},el("summary",{style:"cursor:pointer;font-family:var(--f-titre);font-weight:700"},`${SAVOIRS[s].l} de ce chapitre (${par(t).length})`));det.addEventListener("toggle",()=>{if(det.open&&det.children.length===1)det.append(el("div",{class:"liste-fiches",style:"margin-top:10px"},par(t).sort((a,b)=>titreFiche(a).localeCompare(titreFiche(b),"fr")).map(x=>ficheEl(x))));});main.append(det);}
}

/* ========== Quête du jour ========== */
function genQuete(k){const r=mulberry32(Number(k.replace(/-/g,"")));const A=DB.auteurs,chrono=A.filter(x=>!estNobel(x)).concat(DB.dates);
  return[qAuteur(r,A),qNotion(r,DB.notions),qDate(r,DB.dates),DB.chiffres.length?qChiffre(r,DB.chiffres):qAuteur(r,A),qFaussaire(r,A.filter(x=>!estNobel(x))),qDuel(r,chrono,60),qMeca(r,DB.mecas)];}
function vQuete(main){
  const k=cleJour();const qs=genQuete(k);let i=0,score=0;const deja=S.rituel[k];
  main.append(entete("quete",null,false));
  if(deja)main.append(el("p",{class:"avis"},`Quête déjà accomplie aujourd'hui (${deja.score} / ${deja.total}). Vous pouvez la refaire ; seul le premier passage compte pour la série.`));
  const pas=el("div",{class:"pastilles","aria-label":"Avancement"}),zone=el("div",{class:"pile"}),bas=el("div",{class:"rangee"});
  main.append(el("section",{class:"cadre pile"},pas,zone,bas));
  const dessinePas=()=>pas.replaceChildren(...qs.map((q,n)=>sprite(n<i?"gemme":"gemme0",n===i?26:20)));
  const suivant=()=>{if(i>=qs.length){fin();return;}dessinePas();bas.replaceChildren();rendreQCM(zone,qs[i],ok=>{if(ok)score++;i++;const b=el("button",{class:"btn or"},i<qs.length?"Épreuve suivante":"Voir le butin");b.onclick=suivant;bas.replaceChildren(b);b.focus({preventScroll:true});});};
  const fin=()=>{dessinePas();if(!deja){S.rituel[k]={score,total:qs.length};S.serie={last:k,n:S.serie.last===veille(k)?S.serie.n+1:(S.serie.last===k?S.serie.n:1)};sauver();majHud();}emit("quete",{score,total:qs.length,premier:!deja});reagir(score>=5);
    zone.replaceChildren(el("h2",{},`${score} / ${qs.length}`),el("p",{},score===qs.length?"Quête accomplie sans faute.":score>=5?"Belle quête.":"Les fiches ci-dessous méritent un second passage."),el("p",{class:"pix"},`Série : ${serieActuelle()} jour${serieActuelle()>1?"s":""} d'affilée. Nouvelle quête demain.`),el("div",{class:"liste-fiches"},qs.flatMap(q=>q.fiches).filter((x,n,a)=>a.indexOf(x)===n).map(x=>ficheEl(x))));
    bas.replaceChildren(el("a",{class:"btn",href:"#accueil"},"Retour à la guilde"));};
  suivant();
}

/* ========== Paires de runes ========== */
function vPaires(main,mode){
  const builds={
    auteurs:()=>{const{items,elargi}=reserve(["auteurs"],8);const vus=new Set();const s=tirer(items,12,{cle:court}).filter(x=>{if(vus.has(x.concept))return false;vus.add(x.concept);return true;}).slice(0,6);return{elargi,deux:false,paires:s.map(x=>({x,a:["Auteur",court(x)],b:["Notion clé",x.concept]}))};},
    oeuvres:()=>{const{items,elargi}=reserve(["auteurs"],8);const s=tirer(items.filter(x=>!estNobel(x)&&x.oeuvre.length<=64),6,{cle:x=>x.annee});return{elargi,deux:true,paires:s.map(x=>({x,a:["Œuvre",x.oeuvre],b:["Année",x.anneeAff||String(x.annee)]}))};},
    notions:()=>{const{items,elargi}=reserve(["notions"],6);const s=tirer(items.filter(x=>x.def.length<=150),5,{cle:x=>x.terme});return{elargi,deux:true,paires:s.map(x=>({x,a:["Notion",x.terme],b:["Définition",x.def]}))};},
    dates:()=>{const{items,elargi}=reserve(["dates"],8);const s=tirer(items,6,{cle:x=>x.annee});return{elargi,deux:false,paires:s.map(x=>({x,a:["Événement",x.evenement],b:["Année",String(x.annee)]}))};},
  };
  main.append(entete("paires",mode));const pf=panneauFiltres(()=>{majPerimetreEntete();partie();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function partie(){
    const{elargi,deux,paires}=builds[mode]();const cartes=melange(paires.flatMap((p,i)=>[{i,c:p.a},{i,c:p.b}]));
    let ouvertes=[],trouves=0,essais=0,verrou=false;
    const etat=el("p",{class:"score"},"Essais : ",el("b",{},"0"));const pl=el("div",{class:"plateau"+(deux?" deux":"")});const trouvees=el("div",{class:"liste-fiches"});const fin=el("div",{class:"rangee"});
    cartes.forEach(c=>{const b=el("button",{class:"carte",type:"button","aria-label":"Carte retournée"},el("span",{class:"dedans"},el("span",{class:"dos"},sprite("gemme",30)),el("span",{class:"face"},el("small",{},c.c[0]),el("span",{},c.c[1]))));
      b.onclick=()=>{if(verrou||b.classList.contains("visible"))return;b.classList.add("visible");b.setAttribute("aria-label",`${c.c[0]} : ${c.c[1]}`);ouvertes.push({b,c});
        if(ouvertes.length===2){essais++;etat.lastChild.textContent=essais;const[x,y]=ouvertes;
          if(x.c.i===y.c.i){[x,y].forEach(o=>{o.b.classList.add("trouvee");o.b.disabled=true;});trouves++;ouvertes=[];const p=paires[x.c.i];noter(p.x.id,true);trouvees.prepend(ficheEl(p.x,"juste"));annonce("Paire trouvée");reagir(true,{leger:true});
            if(trouves===paires.length){etat.replaceChildren(`Toutes les paires réunies en ${essais} essais.`);emit("partie",{jeu:"paires",mode,score:paires.length,total:paires.length});setTimeout(()=>reagir(true),600);const nb=el("button",{class:"btn or"},"Nouvelle partie");nb.onclick=partie;fin.replaceChildren(nb);}}
          else{verrou=true;[x,y].forEach(o=>o.b.classList.add("rate"));setTimeout(()=>{[x,y].forEach(o=>{o.b.classList.remove("visible","rate");o.b.setAttribute("aria-label","Carte retournée");});ouvertes=[];verrou=false;},1100);}}};
      pl.append(b);});
    const re=el("button",{class:"btn"},"Redistribuer");re.onclick=partie;
    zone.replaceChildren(avisElargi(elargi),el("div",{class:"rangee",style:"justify-content:space-between"},etat,re),pl,fin,el("h3",{},"Paires réunies"),trouvees);
  }
  partie();
}

/* ========== Les Trois Sceaux ========== */
let roSceaux=null;
function vSceaux(main){
  main.append(entete("sceaux"));const pf=panneauFiltres(()=>{majPerimetreEntete();partie();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function partie(){
    if(roSceaux)roSceaux.disconnect();
    const{items,elargi}=reserve(["auteurs"],7);const vusC=new Set(),vusA=new Set();
    const sel=tirer(items.filter(x=>!estNobel(x)),30,{cle:court}).filter(x=>{if(vusC.has(x.concept)||vusA.has(x.annee))return false;vusC.add(x.concept);vusA.add(x.annee);return true;}).slice(0,5);
    const A=melange(sel),B=melange(sel),C=melange(sel);let lAB=new Map(),lBC=new Map(),choisi=null,verifie=false;
    const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("class","fils");
    const box=el("div",{class:"sceaux"});
    const cols=[["Auteur",A,x=>court(x)],["Notion clé",B,x=>x.concept],["Année",C,x=>x.anneeAff||String(x.annee)]].map(([t,L,f],ci)=>el("div",{class:"col"},el("h4",{},t),L.map((x,i)=>{const b=el("button",{class:"noeud",type:"button"},f(x));b.onclick=()=>clic(ci,i);return b;})));
    box.append(svg,...cols);const nd=(c,i)=>cols[c].children[i+1];
    const btnV=el("button",{class:"btn or",disabled:true},"Vérifier les sceaux");const btnN=el("button",{class:"btn"},"Nouveaux coffres");btnN.onclick=partie;const res=el("div",{class:"pile"});
    function clic(c,i){if(verifie)return;
      if(choisi&&Math.abs(choisi.c-c)===1){const[a,b]=choisi.c<c?[choisi,{c,i}]:[{c,i},choisi];const m=a.c===0?lAB:lBC;for(const[k,v]of[...m])if(k===a.i||v===b.i)m.delete(k);m.set(a.i,b.i);nd(choisi.c,choisi.i).classList.remove("choisi");choisi=null;dessine();return;}
      if(choisi)nd(choisi.c,choisi.i).classList.remove("choisi");if(choisi&&choisi.c===c&&choisi.i===i){choisi=null;return;}choisi={c,i};nd(c,i).classList.add("choisi");}
    function dessine(res){svg.replaceChildren();const bb=box.getBoundingClientRect();const pt=(c,i,d)=>{const r=nd(c,i).getBoundingClientRect();return[d?r.right-bb.left:r.left-bb.left,r.top+r.height/2-bb.top];};
      for(const[m,c0]of[[lAB,0],[lBC,1]])for(const[a,b]of m){const[x1,y1]=pt(c0,a,1),[x2,y2]=pt(c0+1,b,0);const ln=document.createElementNS("http://www.w3.org/2000/svg","line");ln.setAttribute("x1",x1);ln.setAttribute("y1",y1);ln.setAttribute("x2",x2);ln.setAttribute("y2",y2);if(res){const L=c0===0?[A,B]:[B,C];ln.setAttribute("class",L[0][a]===L[1][b]?"juste":"faux");}svg.append(ln);}
      btnV.disabled=!(lAB.size===5&&lBC.size===5)||verifie;}
    btnV.onclick=()=>{verifie=true;dessine(true);let n=0;const fiches=[];sel.forEach(x=>{const a=A.indexOf(x),b=B.indexOf(x),c=C.indexOf(x);const ok=lAB.get(a)===b&&lBC.get(b)===c;if(ok)n++;noter(x.id,ok);fiches.push(ficheEl(x,ok?"juste":"faux"));nd(0,a).classList.add(ok?"juste":"faux");});btnV.disabled=true;emit("partie",{jeu:"sceaux",score:n,total:5});res.replaceChildren(retourEl(n===5,`${n} coffre${n>1?"s":""} sur 5 correctement scellé${n>1?"s":""}.`,fiches));};
    zone.replaceChildren(avisElargi(elargi),box,el("div",{class:"rangee"},btnV,btnN),res);
    requestAnimationFrame(()=>dessine());roSceaux=new ResizeObserver(()=>dessine(verifie));roSceaux.observe(box);
  }
  partie();
}

/* ========== Bibliothèque ========== */
const periode=a=>a<1850?"Avant 1850":a<1914?"1850 – 1913":a<1946?"1914 – 1945":a<1980?"1946 – 1979":"Depuis 1980";
function vBiblio(main,mode){
  const C={
    disciplines:()=>{const{items,elargi}=reserve(["auteurs","notions"],10);const s=tirer(items,8,{cle:x=>x.id});const pres=Object.keys(DISC).filter(k=>s.some(x=>x.disc===k));return{elargi,cartes:s,rayons:pres.map(k=>({k,l:DISC[k]})),bon:x=>[x.disc],lab:x=>x.type==="auteur"?[court(x),x.concept]:[x.terme,"notion"]};},
    courants:()=>{const{items,elargi}=reserve(["auteurs"],10);const par={};items.forEach(x=>{if(x.courant)(par[x.courant]=par[x.courant]||[]).push(x);});const cs=melange(Object.keys(par).filter(k=>new Set(par[k].map(court)).size>=3)).slice(0,3);let s=[];cs.forEach(c=>s.push(...tirer(par[c],3,{cle:court})));s=melange(s).slice(0,8);return{elargi,cartes:s,rayons:cs.map(k=>({k,l:k})),bon:x=>[x.courant],lab:x=>[court(x),`${x.concept} (${x.annee})`]};},
    periodes:()=>{const{items,elargi}=reserve(["auteurs","dates"],10);const s=tirer(items.filter(x=>!estNobel(x)),8,{cle:x=>x.id});const ord=["Avant 1850","1850 – 1913","1914 – 1945","1946 – 1979","Depuis 1980"].filter(p=>s.some(x=>periode(x.annee)===p));return{elargi,cartes:s,rayons:ord.map(k=>({k,l:k})),bon:x=>[periode(x.annee)],lab:x=>x.type==="date"?[x.evenement,"événement"]:[`« ${x.oeuvre} »`,court(x)]};},
    niveaux:()=>{const{items,elargi}=reserve(["notions","auteurs"],10);const s=tirer(items.filter(x=>x.niv.some(n=>n!=="HP")),8,{cle:x=>x.id});return{elargi,cartes:s,rayons:["2","1","T"].map(k=>({k,l:NIVL[k]})),bon:x=>x.niv,lab:x=>x.type==="auteur"?[court(x),x.concept]:[x.terme,"notion"]};},
  };
  main.append(entete("bibliotheque",mode));const pf=panneauFiltres(()=>{majPerimetreEntete();partie();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function partie(){
    const g=C[mode]();const place=new Map();let choisi=null,fini=false;
    const res=el("div",{class:"pile"}),pile=el("div",{class:"reserve"}),et=el("div",{class:"etageres"});const jet=new Map();
    g.cartes.forEach(x=>{const[t,s]=g.lab(x);const b=el("button",{class:`jeton d-${x.disc}`,type:"button"},t,el("small",{},s));b.onclick=()=>{if(fini)return;if(choisi&&choisi!==x&&place.has(x)){place.set(choisi,place.get(x));choisi=null;dessine();return;}if(place.has(x)){place.delete(x);dessine();return;}choisi=choisi===x?null:x;dessine();};jet.set(x,b);});
    const ray=g.rayons.map(R=>{const z=el("div",{class:"etagere",role:"button",tabindex:"0","aria-label":"Rayonnage "+R.l},el("h4",{},R.l));const dep=e=>{if(fini||!choisi)return;if(e&&e.target.closest(".jeton"))return;place.set(choisi,R.k);choisi=null;dessine();};z.onclick=dep;z.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();dep();}};return{R,z};});
    et.append(...ray.map(o=>o.z));
    const bV=el("button",{class:"btn or",disabled:true},"Vérifier le rangement"),bN=el("button",{class:"btn"},"Autres ouvrages");bN.onclick=partie;
    function dessine(){pile.replaceChildren();ray.forEach(o=>{o.z.replaceChildren(o.z.firstChild);o.z.classList.toggle("cible",!!choisi);});g.cartes.forEach(x=>{const b=jet.get(x);b.style.boxShadow=choisi===x?"0 0 0 3px var(--mana)":"";if(place.has(x))ray.find(o=>o.R.k===place.get(x)).z.append(b);else pile.append(b);});if(!pile.children.length&&!fini)pile.append(el("p",{class:"petit doux"},"Pile vide : vous pouvez vérifier."));bV.disabled=place.size!==g.cartes.length||fini;}
    bV.onclick=()=>{fini=true;let n=0;const fiches=[];g.cartes.forEach(x=>{const ok=g.bon(x).includes(place.get(x));if(ok)n++;noter(x.id,ok);const b=jet.get(x);b.classList.add(ok?"juste":"faux");if(!ok)b.append(el("small",{},"→ "+g.bon(x).map(k=>(g.rayons.find(R=>R.k===k)||{l:NIVL[k]||k}).l).join(" ou ")));fiches.push(ficheEl(x,ok?"juste":"faux"));});bV.disabled=true;ray.forEach(o=>o.z.classList.remove("cible"));emit("partie",{jeu:"bibliotheque",mode,score:n,total:g.cartes.length});res.replaceChildren(retourEl(n===g.cartes.length,`${n} ouvrage${n>1?"s":""} bien rangé${n>1?"s":""} sur ${g.cartes.length}.`,fiches));};
    zone.replaceChildren(avisElargi(g.elargi),el("span",{class:"oeil"},"Pile d'ouvrages"),pile,el("span",{class:"oeil"},"Rayonnages"),et,el("div",{class:"rangee"},bV,bN),res);dessine();
  }
  partie();
}

/* ========== Grille du Scribe ========== */
function genGrille(mots,r=R0,cible=11){
  const N=19,G=Array.from({length:N},()=>Array(N).fill(null)),D=Array.from({length:N},()=>Array(N).fill(0));const places=[];
  const peut=(w,rr,cc,dir)=>{const dr=dir?1:0,dc=dir?0:1;let inter=0;const er=rr-dr,ec=cc-dc,fr_=rr+dr*w.length,fc=cc+dc*w.length;if(rr<0||cc<0||fr_-dr>=N||fc-dc>=N)return -1;if(er>=0&&ec>=0&&G[er][ec])return -1;if(fr_<N&&fc<N&&G[fr_][fc])return -1;for(let k=0;k<w.length;k++){const r_=rr+dr*k,c_=cc+dc*k;const v=G[r_][c_];if(v){if(v!==w[k]||(D[r_][c_]&(dir?2:1)))return -1;inter++;}else{const a1=dir?[r_,c_-1]:[r_-1,c_],a2=dir?[r_,c_+1]:[r_+1,c_];if(a1[0]>=0&&a1[1]>=0&&G[a1[0]][a1[1]])return -1;if(a2[0]<N&&a2[1]<N&&G[a2[0]][a2[1]])return -1;}}return inter;};
  const pose=(m,rr,cc,dir)=>{for(let k=0;k<m.w.length;k++){G[rr+(dir?k:0)][cc+(dir?0:k)]=m.w[k];D[rr+(dir?k:0)][cc+(dir?0:k)]|=(dir?2:1);}places.push({m,r:rr,c:cc,dir});};
  const L=melange(mots,r).sort((a,b)=>b.w.length-a.w.length);const premier=L.find(m=>m.w.length<=13);if(!premier)return null;pose(premier,9,Math.floor((N-premier.w.length)/2),0);
  for(const m of L){if(places.length>=cible)break;if(places.some(p=>p.m===m))continue;let best=null;for(const p of places)for(let a=0;a<p.m.w.length;a++)for(let b=0;b<m.w.length;b++){if(p.m.w[a]!==m.w[b])continue;const dir=p.dir?0:1;const rr=p.dir?p.r+a:p.r-b,cc=p.dir?p.c-b:p.c+a;const s=peut(m.w,rr,cc,dir);if(s>0&&(!best||s+r()*.5>best.s))best={rr,cc,dir,s};}if(best)pose(m,best.rr,best.cc,best.dir);}
  let r0=N,r1=0,c0=N,c1=0;places.forEach(p=>{const e=p.dir?[p.r+p.m.w.length-1,p.c]:[p.r,p.c+p.m.w.length-1];r0=Math.min(r0,p.r);c0=Math.min(c0,p.c);r1=Math.max(r1,e[0]);c1=Math.max(c1,e[1]);});places.forEach(p=>{p.r-=r0;p.c-=c0;});
  const H=r1-r0+1,W=c1-c0+1,g=Array.from({length:H},(_,i)=>G[i+r0].slice(c0,c1+1));let num=0;for(let i=0;i<H;i++)for(let k=0;k<W;k++){const ps=places.filter(p=>p.r===i&&p.c===k);if(ps.length){num++;ps.forEach(p=>p.n=num);}}
  return{g,H,W,places};
}
function motsAuteurs(items){const vus=new Set();const out=[];for(const x of items){const nom=court(x);if(/\s|et al|'/.test(nom))continue;const w=sansAccent(nom).toUpperCase().replace(/[^A-Z]/g,"");if(w.length<4||w.length>13||vus.has(w))continue;vus.add(w);out.push({w,x,indice:`« ${x.oeuvre} » (${x.anneeAff||x.annee}) — ${x.concept}`,rep:nom});}return out;}
function vGrille(main,mode){
  main.append(entete("grille",mode));const pf=panneauFiltres(()=>{majPerimetreEntete();partie();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function partie(){
    let mots,elargi;
    if(mode==="auteurs"){const r=reserve(["auteurs"],14);elargi=r.elargi;mots=motsAuteurs(melange(r.items));}
    else{const r=reserve(["notions"],14);elargi=r.elargi;const vus=new Set();mots=r.items.filter(x=>x.mot&&x.mot.length>=3&&x.mot.length<=13).filter(x=>{if(vus.has(x.mot))return false;vus.add(x.mot);return true;}).map(x=>({w:x.mot,x,indice:x.def,rep:x.terme}));}
    mots.forEach(m=>m.id=m.x.id);
    let G=null;for(let t=0;t<8;t++){const g=genGrille(tirer(mots,Math.min(40,mots.length)),R0,11);if(g&&(!G||g.places.length>G.places.length))G=g;if(G&&G.places.length>=9)break;}
    if(!G){zone.replaceChildren(el("p",{},"Pas assez de mots dans ce périmètre."));return;}
    const larg=Math.min(zone.clientWidth||340,640);const c=Math.max(24,Math.min(38,Math.floor((larg-8)/G.W)-2));
    const grille=el("div",{class:"grille-mc",style:`--c:${c}px;grid-template-columns:repeat(${G.W},var(--c))`});const cells=[];let dir=0,actif=null;
    const couvre=(p,i,k)=>p.dir?(k===p.c&&i>=p.r&&i<p.r+p.m.w.length):(i===p.r&&k>=p.c&&k<p.c+p.m.w.length);const pos=(p,i,k)=>p.dir?i-p.r:k-p.c;const cel=(p,n)=>p.dir?[p.r+n,p.c]:[p.r,p.c+n];
    for(let i=0;i<G.H;i++){cells[i]=[];for(let k=0;k<G.W;k++){const v=G.g[i][k];if(!v){grille.append(el("div",{class:"case"}));cells[i][k]=null;continue;}
      const inp=el("input",{type:"text",autocomplete:"off",autocapitalize:"characters",spellcheck:"false","aria-label":`Case ligne ${i+1}, colonne ${k+1}`});const d=el("div",{class:"case"},inp);const p=G.places.find(p=>p.r===i&&p.c===k);if(p)d.append(el("span",{class:"num"},p.n));cells[i][k]={d,inp,v};grille.append(d);
      inp.addEventListener("focus",()=>{try{inp.select();}catch(e){}const ps=G.places.filter(p=>couvre(p,i,k));if(!actif||!couvre(actif,i,k))actif=ps.find(p=>p.dir===dir)||ps[0];surligne();});
      inp.addEventListener("click",()=>{const ps=G.places.filter(p=>couvre(p,i,k));if(ps.length>1&&actif&&couvre(actif,i,k)){actif=ps.find(p=>p!==actif);dir=actif.dir;surligne();}});
      inp.addEventListener("input",()=>{const t=sansAccent(inp.value).toUpperCase().replace(/[^A-Z]/g,"");inp.value=t.slice(-1);d.classList.remove("ko");if(inp.value&&actif){const n=pos(actif,i,k);if(n<actif.m.w.length-1){const[a,b]=cel(actif,n+1);cells[a][b].inp.focus();}}controle();});
      inp.addEventListener("keydown",e=>{if(e.key==="Backspace"&&!inp.value&&actif){const n=pos(actif,i,k);if(n>0){const[a,b]=cel(actif,n-1);cells[a][b].inp.focus();e.preventDefault();}}});}}
    const lis=[];const resolus=new Set();const fin=el("div");
    function surligne(){cells.flat().forEach(o=>o&&o.d.classList.remove("mot-actif"));if(actif){for(let n=0;n<actif.m.w.length;n++){const[a,b]=cel(actif,n);cells[a][b].d.classList.add("mot-actif");}dir=actif.dir;}lis.forEach(o=>o.li.classList.toggle("actif",o.p===actif));}
    function controle(){G.places.forEach(p=>{if(resolus.has(p))return;for(let n=0;n<p.m.w.length;n++){const[a,b]=cel(p,n);if(cells[a][b].inp.value!==p.m.w[n])return;}resolus.add(p);noter(p.m.x.id,!p.revele);const o=lis.find(o=>o.p===p);o.li.classList.add("resolu");o.li.querySelector(".rep").replaceChildren(el("b",{}," — "+p.m.rep));o.li.append(sourcesEl(p.m.x));for(let n=0;n<p.m.w.length;n++){const[a,b]=cel(p,n);cells[a][b].d.classList.add("ok");}annonce("Mot trouvé : "+p.m.rep);emit("mot",{juste:!p.revele});reagir(true,{leger:true});if(resolus.size===G.places.length){fin.replaceChildren(el("p",{class:"verdict juste"},"Grille complète."));emit("partie",{jeu:"grille",mode});setTimeout(()=>reagir(true),500);}});}
    const ind=el("div",{class:"indices"});
    for(const[d,t]of[[0,"Horizontalement"],[1,"Verticalement"]]){const ol=el("ol");G.places.filter(p=>p.dir===d).sort((a,b)=>a.n-b.n).forEach(p=>{const li=el("li",{},el("b",{},p.n+". "),p.m.indice,el("span",{class:"doux petit"},` (${p.m.w.length})`),el("span",{class:"rep"}));li.onclick=e=>{if(e.target.closest("a"))return;actif=p;dir=p.dir;const[a,b]=cel(p,0);cells[a][b].inp.focus();surligne();};lis.push({p,li});ol.append(li);});if(ol.children.length)ind.append(el("div",{class:"pile"},el("h3",{},t),ol));}
    const bV=el("button",{class:"btn"},"Vérifier les cases");bV.onclick=()=>cells.flat().forEach(o=>{if(o&&o.inp.value&&o.inp.value!==o.v)o.d.classList.add("ko");});
    const bL=el("button",{class:"btn"},"Révéler une lettre");bL.onclick=()=>{const a=document.activeElement;const o=cells.flat().find(o=>o&&o.inp===a);if(o){o.inp.value=o.v;o.d.classList.remove("ko");controle();}else annonce("Touchez d'abord une case");};
    const bM=el("button",{class:"btn"},"Révéler le mot");bM.onclick=()=>{if(!actif)return;actif.revele=true;for(let n=0;n<actif.m.w.length;n++){const[a,b]=cel(actif,n);cells[a][b].inp.value=actif.m.w[n];}controle();};
    const bN=el("button",{class:"btn or"},"Nouvelle grille");bN.onclick=partie;
    zone.replaceChildren(avisElargi(elargi),el("div",{class:"mc"},el("div",{class:"pile"},grille,el("div",{class:"rangee"},bV,bL,bM,bN),fin),ind));
  }
  partie();
}

/* ========== Chronique ========== */
function vChronique(main,mode){
  main.append(entete("chronique",mode));const pf=panneauFiltres(()=>{majPerimetreEntete();partie();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function partie(){
    const types=mode==="oeuvres"?["auteurs"]:mode==="evenements"?["dates"]:["auteurs","dates"];const{items,elargi}=reserve(types,8);
    const s=tirer(items.filter(x=>!estNobel(x)),6,{cle:x=>x.annee});let ordre=melange(s);if(ordre.every((x,i)=>i===0||ordre[i-1].annee<x.annee))ordre.reverse();
    let fini=false;const ul=el("ol",{class:"frise"}),res=el("div",{class:"pile"});
    function dessine(){ul.replaceChildren(...ordre.map((x,i)=>{const up=el("button",{class:"btn mini","aria-label":"Monter",disabled:fini||i===0},"↑");up.onclick=()=>{[ordre[i-1],ordre[i]]=[ordre[i],ordre[i-1]];dessine();};const dn=el("button",{class:"btn mini","aria-label":"Descendre",disabled:fini||i===ordre.length-1},"↓");dn.onclick=()=>{[ordre[i+1],ordre[i]]=[ordre[i],ordre[i+1]];dessine();};
      const li=el("li",{class:`d-${x.disc}`},el("span",{class:"rang-f"},i+1),el("div",{},libChrono(x)),fini?el("span",{class:"an"},x.anneeAff||x.annee):el("div",{class:"fleches"},up,dn));if(fini)li.classList.add([...ordre].sort((a,b)=>a.annee-b.annee)[i]===x?"juste":"faux");return li;}));}
    const bV=el("button",{class:"btn or"},"Vérifier la chronique"),bN=el("button",{class:"btn"},"Nouvelles pages");bN.onclick=partie;
    bV.onclick=()=>{fini=true;bV.disabled=true;dessine();const tri=[...ordre].sort((a,b)=>a.annee-b.annee);let n=0;ordre.forEach((x,i)=>{const ok=tri[i]===x;if(ok)n++;noter(x.id,ok);});emit("partie",{jeu:"chronique",mode,score:n,total:ordre.length});res.replaceChildren(retourEl(n===ordre.length,`${n} page${n>1?"s":""} à ${n>1?"leur":"sa"} place sur ${ordre.length}.`,tri.map(x=>ficheEl(x))));};
    zone.replaceChildren(avisElargi(elargi),el("p",{class:"petit doux"},"Le plus ancien en haut."),ul,el("div",{class:"rangee"},bV,bN),res);dessine();
  }
  partie();
}

/* ========== Duel des Âges ========== */
function vDuel(main){
  let serie=0;const best=()=>S.best.eclipse||0;
  main.append(entete("duel"));const pf=panneauFiltres(()=>{majPerimetreEntete();manche();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function manche(){
    const{items,elargi}=reserve(["auteurs","dates"],6);const gap=Math.max(2,120-serie*14);const q=qDuel(R0,items.filter(x=>!estNobel(x)),gap);
    const sc=el("p",{class:"score"},"Victoires : ",el("b",{},serie),` · record : ${best()} · écart maximal : ${gap} ans`);
    const duel=el("div",{class:"duel"}),res=el("div",{class:"pile"}),bas=el("div",{class:"rangee"});
    const bt=q.fiches.map((x,i)=>{const b=el("button",{type:"button",class:`d-${x.disc}`},el("span",{class:"etiquette"},x.type==="date"?"Événement":"Œuvre"),el("span",{},libChrono(x)));b.onclick=()=>choix(i);return b;});
    duel.append(bt[0],el("span",{class:"ou"},sprite("epee",28)),bt[1]);
    function choix(i){const ok=i===q.bon;bt.forEach((b,k)=>{b.disabled=true;b.append(el("span",{class:"an"},q.annees[k]));if(k===q.bon)b.classList.add("juste");});if(!ok)bt[i].classList.add("faux","secousse");q.fiches.forEach(f=>noter(f.id,ok));
      if(ok){serie++;if(serie>best()){S.best.eclipse=serie;sauver();}}else serie=0;emit("partie",{jeu:"duel",score:ok?1:0,total:1,serie});sc.replaceChildren("Victoires : ",el("b",{},serie),` · record : ${best()}`);
      res.replaceChildren(retourEl(ok,ok?"Victoire.":"Défaite : l'autre était plus ancien.",q.fiches.map(f=>ficheEl(f))));const b=el("button",{class:"btn or"},ok?"Duel suivant":"Nouveau tournoi");b.onclick=manche;bas.replaceChildren(b);b.focus({preventScroll:true});}
    zone.replaceChildren(avisElargi(elargi),sc,el("p",{class:"question"},"Lequel est le plus ancien ?"),duel,bas,res);
  }
  manche();
}

/* ========== Forge des Mécanismes ========== */
function vForge(main){
  main.append(entete("forge"));const pf=panneauFiltres(()=>{majPerimetreEntete();partie();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function partie(){
    const{items,elargi}=reserve(["mecas"],1);const m=tirer(items,1)[0];let pris=[],fini=false;const mel=melange(m.etapes.map((t,i)=>({t,i})));if(mel.every((o,k)=>o.i===k))mel.reverse();
    const chaine=el("ol",{class:"chaine"}),reste=el("div",{class:"pile"}),res=el("div",{class:"pile"});
    const bV=el("button",{class:"btn or",disabled:true},"Vérifier la chaîne"),bN=el("button",{class:"btn"},"Autre mécanisme");bN.onclick=partie;
    function dessine(){chaine.replaceChildren(...pris.map((o,k)=>{const b=el("button",{class:"etape",type:"button",disabled:fini},el("span",{class:"n"},k+1),el("span",{},o.t));if(fini)b.classList.add(o.i===k?"juste":"faux");b.onclick=()=>{pris.splice(k,1);dessine();};return el("li",{},b);}));
      reste.replaceChildren(...mel.filter(o=>!pris.includes(o)).map(o=>{const b=el("button",{class:"etape",type:"button"},el("span",{class:"n"},"·"),el("span",{},o.t));b.onclick=()=>{pris.push(o);dessine();};return b;}));
      if(!pris.length)chaine.append(el("li",{class:"petit doux"},"Touchez la première étape ci-dessous."));bV.disabled=pris.length!==m.etapes.length||fini;}
    bV.onclick=()=>{fini=true;const n=pris.filter((o,k)=>o.i===k).length;const ok=n===m.etapes.length;noter(m.id,ok);emit("partie",{jeu:"forge",parfait:ok,score:n,total:m.etapes.length});dessine();res.replaceChildren(retourEl(ok,ok?"Chaîne parfaitement forgée.":`${n} maillon${n>1?"s":""} à ${n>1?"leur":"sa"} place sur ${m.etapes.length}.`,[ficheEl(m,ok?"juste":"faux")]));};
    zone.replaceChildren(avisElargi(elargi),el("h2",{},m.titre),el("div",{class:"tags"},el("span",{class:"etiquette"},`${NIVL[NIV(m.chap[0])]} · ${CHAP[m.chap[0]].court}`)),el("span",{class:"oeil"},"Votre chaîne"),chaine,el("span",{class:"oeil"},"Maillons à placer"),reste,el("div",{class:"rangee"},bV,bN),res);dessine();
  }
  partie();
}

/* ========== Le Faussaire ========== */
function vFaussaire(main){
  let pts=0,tours=0;main.append(entete("faussaire"));const pf=panneauFiltres(()=>{majPerimetreEntete();manche();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function manche(){
    const{items,elargi}=reserve(["auteurs","dates"],6);const x=tirer(items.filter(y=>!estNobel(y)),1)[0];const res=el("div",{class:"pile"}),bas=el("div",{class:"rangee"});
    const ligne=el("p",{class:"parchemin-faux"});const segs=[];let alt=null,vraie={};
    if(x.type==="auteur"){const pool=items.filter(y=>y.type==="auteur");const f=falsifier(x,R0,pool.length>12?pool:DB.auteurs);alt=f.alt;vraie={auteur:court(x),annee:x.anneeAff||String(x.annee),concept:x.concept};const s=k=>{const b=el("button",{class:"segment",type:"button"},f.seg[k]);b.onclick=()=>rep(k);segs.push([k,b]);return b;};
      ligne.append(el("span",{class:"ancre"},`« ${x.oeuvre} »`),", œuvre de ",s("auteur"),", publiée en ",s("annee"),", dont la notion clé est : ",s("concept"),".");}
    else{alt=R0()<.6?"annee":null;let an=x.annee;if(alt){let d=0;while(!d)d=(1+rint(15))*(R0()<.5?-1:1);an=x.annee+d;if(an>2026)an=x.annee-Math.abs(d);}vraie={annee:String(x.annee)};const b=el("button",{class:"segment",type:"button"},String(an));b.onclick=()=>rep("annee");segs.push(["annee",b]);ligne.append("En ",b," : ",el("span",{class:"ancre"},x.evenement),".");}
    const ex=el("button",{class:"btn"},"Le parchemin est authentique");ex.onclick=()=>rep(null);
    function rep(k){const ok=k===alt;tours++;if(ok)pts++;noter(x.id,ok);emit("partie",{jeu:"faussaire",score:ok?1:0,total:1});segs.forEach(([kk,b])=>{b.disabled=true;if(kk===alt){b.classList.add("faux");b.after(el("span",{class:"segment juste"},` ${vraie[kk]}`));}else if(kk===k)b.classList.add("secousse");});ex.disabled=true;
      const t=ok?(alt?"Démasqué : le faux est repéré.":"Juste : le parchemin était authentique."):(alt?`Non : le faussaire avait altéré ${({auteur:"l'auteur",annee:"l'année",concept:"la notion clé"})[alt]}.`:"Non : le parchemin était authentique.");
      res.replaceChildren(retourEl(ok,t,[ficheEl(x,ok?"juste":"faux")]));sc.replaceChildren("Score : ",el("b",{},pts),` / ${tours}`);const b=el("button",{class:"btn or"},"Parchemin suivant");b.onclick=manche;bas.replaceChildren(b);b.focus({preventScroll:true});}
    const sc=el("p",{class:"score"},"Score : ",el("b",{},pts),` / ${tours}`);
    zone.replaceChildren(avisElargi(elargi),sc,ligne,el("div",{class:"rangee"},ex),bas,res);
  }
  manche();
}

/* ========== L'Énigme de la Tour ========== */
function vEnigme(main){
  let total=0,tours=0;main.append(entete("enigme"));const pf=panneauFiltres(()=>{majPerimetreEntete();manche();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function manche(){
    const{items,elargi}=reserve(["auteurs"],10);const gr={};items.forEach(x=>{(gr[x.auteur]=gr[x.auteur]||[]).push(x);});const noms=Object.keys(gr);const nom=noms[rint(noms.length)];const fs=gr[nom];const x=fs[rint(fs.length)];
    const ini=nom.split(/,| et /)[0].trim().split(/\s+/).map(s=>s[0]+".").join(" ");
    const ind=[`Discipline : ${DISC[x.disc]}${x.courant?" ; courant ou école : "+x.courant:""}.`,`Une de ses œuvres de référence date des années ${Math.floor(x.annee/10)*10}.`,`Notion clé : ${x.concept}.`,`Œuvre : « ${x.oeuvre} ».`,`Initiales : ${ini}`];
    let vus=1,fini=false;const ul=el("ol",{class:"indices-enigme"});const dess=()=>ul.replaceChildren(...ind.map((t,i)=>el("li",{class:i<vus?"":"voile"},i<vus?t:`Indice ${i+1} encore scellé`)));
    const autres=melange(noms.filter(n=>n!==nom&&gr[n][0].disc===x.disc)).slice(0,5);let g=0;while(autres.length<5&&g++<500){const n=noms[rint(noms.length)];if(n!==nom&&!autres.includes(n))autres.push(n);}
    const opts=melange([nom,...autres]);const ch=el("div",{class:"choix"}),res=el("div",{class:"pile"}),bas=el("div",{class:"rangee"});
    const bI=el("button",{class:"btn"},"Briser un sceau (−1 point)");bI.onclick=()=>{if(vus<ind.length){vus++;dess();}if(vus>=ind.length)bI.disabled=true;};
    opts.forEach(n=>{const b=el("button",{type:"button"},court(gr[n][0]));b.onclick=()=>{if(fini)return;fini=true;const ok=n===nom;const p=ok?Math.max(1,6-vus):0;total+=p;tours++;noter(x.id,ok);emit("partie",{jeu:"enigme",score:ok?1:0,total:1});[...ch.children].forEach((bb,i)=>{bb.disabled=true;if(opts[i]===nom)bb.classList.add("juste");});if(!ok)b.classList.add("faux");vus=ind.length;dess();bI.disabled=true;
      res.replaceChildren(retourEl(ok,ok?`Juste : ${p} point${p>1?"s":""}.`:`Non : c'était ${x.auteur}.`,fs.map(f=>ficheEl(f))));sc.replaceChildren("Points : ",el("b",{},total),` en ${tours} énigme${tours>1?"s":""}`);const nb=el("button",{class:"btn or"},"Énigme suivante");nb.onclick=manche;bas.replaceChildren(nb);nb.focus({preventScroll:true});};ch.append(b);});
    const sc=el("p",{class:"score"},"Points : ",el("b",{},total),` en ${tours} énigme${tours>1?"s":""}`);
    dess();zone.replaceChildren(avisElargi(elargi),sc,el("p",{class:"question"},"Qui suis-je ?"),ul,el("div",{class:"rangee"},bI),ch,bas,res);
  }
  manche();
}

/* ========== Balance du Marchand ========== */
function vBalance(main,mode){
  let pts=0,tours=0;main.append(entete("balance",mode),el("p",{class:"petit cadre",style:"padding:6px 12px"},"Valeurs les plus récentes publiées au ",DATA.meta.date,", à revérifier avant de les citer. ",lienExt(OFF.jury.u,"Le jury demande de maîtriser ces ordres de grandeur ↗")));
  const pf=panneauFiltres(()=>{majPerimetreEntete();manche();});const zone=el("section",{class:"cadre pile"});main.append(pf,zone);
  function manche(){
    const{items,elargi}=reserve(["chiffres"],4);const sc=el("p",{class:"score"},"Score : ",el("b",{},pts),` / ${tours}`);const bas=el("div",{class:"rangee"}),z=el("div",{class:"pile"});
    const suite=ok=>{tours++;if(ok)pts++;emit("partie",{jeu:"balance",mode,score:ok?1:0,total:1});sc.replaceChildren("Score : ",el("b",{},pts),` / ${tours}`);const b=el("button",{class:"btn or"},"Pesée suivante");b.onclick=manche;bas.replaceChildren(b);b.focus({preventScroll:true});};
    if(mode==="valeurs")rendreQCM(z,qChiffre(R0,items),suite);
    else{const x=tirer(items,1)[0];const d=decimales(x);let w=x.valeur*melange([0.55,0.7,0.82,1.2,1.4,1.8])[0];if(/^%/.test(x.unite||"")&&w>100)w=(x.valeur+100)/2;const haut=x.valeur>w;
      const p=el("p",{class:"question"},`${x.indicateur} (${x.periode}${x.champ?", "+x.champ:""}) : la vraie valeur est-elle au-dessus ou en dessous de cette annonce ?`,el("span",{class:"citation"},fmtC(w,d,x)));
      const ch=el("div",{class:"choix"}),res=el("div");[["Au-dessus",true],["En dessous",false]].forEach(([l,v])=>{const b=el("button",{type:"button"},l);b.onclick=()=>{const ok=v===haut;[...ch.children].forEach(bb=>bb.disabled=true);b.classList.add(ok?"juste":"faux");noter(x.id,ok);res.replaceChildren(retourEl(ok,`${ok?"Juste":"Non"} : ${x.affichage}.`,[ficheEl(x,ok?"juste":"faux")]));suite(ok);};ch.append(b);});
      z.append(el("div",{class:"tags"},el("span",{class:"etiquette"},`${NIVL[NIV(x.chap[0])]} · ${CHAP[x.chap[0]].court}`)),p,ch,res);}
    zone.replaceChildren(avisElargi(elargi),sc,z,bas);
  }
  manche();
}

/* ========== Comptoir du Trésorier ========== */
const arr=(n,d)=>{const p=Math.pow(10,d);return Math.round(n*p)/p;};
function vComptoir(main){
  let pts=0,tours=0;
  const gens=[
    ()=>{const a=1800+rint(900),b=Math.round(a*(1+(rint(90)-25)/1000));return{t:"Taux de variation",e:`Le PIB d'un pays passe de ${fr(a)} à ${fr(b)} milliards d'euros. Calculez le taux de variation, en %, arrondi au dixième.`,rep:(b-a)/a*100,d:1,u:"%",sol:`(${fr(b)} − ${fr(a)}) / ${fr(a)} × 100 ≈ ${fr(arr((b-a)/a*100,1),1)} %`};},
    ()=>{const t=(rint(300)-120)/10||2.5;return{t:"Coefficient multiplicateur",e:`Un prix varie de ${fr(t,1)} %. Quel est le coefficient multiplicateur (au millième) ?`,rep:1+t/100,d:3,u:"",sol:`CM = 1 + (${fr(t,1)} / 100) = ${fr(1+t/100,3)}`};},
    ()=>{const t1=2+rint(18),t2=2+rint(15);const g=((1+t1/100)*(1-t2/100)-1)*100;return{t:"Taux de variation cumulé",e:`Une production augmente de ${t1} % une année, puis baisse de ${t2} % l'année suivante. Quel est le taux de variation sur les deux ans, en % (au dixième) ?`,rep:g,d:1,u:"%",sol:`(1 + ${fr(t1/100,2)}) × (1 − ${fr(t2/100,2)}) − 1 = ${fr((1+t1/100)*(1-t2/100),4)} − 1, soit ${fr(arr(g,1),1)} %. Les taux ne s'additionnent pas.`};},
    ()=>{const i1=100+rint(40),i2=i1+rint(30)+1;const g=(i2/i1-1)*100;return{t:"Indice",e:`Base 100 en 2015. L'indice des prix vaut ${i1} en 2020 et ${i2} en 2025. De combien les prix ont-ils augmenté entre 2020 et 2025, en % (au dixième) ?`,rep:g,d:1,u:"%",sol:`(${i2} / ${i1} − 1) × 100 ≈ ${fr(arr(g,1),1)} %. Attention : ${i2-i1} est l'écart en points d'indice, pas en %.`};},
    ()=>{const a=1000+rint(500),n=5+rint(16),t=(5+rint(40))/10,b=Math.round(a*Math.pow(1+t/100,n));const g=(Math.pow(b/a,1/n)-1)*100;return{t:"Taux de croissance annuel moyen",e:`Une grandeur passe de ${fr(a)} à ${fr(b)} en ${n} ans. Quel est son taux de croissance annuel moyen, en % (au centième) ?`,rep:g,d:2,u:"%",sol:`TCAM = (${fr(b)} / ${fr(a)})^(1/${n}) − 1 ≈ ${fr(arr(g,2),2)} %`};},
    ()=>{const a=(60+rint(40))/10,b=arr(a+((rint(16)-6)/10||0.4),1);return{t:"Points de pourcentage",e:`Le taux de chômage passe de ${fr(a,1)} % à ${fr(b,1)} %. De combien de points de pourcentage a-t-il varié (au dixième, signe compris) ?`,rep:b-a,d:1,u:"points",sol:`${fr(b,1)} − ${fr(a,1)} = ${fr(arr(b-a,1),1)} point(s) ; en taux de variation, cela fait ${fr(arr((b-a)/a*100,1),1)} %.`};},
    ()=>{const p=2+rint(15),q=-(1+rint(25));return{t:"Élasticité-prix",e:`Le prix d'un bien augmente de ${p} % et la quantité demandée varie de ${q} %. Quelle est l'élasticité-prix de la demande (au centième) ?`,rep:q/p,d:2,u:"",sol:`e = (ΔQ/Q) / (ΔP/P) = ${q} / ${p} ≈ ${fr(arr(q/p,2),2)}. ${Math.abs(q/p)>1?"La demande est élastique.":"La demande est peu élastique."}`,ref:"n018"};},
    ()=>{const n=(10+rint(50))/10,i=(rint(60)+5)/10;const g=((1+n/100)/(1+i/100)-1)*100;return{t:"Valeur réelle",e:`Le salaire nominal augmente de ${fr(n,1)} % et les prix de ${fr(i,1)} %. De combien varie le salaire réel, en % (au centième) ?`,rep:g,d:2,u:"%",sol:`(1 + ${fr(n/100,3)}) / (1 + ${fr(i/100,3)}) − 1 ≈ ${fr(arr(g,2),2)} % (approximation : ${fr(n,1)} − ${fr(i,1)} = ${fr(arr(n-i,1),1)} point(s)).`};},
    ()=>{const A=arr(28+rint(60)/10,1),B=arr(A*(5+rint(60)/10)/100,2);const g=B/A*100;return{t:"Proportion",e:`Sur une population active de ${fr(A,1)} millions de personnes, ${fr(B,2)} millions sont au chômage. Quel est le taux de chômage, en % (au dixième) ?`,rep:g,d:1,u:"%",sol:`${fr(B,2)} / ${fr(A,1)} × 100 ≈ ${fr(arr(g,1),1)} %`,ref:"n095"};},
    ()=>{const w=[1+rint(5),1+rint(5),1+rint(5)],s=[1500+rint(800),2200+rint(1200),3500+rint(2500)];const m=(w[0]*s[0]+w[1]*s[1]+w[2]*s[2])/(w[0]+w[1]+w[2]);return{t:"Moyenne pondérée",e:`Une entreprise compte ${w[0]} dizaines d'employés payés ${fr(s[0])} €, ${w[1]} dizaines de techniciens payés ${fr(s[1])} € et ${w[2]} dizaines de cadres payés ${fr(s[2])} € (salaires nets mensuels). Quel est le salaire moyen, en euros (à l'unité) ?`,rep:m,d:0,u:"€",sol:`(${w[0]} × ${fr(s[0])} + ${w[1]} × ${fr(s[1])} + ${w[2]} × ${fr(s[2])}) / ${w[0]+w[1]+w[2]} ≈ ${fr(Math.round(m))} €`};},
    ()=>{const c=[0.5,0.6,0.75,0.8,0.9][rint(5)];return{t:"Multiplicateur keynésien",e:`La propension marginale à consommer vaut ${fr(c,2)}. Quelle est la valeur du multiplicateur d'investissement (au dixième) ?`,rep:1/(1-c),d:1,u:"",sol:`k = 1 / (1 − ${fr(c,2)}) = ${fr(arr(1/(1-c),1),1)} : une dépense autonome de 1 accroît le revenu de ${fr(arr(1/(1-c),1),1)} dans le modèle simple (économie fermée, sans État).`,ref:"a016"};},
  ];
  main.append(entete("comptoir",null,false),el("p",{class:"petit cadre",style:"padding:6px 12px"},lienExt(PROG["2"].u,"Programme de seconde : objectifs sur les données quantitatives ↗")," · ",lienExt(OFF.bac3.u,"Épreuves bac + 3 : exploitation d'un document statistique ↗")));
  const zone=el("section",{class:"cadre pile"});main.append(zone);
  function manche(){
    const q=gens[rint(gens.length)]();const sc=el("p",{class:"score"},"Score : ",el("b",{},pts),` / ${tours}`);
    const inp=el("input",{type:"text",inputmode:"decimal",id:"saisie-calcul","aria-label":"Votre résultat",autocomplete:"off"});const bV=el("button",{class:"btn or"},"Valider");const res=el("div",{class:"pile"}),bas=el("div",{class:"rangee"});
    const valider=()=>{const v=parseFloat(inp.value.replace(/\s/g,"").replace("%","").replace(",","."));if(isNaN(v)){annonce("Saisissez un nombre");inp.focus();return;}
      const tol=Math.max(Math.pow(10,-q.d)*0.6,Math.abs(q.rep)*0.002);const ok=Math.abs(v-q.rep)<=tol;tours++;if(ok){pts++;S.xp=(S.xp||0)+10;sauver();majHud();}emit("calcul",{juste:ok});emit("partie",{jeu:"comptoir",score:ok?1:0,total:1});reagir(ok);inp.disabled=true;bV.disabled=true;const ref=q.ref&&PAR_ID[q.ref];
      res.replaceChildren(el("p",{class:"verdict "+(ok?"juste":"faux")},ok?"Juste.":`Non : ${fr(arr(q.rep,q.d),q.d)}${q.u?" "+q.u:""}.`,ok?el("span",{class:"gain"},"  +10 XP · +2 écus"):null),el("div",{class:"solution"},q.sol),ref?ficheEl(ref):"");
      sc.replaceChildren("Score : ",el("b",{},pts),` / ${tours}`);const b=el("button",{class:"btn or"},"Calcul suivant");b.onclick=manche;bas.replaceChildren(b);b.focus({preventScroll:true});};
    bV.onclick=valider;inp.addEventListener("keydown",e=>{if(e.key==="Enter")valider();});
    zone.replaceChildren(sc,el("span",{class:"oeil"},q.t),el("p",{class:"enonce"},q.e),el("div",{class:"saisie"},inp,q.u?el("span",{},q.u):null,bV),res,bas);
  }
  manche();
}

/* ========== Codex ========== */
function vCodex(main){
  let type="tout",q="",lim=40,applique=false;const types={tout:"Tout",auteurs:"Auteurs et œuvres",notions:"Notions",dates:"Dates",mecas:"Mécanismes",chiffres:"Chiffres clés"};
  main.append(entete("codex",null,false));
  const rech=el("input",{type:"search",id:"rech-codex",placeholder:"Un auteur, une notion, une année…","aria-label":"Rechercher dans le codex",style:"width:100%"});const ong=el("div",{class:"modes"}),cpt=el("p",{class:"pix petit"});
  const ta=el("button",{class:"puce","aria-pressed":"false",type:"button"},"Appliquer le périmètre de révision");ta.onclick=()=>{applique=!applique;ta.setAttribute("aria-pressed",String(applique));lim=40;liste();};
  main.append(el("section",{class:"cadre pile"},rech,ong,el("div",{class:"rangee"},ta)));const pf=panneauFiltres(()=>{if(applique)liste();});const zone=el("section",{class:"pile"});main.append(pf,zone);
  const dO=()=>ong.replaceChildren(...Object.entries(types).map(([k,l])=>{const b=el("button",{class:"puce","aria-pressed":String(k===type),type:"button"},l);b.onclick=()=>{type=k;lim=40;dO();liste();};return b;}));dO();
  rech.addEventListener("input",()=>{q=rech.value;lim=40;liste();});
  function liste(){let L=type==="tout"?TOUT:DB[type];if(applique)L=L.filter(passe);
    if(q.trim()){const t=sansAccent(q.toLowerCase());L=L.filter(x=>sansAccent(JSON.stringify([x.auteur,x.oeuvre,x.annee,x.idee,x.concept,x.terme,x.def,x.evenement,x.detail,x.titre,x.indicateur,x.courant]).toLowerCase()).includes(t));}
    L=[...L].sort((a,b)=>titreFiche(a).localeCompare(titreFiche(b),"fr"));
    const box=el("div",{class:"cadre pile"},cpt,el("div",{class:"liste-codex"},L.slice(0,lim).map(x=>{const d=el("details",{class:`d-${x.disc}`});const sous=x.type==="auteur"?`${x.oeuvre} (${x.anneeAff||x.annee})`:x.type==="date"?String(x.annee):x.type==="chiffre"?x.affichage:NOM_TYPE[x.type];
      d.append(el("summary",{},el("span",{},el("b",{},titreFiche(x)),el("span",{class:"doux petit"},"  ·  "+sous)),el("span",{class:"rangee"},x.verif?null:el("span",{class:"a-confirmer"},"à confirmer"),el("span",{class:"maitrise",title:"Maîtrise"},[0,1,2,3].map(n=>el("i",{class:n<boite(x.id)?"on":""}))))));d.addEventListener("toggle",()=>{if(d.open&&d.children.length===1)d.append(ficheEl(x));});return d;})));
    cpt.textContent=`${L.length} fiche${L.length>1?"s":""}`;zone.replaceChildren(box);
    if(L.length>lim){const b=el("button",{class:"btn"},`Afficher plus (${L.length-lim} restantes)`);b.onclick=()=>{lim+=60;liste();};box.append(b);}}
  liste();
}

/* ========== Archives (sources) ========== */
function vArchives(main){
  const hotes={};TOUT.forEach(x=>{if(x.verif)x.src.forEach(s=>{try{const h=new URL(s.u).hostname.replace(/^www\./,"");hotes[h]=(hotes[h]||0)+1;}catch(e){}});});
  const top=Object.entries(hotes).sort((a,b)=>b[1]-a[1]);const nomT={auteurs:"Auteurs et œuvres",notions:"Notions",dates:"Dates",mecas:"Mécanismes",chiffres:"Chiffres clés"};
  main.append(el("section",{class:"cadre pile"},el("span",{class:"oeil"},"Les archives de la guilde"),el("h1",{},"Sources et méthode"),
    el("p",{},"Le contenu suit le programme officiel du concours : programmes de SES de seconde, de première et de terminale, et attendus des épreuves en histoire de la pensée et en épistémologie. Chaque fiche a été rédigée puis confrontée à une page publique, dont le lien est affiché. Les fiches qu'aucune page n'a pu confirmer portent la mention « source à confirmer » et un lien de recherche."),
    el("p",{class:"doux"},`Vérification du ${DATA.meta.date}. Les chiffres clés sont les dernières valeurs publiées à cette date et vieilliront.`),
    el("div",{class:"defile"},el("table",{class:"tab"},el("thead",{},el("tr",{},el("th",{},"Type"),el("th",{},"Fiches"),el("th",{},"Source vérifiée"))),el("tbody",{},Object.keys(nomT).map(t=>{const n=DB[t].length,v=DB[t].filter(x=>x.verif).length;return el("tr",{},el("td",{},nomT[t]),el("td",{},fr(n)),el("td",{},`${fr(v)} (${n?Math.round(100*v/n):0} %)`));}))))));
  main.append(el("section",{class:"cadre pile"},el("h2",{},"Textes officiels"),el("ul",{style:"margin:0;padding-left:1.1rem;display:grid;gap:6px"},Object.values(OFF).map(o=>el("li",{},lienExt(o.u,o.l+" ↗"))),Object.values(PROG).filter((p,i,a)=>a.indexOf(p)===i).map(p=>el("li",{},lienExt(p.u,p.l+" ↗"))))));
  main.append(el("section",{class:"cadre pile"},el("h2",{},"Sites cités"),el("div",{class:"defile"},el("table",{class:"tab"},el("thead",{},el("tr",{},el("th",{},"Site"),el("th",{},"Liens"))),el("tbody",{},top.map(([h,n])=>el("tr",{},el("td",{},h),el("td",{},n))))))));
}
