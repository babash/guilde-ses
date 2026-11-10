/* =====================================================================
   La Guilde des SES · la Joute des écoles
   Thèse, objection et dépassement : les débats par écoles de pensée.
   ===================================================================== */
"use strict";
const DEBATS=DATA.joutes;
DEBATS.forEach(j=>{j.type="debat";j.niv=[...new Set(j.chap.map(NIV))];j.positions.forEach((p,k)=>{p.cle=`${j.id}-${k}`;p.k=k;p.j=j;});});
const DEBAT_ID=Object.fromEntries(DEBATS.map(j=>[j.id,j]));
Object.assign(SAVOIRS,{debats:{l:"Débats et écoles de pensée",icone:"epee",type:null,
  bref:"la dissertation : opposer des écoles, leur objecter ce que leurs rivales objectent, et dépasser l'opposition",
  usage:"Le jury attend une démonstration, pas une juxtaposition d'auteurs. Savoir quelle école soutient quelle thèse, quelle objection lui oppose l'école rivale et comment dépasser leur désaccord structure le plan de la dissertation (écrit 1) et l'exposé de l'oral."}});
JEUX.joute={nom:"La Joute des écoles",icone:"epee",oeil:"Jeu phare",fluff:"Dans la lice, les écoles croisent le fer. À vous d'arbitrer.",
  regle:"Chaque passe porte sur un débat du programme. Reconnaissez l'école qui défend une thèse, choisissez l'objection qui la touche vraiment, ou bâtissez le plan dialectique (thèse, antithèse, dépassement). Après chaque passe, la carte complète du débat s'affiche, avec les fiches des auteurs.",
  epreuve:"La dissertation de l'écrit 1 et l'exposé de l'oral : construire une démonstration qui confronte les analyses au lieu de les juxtaposer.",
  modes:{ecoles:{l:"Qui défend cette thèse ?",savoirs:["debats","auteurs"]},riposte:{l:"La riposte",savoirs:["debats","auteurs"]},plan:{l:"Thèse, antithèse, dépassement",savoirs:["debats","redaction"]}},def:"ecoles"};
PLAN.debats=[["joute-ecoles"],["joute-riposte"],["joute-plan"],["chronique-debats"]];
ORDRE_SAVOIRS.unshift("debats");

function passeDebat(j){if(!F.disc.has(j.disc))return false;if(F.chap)return j.chap.includes(F.chap);return j.niv.some(n=>F.niv.has(n));}
function debatsPerim(min=2,filtre=()=>true){const L=DEBATS.filter(j=>filtre(j)&&passeDebat(j));if(L.length>=min)return{items:L,elargi:false};return{items:DEBATS.filter(filtre),elargi:true};}
const ficheDe=id=>PAR_ID[id]||null;
const fichesPos=p=>p.fiches.map(ficheDe).filter(Boolean);
const nomsPos=p=>fichesPos(p).map(x=>x.type==="auteur"?court(x):titreFiche(x));
/* tirage pondéré par la maîtrise de chaque position */
function tirerPosition(debats,r=R0,filtre=()=>true){const P=debats.flatMap(j=>j.positions.filter(filtre));return tirer(P.map(p=>({id:p.cle,p})),1,{r,pondere:r===R0})[0].p;}

/* question pour la quête du jour */
function qJoute(r){const p=tirerPosition(DEBATS,r);const j=p.j;const ch=melange(j.positions,r);
  return{sorte:"debats",prompt:`${j.q} Quelle école soutient cette thèse ?`,citation:p.these,choix:ch.map(x=>x.ecole),bon:ch.indexOf(p),fiches:fichesPos(p).slice(0,2),noter:[p.cle],ev:"joute",
    extra:()=>el("div",{class:"pile",style:"gap:4px"},el("p",{class:"petit"},el("b",{},"Argument : "),p.arg),el("p",{class:"petit"},el("b",{},"Objection : "),p.objection),el("a",{class:"petit",href:"#joute-ecoles"},"Toute la carte du débat à la Joute des écoles ›"))};}

