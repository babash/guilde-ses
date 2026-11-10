/* =====================================================================
   La Guilde des SES · pages du personnage
   La loge, l'échoppe, les quêtes et hauts faits, la carte d'aventurier·e.
   ===================================================================== */
"use strict";
normaliser();
Object.assign(SPR,{
  trophee:["............",".oooooooooo.","o.owoooooO.o","o.owoooooO.o",".ooowoooOoo.","...oooooO...","....ooOO....",".....oO.....",".....oO.....","....ooOO....","...nnnnnn...","...nnnnnn..."],
  miroir:["....kkkk....","...kssssk...","..ksswsssk..","..kswssssk..","..ksssssSk..","..kssssSSk..","...kssSSk...","....kkkk....",".....nn.....",".....nn.....","....nnnn....","...nnnnnn..."],
  coffre:["............","..nnnnnnnn..",".nOOOOOOOOn.",".nOnnnnnnOn.",".nnnnoonnnn.",".nOOOooOOOn.",".nOOOOOOOOn.",".nOOOOOOOOn.",".nnnnnnnnnn.","............"],
});
const CATS=[["tenues","Tenues",["haut","bas","jambes"]],["chaussures","Chaussures",["pieds"]],["chapeaux","Couvre-chefs et lunettes",["tete","visage","oreilles"]],["dos","Dos",["dos"]],["main","En main",["main"]],["teintures","Teintures",["teinte"]],["familiers","Familiers",["familier","famAcc"]],["gestes","Attitudes",["attitude"]],["reussite","Animations de réussite",["succes"]],["erreur","Animations d'erreur",["erreur"]]];
const catDe=slot=>(CATS.find(c=>c[2].includes(slot))||CATS[0])[0];
const SLOTS_OPTION=new Set(["jambes","tete","visage","oreilles","dos","main","famAcc"]);

function sceneCanvas(cfg,o={}){const cv=el("canvas",{class:"scene-perso",role:"img","aria-label":o.label||"Votre personnage"});const sc=new Scene(cv,o);sc.setPerso(cfg);return{cv,sc};}
function descPerso(){const p=S.perso;const E=ESPECES[p.espece]||ESPECES.humain;return `${p.nom||"Sans nom"}, ${E.l.toLowerCase()}`;}
function vignette(cfg,slot){const r=peindre(cfg,{}).c.toile();const tete=["tete","visage","oreilles","teinte"].includes(slot);const g=geom(cfg);
  const[sx,sy,sw,sh,k]=tete?[4,Math.max(0,g.hy-12),32,30,3]:[0,4,40,60,2];const cv=el("canvas",{width:sw*k,height:sh*k,"aria-hidden":"true"});const c=cv.getContext("2d");c.imageSmoothingEnabled=false;c.drawImage(r,sx,sy,sw,sh,0,0,sw*k,sh*k);return cv;}
function vignetteFam(id,acc){const r=peindreFamilier(id,acc).toile();const cv=el("canvas",{width:70,height:75,"aria-hidden":"true"});const c=cv.getContext("2d");c.imageSmoothingEnabled=false;c.drawImage(r,0,0,70,75);return cv;}

/* ---------- contrôles ---------- */
function groupe(leg,opts,val,pick){const o=el("div",{class:"opts"});
  opts.forEach(([v,l,iid])=>{const it=iid&&ITEMS_PAR_ID[iid];const lock=it&&!possede(iid);
    const b=el("button",{type:"button",class:"puce"+(lock?" verrou":""),"aria-pressed":String(v===val)},l,lock?el("span",{class:"cadenas"},it.prix!=null?` · ${it.prix} écus`:" · haut fait"):null);
    b.onclick=()=>{if(lock){location.hash="echoppe-"+catDe(it.slot);return;}pick(v);};o.append(b);});
  return el("fieldset",{class:"reglage"},el("legend",{},leg),o);}
