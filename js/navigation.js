/* =====================================================================
   La Guilde des SES · navigation
   Menu, thème, routage par ancre (#nom) et démarrage.
   ===================================================================== */
"use strict";
/* ========== Navigation ========== */
const VUES={atelier:vAtelier,quete:vQuete,paires:vPaires,sceaux:vSceaux,bibliotheque:vBiblio,grille:vGrille,chronique:vChronique,duel:vDuel,forge:vForge,faussaire:vFaussaire,enigme:vEnigme,balance:vBalance,comptoir:vComptoir,codex:vCodex};
let vueCourante="accueil";
function construireMenu(){
  const nav=$("#nav-menu");nav.replaceChildren(el("a",{href:"#accueil"},sprite("blason",20),"Accueil de la guilde"));
  for(const s of ORDRE_SAVOIRS){nav.append(el("span",{class:"titre-groupe"},SAVOIRS[s].l));const vus=new Set();PLAN[s].forEach(([h])=>{const d=decoupe(h);if(vus.has(d.id))return;vus.add(d.id);nav.append(el("a",{href:"#"+h},sprite(JEUX[d.id].icone,20),JEUX[d.id].nom));});}
  nav.append(el("span",{class:"titre-groupe"},"Votre personnage"),el("a",{href:"#loge"},sprite("miroir",20),"La loge",el("small",{},PRONOM_AFF()||"")),el("a",{href:"#echoppe"},sprite("coffre",20),"L'échoppe",el("small",{},`${fr(S.ecus)} écus`)),el("a",{href:"#quetes"},sprite("trophee",20),"Quêtes et hauts faits"),el("a",{href:"#sauvegarde"},sprite("cle",20),"Sauvegarde",el("small",{},enClaude()?"compte Claude":SAUVE.code?"en ligne":supaActif()?"à activer":"navigateur")));
  nav.append(el("span",{class:"titre-groupe"},"Tout le programme"),el("a",{href:"#quete"},sprite("epee",20),"Quête du jour"),el("a",{href:"#codex"},sprite("livre",20),"Le Codex"),el("a",{href:"#archives"},sprite("carte",20),"Sources et méthode"));
}
function ouvrirMenu(o){$("#voile-menu").classList.toggle("ouvert",o);$("#btn-menu").setAttribute("aria-expanded",String(o));if(o)$("#btn-fermer").focus();}
function appliquerTheme(){document.documentElement.classList.toggle("jour",S.theme==="jour");$("#btn-theme").textContent=S.theme==="jour"?"Passer à la veillée (sombre)":"Passer au grand jour (clair)";}
function route(){
  if(paysageStop){paysageStop();paysageStop=null;}if(roSceaux){roSceaux.disconnect();roSceaux=null;}
  const h=decodeURIComponent((location.hash||"").slice(1)).toLowerCase();const main=$("#main");main.replaceChildren();
  if(CHAP_DE_HASH[h]){vueCourante=h;vChapitre(main,CHAP_DE_HASH[h]);}
  else if(h==="archives"){vueCourante=h;vArchives(main);}
  else if(h==="loge"){vueCourante=h;vLoge(main);}
  else if(h==="echoppe"||h.startsWith("echoppe-")){vueCourante=h;vEchoppe(main,h.slice(8));}
  else if(h==="quetes"){vueCourante=h;vQuetes(main);}
  else if(h==="sauvegarde"){vueCourante=h;vSauvegarde(main);}
  else{const d=h&&decoupe(h);if(d){vueCourante=h;VUES[d.id](main,d.mode);}else{vueCourante="accueil";vAccueil(main);}}
  document.querySelectorAll("#nav-menu a").forEach(a=>{const hh=a.getAttribute("href").slice(1);const d=decoupe(hh);const cur=hh===vueCourante||(d&&decoupe(vueCourante)&&d.id===decoupe(vueCourante).id);if(cur)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
  ouvrirMenu(false);window.scrollTo({top:0});majCompagnon();
}
function demarrer(){
  $("#icone-blason").replaceWith(sprite("blason",32));appliquerTheme();construireMenu();majHud();
  $("#btn-menu").onclick=()=>ouvrirMenu(true);$("#btn-fermer").onclick=()=>ouvrirMenu(false);
  $("#voile-menu").addEventListener("click",e=>{if(e.target.id==="voile-menu")ouvrirMenu(false);});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")ouvrirMenu(false);});
  $("#btn-theme").onclick=()=>{S.theme=S.theme==="jour"?"nuit":"jour";sauver();appliquerTheme();};
  majPied();initCompagnon();
  addEventListener("hashchange",()=>{route();construireMenu();});route();initCompte();initSample();initSauvegarde();
  try{window.claude&&window.claude.hot&&window.claude.hot.snapshot&&window.claude.hot.snapshot(()=>({vue:vueCourante}));}catch(e){}
}
(window.claude&&window.claude.hot&&window.claude.hot.ready)?window.claude.hot.ready(demarrer):demarrer(window.claude&&window.claude.hot&&window.claude.hot.data||{});