/* carte complète d'un débat, affichée après chaque passe */
function carteDebat(j,{surligne=null,ouvert=true}={}){
  const d=el("details",{class:"carte-debat",open:ouvert?true:null},el("summary",{},`Carte du débat : ${j.positions.length} écoles en présence`));
  d.append(el("div",{class:"positions"},j.positions.map(p=>{const fs=fichesPos(p);
    const det=fs.length?el("details",{class:"fiches-pos"},el("summary",{},`Fiches : ${nomsPos(p).join(", ")}`)):null;
    if(det)det.addEventListener("toggle",()=>{if(det.open&&det.children.length===1)det.append(el("div",{class:"liste-fiches"},fs.map(x=>ficheEl(x))));});
    return el("article",{class:"position"+(p===surligne?" vise":"")},el("h4",{},p.ecole),el("p",{},p.these),el("p",{class:"petit"},el("b",{},"Argument : "),p.arg),el("p",{class:"petit objection"},el("b",{},"Objection : "),p.objection),det);})));
  if(j.plan)d.append(el("div",{class:"plan-debat"},el("span",{class:"oeil"},"Un plan dialectique possible"),el("ol",{},j.plan.map(i=>el("li",{},el("b",{},j.positions[i].ecole),` : ${j.positions[i].these}`))),el("p",{class:"petit"},el("b",{},"Pourquoi ce dépassement : "),j.logique)));
  d.append(el("p",{class:"petit"},j.chap.map((c,i)=>[i?" · ":"",el("a",{href:"#"+chapHash(c)},`${NIVL[NIV(c)]} · ${CHAP[c].court}`)]).flat()," · ",el("a",{href:"#atelier-plan"},"S'entraîner au plan détaillé à l'Atelier ›")));
  return d;}