function bascule(l,val,pick){const b=el("button",{type:"button",class:"puce","aria-pressed":String(!!val)},(val?"✓ ":"")+l);b.onclick=()=>pick(!val);return b;}
function nuancier(leg,cols,val,pick,noms){const o=el("div",{class:"nuancier"});
  cols.forEach((c,i)=>{const b=el("button",{type:"button",class:"nuance",style:`background:${c}`,"aria-pressed":String((val||"").toLowerCase()===c.toLowerCase()),"aria-label":noms?noms[i]:`Couleur ${i+1}`,title:noms?noms[i]:c});b.onclick=()=>pick(c);o.append(b);});
  const inp=el("input",{type:"color",value:/^#[0-9a-f]{6}$/i.test(val||"")?val:"#888888","aria-label":leg+" : couleur libre"});inp.addEventListener("input",()=>pick(inp.value,true));o.append(inp);
  return el("fieldset",{class:"reglage"},el("legend",{},leg),o);}
const optsSlot=(slot,aucun)=>[...(aucun?[["",aucun]]:[]),...ITEMS.filter(i=>i.slot===slot).map(i=>[i.v,i.nom,i.id])];

/* ---------- la loge ---------- */
function vLoge(main){
  main.append(el("section",{class:"cadre pile"},el("div",{class:"titre rangee"},sprite("miroir",36),el("div",{},el("span",{class:"oeil"},"La loge"),el("h1",{},"Votre personnage"))),
    el("p",{},"Espèce, corps, visage et coiffure sont libres et gratuits. Tenues, accessoires, familiers, gestes et animations se gagnent en révisant : chaque bonne réponse rapporte 2 écus, chaque quête du jour 20 écus, et certains objets ne s'obtiennent que par les hauts faits."),
    el("div",{class:"rangee"},el("span",{class:"ecus"},sprite("piece",18),` ${fr(S.ecus)} écus`),el("a",{class:"btn or",href:"#echoppe"},sprite("coffre",20),"L'échoppe"),el("a",{class:"btn",href:"#quetes"},sprite("trophee",20),"Quêtes et hauts faits"))));
  const{cv,sc}=sceneCanvas(S.perso,{W:64,H:72,s:4,cx:12,cy:4,fx:1,fy:51,label:"Aperçu de votre personnage"});
  const nomL=el("p",{class:"nom-perso"});const bG=el("button",{class:"btn mini"},"Faire un geste"),bS=el("button",{class:"btn mini"},"Réussite"),bE=el("button",{class:"btn mini"},"Erreur"),bH=el("button",{class:"btn mini"},"Au hasard");
  bG.onclick=()=>sc.jouer("attitude",S.perso.attitude);bS.onclick=()=>sc.jouer("succes",S.perso.succes);bE.onclick=()=>sc.jouer("erreur",S.perso.erreur);
  const ap=el("div",{class:"cadre-nuit apercu",style:"padding:14px"},cv,nomL,el("div",{class:"rangee",style:"justify-content:center"},bG,bS,bE,bH));
  const ed=el("section",{class:"cadre pile"});const ong=el("nav",{class:"onglets","aria-label":"Réglages du personnage"});const pan=el("div",{class:"pile"});ed.append(ong,pan);
  main.append(el("div",{class:"loge"},ap,ed));
  const maj=(redessine=true)=>{sauver();sc.setPerso(S.perso);majPerso();majHud();nomL.replaceChildren(S.perso.nom||"Sans nom");cv.setAttribute("aria-label","Aperçu : "+descPerso());if(redessine)panneau();};
  const set=(k,v,red=true)=>{S.perso[k]=v;maj(red);};
  bH.onclick=()=>{const P=S.perso;const pick=a=>a[rint(a.length)];const E=pick(Object.keys(ESPECES));const own=slot=>ITEMS.filter(i=>i.slot===slot&&possede(i.id)).map(i=>i.v);
    Object.assign(P,{espece:E,peau:pick(ESPECES[E].peaux),silhouette:pick(["fine","moyenne","ronde"]),taille:pick(["petite","moyenne","grande"]),yeux:pick(Object.keys(YEUX)),iris:pick(Object.values(IRIS)),bouche:pick(Object.keys(BOUCHES)),coiffure:pick(Object.keys(COIFFURES)),teinte:pick(Object.keys(TEINTES_NAT).concat(own("teinte"))),haut:pick(own("haut")),hautC:pick(COULEURS_TENUE),bas:pick(own("bas")),basC:pick(COULEURS_TENUE),pieds:pick(own("pieds")),rousseur:R0()<.3,blush:R0()<.4});maj();};
  let tab="identite";const TABS=[["identite","Identité"],["corps","Corps"],["visage","Visage"],["cheveux","Cheveux"],["tenue","Tenue"],["accessoires","Accessoires"],["familier","Familier"],["gestes","Gestes"]];
  function onglets(){ong.replaceChildren(...TABS.map(([k,l])=>{const b=el("button",{type:"button",class:"puce","aria-pressed":String(k===tab)},l);b.onclick=()=>{tab=k;onglets();panneau();};return b;}));}
  function panneau(){const P=S.perso,E=ESPECES[P.espece]||ESPECES.humain;let c=[];
    if(tab==="identite"){const nom=el("input",{type:"text",id:"nom-perso",maxlength:"24",value:P.nom,placeholder:"Votre nom d'aventurier·e",autocomplete:"off"});nom.addEventListener("input",()=>set("nom",nom.value,false));
      const lib=el("input",{type:"text",id:"pronom-libre",maxlength:"24",value:P.pronomLibre,placeholder:"par ex. ielle, al",autocomplete:"off"});lib.addEventListener("input",()=>set("pronomLibre",lib.value,false));
      c=[el("div",{class:"champ-texte"},el("label",{for:"nom-perso"},"Nom"),nom),
        groupe("Pronom, pour que la guilde s'adresse à vous",PRONOMS,P.pronom,v=>set("pronom",v)),P.pronom==="libre"?el("div",{class:"champ-texte"},el("label",{for:"pronom-libre"},"Votre pronom"),lib):null,
        el("p",{class:"petit doux"},"Avec il, les textes s'accordent au masculin, avec elle au féminin ; sinon, en écriture inclusive (« Apprenti·e », « Compagnon·ne »)."),
        groupe("Espèce",Object.entries(ESPECES).map(([k,e])=>[k,e.l]),P.espece,v=>{S.perso.espece=v;const pe=ESPECES[v].peaux;if(!pe.includes(S.perso.peau))S.perso.peau=pe[0];maj();}),
        E.jambes?el("p",{class:"avis"},E.jambes==="blob"?"Les gélatineux·ses n'ont pas de jambes : bas et chaussures restent invisibles.":"Les spectres flottent : bas et chaussures restent invisibles."):null];}
    if(tab==="corps")c=[groupe("Silhouette",[["fine","Fine"],["moyenne","Moyenne"],["ronde","Ronde"]],P.silhouette,v=>set("silhouette",v)),groupe("Taille",[["petite","Petite"],["moyenne","Moyenne"],["grande","Grande"]],P.taille,v=>set("taille",v)),
      nuancier(P.espece==="renard"||P.espece==="felin"?"Pelage":P.espece==="saurien"?"Écailles":"Couleur de peau",E.peaux,P.peau,(v,libre)=>set("peau",v,!libre)),
      E.chapeauChampi?groupe("Chapeau de champignon",[["rouge","Rouge à pois"],["brun","Brun"],["bleu","Bleu luminescent"]],P.champi,v=>set("champi",v)):null];
    if(tab==="visage")c=[groupe("Yeux",Object.entries(YEUX),P.yeux,v=>set("yeux",v)),nuancier("Couleur des yeux",Object.values(IRIS),P.iris,(v,l)=>set("iris",v,!l),Object.keys(IRIS)),groupe("Bouche",Object.entries(BOUCHES),P.bouche,v=>set("bouche",v)),
      el("fieldset",{class:"reglage"},el("legend",{},"Détails"),el("div",{class:"opts"},bascule("Taches de rousseur",P.rousseur,v=>set("rousseur",v)),bascule("Vitiligo",P.vitiligo,v=>set("vitiligo",v)),bascule("Grain de beauté",P.grain,v=>set("grain",v)),bascule("Cicatrice",P.cicatrice,v=>set("cicatrice",v)),bascule("Joues roses",P.blush,v=>set("blush",v)))),
      groupe("Pilosité du visage",Object.entries(BARBES),P.barbe,v=>set("barbe",v)),
      el("fieldset",{class:"reglage"},el("legend",{},"Maquillage"),el("div",{class:"opts"},bascule("Eye-liner",P.eyeliner,v=>set("eyeliner",v)))),groupe("Fard pailleté",Object.entries(FARDS),P.fard,v=>set("fard",v)),groupe("Rouge à lèvres",Object.entries(LEVRES),P.levres,v=>set("levres",v)),
      el("fieldset",{class:"reglage"},el("legend",{},"Piercings"),el("div",{class:"opts"},bascule("Septum",P.septum,v=>set("septum",v)),bascule("Arcade",P.arcade,v=>set("arcade",v)),bascule("Oreilles",P.boucles,v=>set("boucles",v))))];
    if(tab==="cheveux")c=[E.chapeauChampi?el("p",{class:"avis"},"Le chapeau de champignon tient lieu de chevelure."):groupe("Coiffure",Object.entries(COIFFURES),P.coiffure,v=>set("coiffure",v)),
      nuancier("Teintes naturelles",Object.values(TEINTES_NAT).map(t=>t[1]),couleurCheveux(P)||"",v=>{const k=Object.keys(TEINTES_NAT).find(k=>TEINTES_NAT[k][1]===v);if(k)set("teinte",k);},Object.values(TEINTES_NAT).map(t=>t[0])),
      groupe("Teintures de l'échoppe",ITEMS.filter(i=>i.slot==="teinte").map(i=>[i.v,i.nom,i.id]),P.teinte,v=>set("teinte",v))];
    if(c.length&&tab==="cheveux"){const inp=c[1].querySelector("input[type=color]");if(inp)inp.remove();}
    if(tab==="tenue")c=[groupe("Haut",optsSlot("haut"),P.haut,v=>set("haut",v)),nuancier("Couleur du haut",COULEURS_TENUE,P.hautC,(v,l)=>set("hautC",v,!l)),
      ["robe-mage","robe-bal","salopette","costume"].includes(P.haut)?el("p",{class:"petit doux"},"Cette tenue couvre aussi le bas du corps."):null,
      groupe("Bas",optsSlot("bas"),P.bas,v=>set("bas",v)),nuancier("Couleur du bas",COULEURS_TENUE,P.basC,(v,l)=>set("basC",v,!l)),groupe("Jambes",optsSlot("jambes","Sans collants"),P.jambes,v=>set("jambes",v)),groupe("Chaussures",optsSlot("pieds"),P.pieds,v=>set("pieds",v))];
    if(tab==="accessoires")c=[groupe("Tête",optsSlot("tete","Rien"),P.tete,v=>set("tete",v)),groupe("Visage",optsSlot("visage","Rien"),P.visage,v=>set("visage",v)),groupe("Oreilles",optsSlot("oreilles","Celles de l'espèce"),P.oreilles,v=>set("oreilles",v)),groupe("Dos",optsSlot("dos","Rien"),P.dos,v=>set("dos",v)),groupe("En main",optsSlot("main","Rien"),P.main,v=>set("main",v))];
    if(tab==="familier"){const nm=el("input",{type:"text",id:"nom-fam",maxlength:"20",value:P.famNom,placeholder:"Son nom",autocomplete:"off"});nm.addEventListener("input",()=>set("famNom",nm.value,false));
      c=[groupe("Familier",[["","Aucun"],...optsSlot("familier")],P.familier,v=>set("familier",v)),groupe("Accessoire du familier",optsSlot("famAcc","Rien"),P.famAcc,v=>set("famAcc",v)),el("div",{class:"champ-texte"},el("label",{for:"nom-fam"},"Nom du familier"),nm),el("p",{class:"petit doux"},"Pendant les jeux, le familier saute de joie quand vous réussissez et se cache quand vous vous trompez.")];}
    if(tab==="gestes")c=[groupe("Attitude (toucher le personnage)",optsSlot("attitude"),P.attitude,v=>{set("attitude",v);sc.jouer("attitude",v);}),groupe("Animation de réussite",optsSlot("succes"),P.succes,v=>{set("succes",v);sc.jouer("succes",v);}),groupe("Animation d'erreur",optsSlot("erreur"),P.erreur,v=>{set("erreur",v);sc.jouer("erreur",v);}),
      el("fieldset",{class:"reglage"},el("legend",{},"Pendant les jeux"),el("div",{class:"opts"},bascule("Afficher mon personnage en bas de l'écran",P.compagnon,v=>set("compagnon",v))))];
    pan.replaceChildren(...c.filter(Boolean));}
  onglets();maj();
}

/* ---------- l'échoppe ---------- */
function vEchoppe(main,cat){
  cat=CATS.some(c=>c[0]===cat)?cat:"tenues";let essai=null;
  const sold=el("span",{class:"ecus"});const majSold=()=>sold.replaceChildren(sprite("piece",18),` ${fr(S.ecus)} écus`);majSold();
  main.append(el("section",{class:"cadre pile"},el("div",{class:"titre rangee"},sprite("coffre",36),el("div",{},el("span",{class:"oeil"},"L'échoppe de la guilde"),el("h1",{},"Tenues, accessoires et gestes"))),
    el("p",{},"Essayez avant d'acheter. Les écus se gagnent en révisant : 2 par bonne réponse, 20 par quête du jour, 40 de prime quand les trois quêtes sont faites, et davantage à l'Atelier de rédaction. Les objets marqués « haut fait » ne s'achètent pas : ils récompensent un exploit."),
    el("div",{class:"rangee"},sold,el("span",{class:"petit doux"},"Commun 50 · Rare 150 · Épique 400"),el("a",{class:"btn",href:"#loge"},sprite("miroir",20),"La loge"),el("a",{class:"btn",href:"#quetes"},sprite("trophee",20),"Hauts faits"))));
  const{cv,sc}=sceneCanvas(S.perso,{W:64,H:72,s:4,cx:12,cy:4,fx:1,fy:51,label:"Aperçu de l'essayage"});const leg=el("p",{class:"pix petit",style:"color:#e2e9ff"},"Votre tenue actuelle");
  const bR=el("button",{class:"btn mini"},"Retirer l'essai");bR.onclick=()=>{essai=null;sc.setPerso(S.perso);leg.textContent="Votre tenue actuelle";};
  const ap=el("div",{class:"cadre-nuit apercu",style:"padding:14px"},cv,leg,bR);
  const droite=el("section",{class:"cadre pile"});main.append(el("div",{class:"loge"},ap,droite));
  const nav=el("nav",{class:"onglets","aria-label":"Rayons"},CATS.map(([k,l])=>el("a",{class:"puce",href:"#echoppe-"+k,"aria-current":k===cat?"page":null},l)));
  const vit=el("div",{class:"vitrine"});droite.append(nav,vit);
  const essayer=it=>{if(["attitude","succes","erreur"].includes(it.slot)){sc.setPerso(S.perso);sc.jouer(it.slot,it.v);leg.textContent="Essai : "+it.nom;return;}essai=Object.assign({},S.perso,{[it.slot]:it.v});if(it.slot==="famAcc"&&!essai.familier)essai.familier="chat";sc.setPerso(essai);leg.textContent="Essai : "+it.nom;sc.jouer("divers","saut");};
  function carte(it){const own=possede(it.id),porte=S.perso[it.slot]===it.v;const hf=it.hf&&HF.find(h=>h.id===it.hf);
    let vis;if(it.slot==="familier")vis=vignetteFam(it.v,S.perso.famAcc);else if(it.slot==="famAcc")vis=vignetteFam(S.perso.familier||"chat",it.v);else if(ICONE_SLOT[it.slot])vis=el("div",{class:"icone-anim"},sprite(ICONE_SLOT[it.slot],40));else vis=vignette(Object.assign({},S.perso,{[it.slot]:it.v}),it.slot);
    const bE=el("button",{class:"btn mini"},"Essayer");bE.onclick=()=>essayer(it);let act;
    if(own){act=el("button",{class:"btn mini or"},porte?(SLOTS_OPTION.has(it.slot)?"Retirer":"Porté"):"Porter");act.disabled=porte&&!SLOTS_OPTION.has(it.slot);act.onclick=()=>{S.perso[it.slot]=porte?"":it.v;sauver();majPerso();sc.setPerso(S.perso);essai=null;leg.textContent="Votre tenue actuelle";rayon();};}
    else if(it.prix!=null){act=el("button",{class:"btn mini or",disabled:S.ecus<it.prix},`Acheter · ${it.prix}`);act.onclick=()=>{if(acheter(it)){S.perso[it.slot]=it.v;sauver();majPerso();sc.setPerso(S.perso);majSold();majHud();rayon();sc.jouer("succes",S.perso.succes);}};}
    else{const[a,b]=hf?hf.prog():[0,1];act=el("a",{class:"btn mini",href:"#quetes"},`Haut fait : ${hf?hf.nom:"?"} (${a}/${b})`);}
    return el("article",{class:`article${own?" possede":""}${porte?" porte":""}`},vis,el("b",{},it.nom),el("span",{class:`rarete r-${it.rar}`},NOM_RARETE[it.rar]),el("p",{},it.desc),own||it.prix==null?null:S.ecus<it.prix?el("p",{class:"petit"},`Il manque ${it.prix-S.ecus} écus.`):null,el("div",{class:"rangee"},bE,act));}
  function rayon(){const slots=CATS.find(c=>c[0]===cat)[2];vit.replaceChildren(...ITEMS.filter(i=>slots.includes(i.slot)).map(carte));majSold();}
  rayon();
}

/* ---------- quêtes du jour et hauts faits ---------- */
function vQuetes(main){
  const q=quetesDuJour();const auj=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
  main.append(el("section",{class:"cadre pile"},el("div",{class:"titre rangee"},sprite("trophee",36),el("div",{},el("span",{class:"oeil"},"Le tableau d'honneur"),el("h1",{},"Quêtes du jour et hauts faits"))),
    el("p",{},"Trois quêtes courtes chaque jour : chacune rapporte 20 écus et 30 XP, et les trois ensemble une prime de 40 écus. Les exercices longs de l'Atelier n'en font pas partie : ils forment un grand devoir par semaine, mieux récompensé. Les hauts faits récompensent la régularité et la maîtrise, parfois par un objet introuvable à l'échoppe."),
    el("div",{class:"rangee"},el("span",{class:"ecus"},sprite("piece",18),` ${fr(S.ecus)} écus`),el("span",{class:"pix"},`Série : ${serieActuelle()} jour${serieActuelle()>1?"s":""} d'affilée`),el("a",{class:"btn",href:"#echoppe"},sprite("coffre",20),"L'échoppe"))));
  main.append(el("section",{class:"cadre pile"},el("h2",{},`Quêtes du ${auj}`),el("div",{class:"quetes-j"},q.ids.map((id,i)=>{const d=QJ_ID[id];const ok=q.ok[i];
      return el("div",{class:"qj"+(ok?" fait":"")},sprite(ok?"gemme":"gemme0",28),el("div",{},el("b",{},d.t),el("div",{class:"jauge"},el("i",{style:`width:${Math.round(100*q.p[i]/d.n)}%`})),el("span",{class:"petit doux"},`${q.p[i]} / ${d.n}`)),el("div",{class:"gain-q"},ok?"Accomplie":el("a",{class:"btn mini",href:"#"+d.lien},"Y aller"),el("div",{},"+20 écus · +30 XP")));})),
    el("p",{class:"pix petit"},q.bonus?"Prime des trois quêtes obtenue (+40 écus).":"Prime de 40 écus quand les trois quêtes sont accomplies.")));
  main.append(blocDevoir());
  main.append(el("section",{class:"cadre pile"},el("h2",{},"Hauts faits"),el("p",{class:"petit doux"},`${Object.keys(S.hf).length} sur ${HF.length} obtenus.`),
    el("div",{class:"hauts-faits"},HF.map(h=>{const ob=S.hf[h.id];const[a,b]=h.prog();return el("div",{class:"hf"+(ob?" obtenu":"")},sprite("trophee",30),el("div",{class:"pile",style:"gap:4px"},el("b",{},h.nom),el("p",{},h.d),el("p",{class:"pix petit"},ob?`Obtenu le ${new Date(ob).toLocaleDateString("fr-FR")}`:`${fr(a)} / ${fr(b)}`),el("p",{class:"petit"},"Récompense : ",el("strong",{},libRecompense(h.rec)))));}))));
}

/* ---------- grand devoir de la semaine ---------- */
function blocDevoir(compact){const q=devoirSemaine(),D=DEVOIRS[q.type],s=q.sujet&&typeof SUJ_ID!=="undefined"?SUJ_ID[q.sujet]:null;
  const go=el("button",{class:"btn or",type:"button"},sprite("plume",20),q.ok?"Refaire un devoir":"Commencer ce devoir");go.onclick=commencerDevoir;
  return el("section",{class:"cadre pile devoir-semaine"+(q.ok?" fait":"")},el("span",{class:"oeil"},"Grand devoir de la semaine"),
    el("h2",{},D.t),el("p",{class:"petit"},D.d),
    s?el("p",{class:"sujet-choisi"},`« ${s.t} »`,el("small",{},`${EP_SUJ[s.ep]||""} · ${s.an}`)):null,
    el("p",{class:"pix petit"},q.ok?`Rendu le ${new Date(q.ok).toLocaleDateString("fr-FR")} : +${D.ecus} écus, +${D.xp} XP.`:`À rendre d'ici ${finDeSemaine()} · +${D.ecus} écus, +${D.xp} XP. Le sujet proposé n'est pas imposé : tout exercice de ce type rendu à l'Atelier compte.`),
    compact?null:el("p",{class:"petit doux"},"Le type alterne : deux semaines sur trois une dissertation complète, la troisième une question courte."),
    el("div",{class:"rangee"},go));}

/* ---------- carte du personnage (accueil) ---------- */
function carteAventurier(){const r=rang(),q=quetesDuJour();const{cv,sc}=sceneCanvas(S.perso,{W:56,H:68,s:2,cx:14,cy:2,fx:0,fy:52,fond:false,sol:false,label:"Votre personnage : "+descPerso()});cv.style.cursor="pointer";cv.onclick=()=>sc.jouer("attitude",S.perso.attitude);
  const k=cleJour(),fait=S.rituel[k];
  return el("section",{class:"cadre-nuit pile",style:"padding:14px"},el("span",{class:"oeil"},"Votre fiche d'aventurier·e"),
    el("div",{class:"carte-perso"},cv,el("div",{class:"pile",style:"gap:6px"},el("div",{class:"nom-perso"},S.perso.nom||"Sans nom"),el("div",{class:"pix",style:"color:#aab5dd"},`${nomRang(r.nom)} · ${r.xp} XP${r.suivant?` · encore ${r.reste} XP pour devenir ${nomRang(r.suivant)}`:""}`),
      el("div",{class:"barre-xp"},el("i",{style:`width:${Math.round(100*r.ratio)}%`})),el("span",{class:"ecus"},sprite("piece",16),` ${fr(S.ecus)} écus`),
      el("div",{class:"mini-quetes"},q.ids.map((id,i)=>el("span",{},sprite(q.ok[i]?"gemme":"gemme0",14),`${QJ_ID[id].t} (${q.p[i]}/${QJ_ID[id].n})`)),(()=>{const w=devoirSemaine();return el("span",{},sprite(w.ok?"gemme":"gemme0",14),`Devoir de la semaine : ${DEVOIRS[w.type].t.toLowerCase()}${w.ok?" (rendu)":""}`);})()))),
    el("p",{class:"pix",style:"font-size:.92rem"},`Quête du jour : ${fait?`accomplie, ${fait.score} / ${fait.total}`:"à accomplir"}${serieActuelle()?` · ${serieActuelle()} jour${serieActuelle()>1?"s":""} d'affilée`:""}`),
    el("div",{class:"rangee"},el("a",{class:"btn or",href:"#quete"},sprite("epee",20),fait?"Revoir la quête":"Partir en quête"),el("a",{class:"btn",href:"#loge"},sprite("miroir",20),"Personnage"),el("a",{class:"btn",href:"#echoppe"},sprite("coffre",20),"Échoppe"),el("a",{class:"btn",href:"#quetes"},sprite("trophee",20),"Hauts faits"),supaActif()&&!SAUVE.code?el("a",{class:"btn",href:"#sauvegarde"},sprite("cle",20),"Sauvegarder en ligne"):null));}