function vJoute(main,mode){
  let pts=0,tours=0,serie=0;const best=()=>S.best.joute||0;
  main.append(entete("joute",mode));const pf=panneauFiltres(()=>{majPerimetreEntete();manche();});const zone=el("section",{class:"cadre pile joute"});main.append(pf,zone);
  const score=()=>el("p",{class:"score"},"Passes gagnées : ",el("b",{},pts),` / ${tours} · série : ${serie} · record : ${best()}`);
  function conclure(ok,p,j,texte,zr,bas,sc,zc){tours++;if(ok){pts++;serie++;if(serie>best()){S.best.joute=serie;}}else serie=0;
    noter(p.cle,ok);emit("joute",{juste:ok,mode});emit("partie",{jeu:"joute",mode,score:ok?1:0,total:1});sc.replaceWith(score());
    zr.replaceChildren(retourEl(ok,texte,[]));zc.replaceChildren(carteDebat(j,{surligne:p}));
    const b=el("button",{class:"btn or"},"Passe suivante");b.onclick=manche;bas.replaceChildren(b);b.focus({preventScroll:true});}
  function tete(j){return el("div",{class:"tete-debat"},el("span",{class:"oeil"},"Le débat"),el("h2",{},j.q),el("div",{class:"tags"},j.chap.map(c=>el("span",{class:"etiquette"},`${NIVL[NIV(c)]} · ${CHAP[c].court}`))));}
  function manche(){
    const sc=score(),zr=el("div",{class:"pile"}),bas=el("div",{class:"rangee"}),zc=el("div",{class:"pile"});
    if(mode==="plan"){const{items,elargi}=debatsPerim(2,j=>!!j.plan);const j=tirer(items.map(d=>({id:d.id,d})),1)[0].d;const p0=j.positions[j.plan[2]];
      let ordre=[];const cartes=melange(j.plan.map(i=>j.positions[i]));if(cartes.every((p,i)=>p===j.positions[j.plan[i]]))cartes.reverse();
      const slots=el("ol",{class:"plan-slots"}),pile=el("div",{class:"pile"});const bV=el("button",{class:"btn or",disabled:true},"Vérifier le plan");let fini=false;
      const ROM=["I. Thèse","II. Antithèse","III. Dépassement"];
      function dess(){slots.replaceChildren(...ROM.map((t,i)=>{const p=ordre[i];const b=el("button",{type:"button",class:"etape",disabled:fini||!p},el("span",{class:"n"},t),el("span",{},p?`${p.ecole} : ${p.these}`:"…"));b.onclick=()=>{ordre.splice(i,1);dess();};if(fini&&p)b.classList.add(p===j.positions[j.plan[i]]?"juste":"faux");return el("li",{},b);}));
        pile.replaceChildren(...cartes.filter(p=>!ordre.includes(p)).map(p=>{const b=el("button",{type:"button",class:"etape"},el("span",{class:"n"},"·"),el("span",{},el("b",{},p.ecole),` : ${p.these}`));b.onclick=()=>{if(fini)return;ordre.push(p);dess();};return b;}));
        bV.disabled=fini||ordre.length!==3;}
      bV.onclick=()=>{fini=true;const bon=j.plan.map(i=>j.positions[i]);const exact=ordre.every((p,i)=>p===bon[i]);const inverse=ordre[2]===bon[2]&&ordre[0]===bon[1];const ok=exact||inverse;dess();
        conclure(ok,p0,j,exact?"Plan juste : la démonstration progresse jusqu'au dépassement.":inverse?"Juste : partir de l'autre thèse se défend, l'essentiel est le dépassement en troisième partie.":ordre[2]===bon[2]?"Le dépassement est bien placé, mais l'ordre des deux premières parties ne tient pas.":`Non : le dépassement est la position « ${bon[2].ecole} ».`,zr,bas,sc,zc);};
      zone.replaceChildren(avisElargi(elargi),sc,tete(j),el("p",{class:"question"},"Ordonnez ces trois positions en plan dialectique : touchez d'abord la thèse, puis l'antithèse, puis le dépassement."),el("span",{class:"oeil"},"Votre plan"),slots,el("span",{class:"oeil"},"Positions à placer"),pile,el("div",{class:"rangee"},bV),zr,bas,zc);dess();return;}
    const{items,elargi}=debatsPerim(2);const p=tirerPosition(items);const j=p.j;const ch=el("div",{class:"choix"});let opts,bon,enonce;
    if(mode==="riposte"){opts=melange(j.positions);bon=opts.indexOf(p);
      enonce=el("div",{class:"pile",style:"gap:6px"},el("p",{class:"question"},"Quelle objection met vraiment cette thèse en difficulté ?"),el("blockquote",{class:"these"},el("b",{},p.ecole),el("span",{},p.these),el("small",{},p.arg)));
      opts.forEach((o,i)=>{const b=el("button",{type:"button",class:"long"},o.objection);b.onclick=()=>rep(i);ch.append(b);});}
    else{opts=melange(j.positions);bon=opts.indexOf(p);
      enonce=el("div",{class:"pile",style:"gap:6px"},el("p",{class:"question"},"Quelle école de pensée soutient cette thèse ?"),el("blockquote",{class:"these"},el("span",{},p.these)));
      opts.forEach((o,i)=>{const b=el("button",{type:"button"},o.ecole);b.onclick=()=>rep(i);ch.append(b);});}
    function rep(i){const ok=i===bon;[...ch.children].forEach((b,k)=>{b.disabled=true;if(k===bon)b.classList.add("juste");});if(!ok)ch.children[i].classList.add("faux","secousse");
      const t=mode==="riposte"?(ok?"Touché : c'est l'objection que lui adressent ses adversaires.":`Non : cette objection vise la position « ${opts[i].ecole} ».`):(ok?`Juste : ${p.ecole}${nomsPos(p).length?` (${nomsPos(p).join(", ")})`:""}.`:`Non : c'est la position « ${p.ecole} »${nomsPos(p).length?` (${nomsPos(p).join(", ")})`:""}.`);
      conclure(ok,p,j,t,zr,bas,sc,zc);}
    zone.replaceChildren(avisElargi(elargi),sc,tete(j),enonce,ch,zr,bas,zc);
  }
  manche();
}

/* mise en avant à l'accueil */
function blocJoute(){const k=cleJour();const r=mulberry32(Number(k.replace(/-/g,""))*11+7);const j=DEBATS[Math.floor(r()*DEBATS.length)];
  return el("section",{class:"cadre pile vedette"},el("div",{class:"titre rangee"},sprite("epee",36),el("div",{},el("span",{class:"oeil"},"Nouveau · le jeu phare"),el("h2",{},"La Joute des écoles"))),
    el("p",{},`${DEBATS.length} débats du programme, de « ${DEBATS[0].q} » à « ${DEBATS[DEBATS.length-1].q} ». Pour chacun, les écoles en présence, leurs thèses, l'objection que leur adressent leurs rivales et un plan dialectique.`),
    el("p",{class:"sujet-choisi"},`Débat du jour : « ${j.q} »`,el("small",{},j.positions.map(p=>p.ecole).join(" · "))),
    el("div",{class:"rangee"},el("a",{class:"btn or",href:"#joute-ecoles"},sprite("epee",20),"Qui défend cette thèse ?"),el("a",{class:"btn",href:"#joute-riposte"},"La riposte"),el("a",{class:"btn",href:"#joute-plan"},"Thèse, antithèse, dépassement")));}
