/* =====================================================================
   La Guilde des SES · sauvegarde en ligne
   Code de sauvegarde secret et synchronisation avec Supabase.
   ===================================================================== */
"use strict";
const SAUVE={code:null,min:null,ecr:false,att:false,dernier:"",ok:null,erreur:""};
const CLE_CODE="guilde-ses-code";
const ALPHA_CODE="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const normCode=c=>String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"");
const codeValide=c=>/^[A-HJ-NP-Z2-9]{16}$/.test(normCode(c));
const joliCode=c=>normCode(c).replace(/(.{4})(?=.)/g,"$1-");
function genererCode(){const a=new Uint32Array(16);crypto.getRandomValues(a);return joliCode(Array.from(a,x=>ALPHA_CODE[x%32]).join(""));}
const enClaude=()=>!!(window.claude&&typeof window.claude.use==="function");
const supaActif=()=>typeof CONFIG!=="undefined"&&!!(CONFIG&&CONFIG.SUPABASE_URL&&CONFIG.SUPABASE_KEY)&&!enClaude();
async function rpcGuilde(fn,args,o={}){const k=CONFIG.SUPABASE_KEY;const h={"Content-Type":"application/json",apikey:k};if(k.startsWith("eyJ"))h.Authorization="Bearer "+k;let r;
  try{r=await fetch(CONFIG.SUPABASE_URL.replace(/\/+$/,"")+"/rest/v1/rpc/"+fn,{method:"POST",headers:h,body:JSON.stringify(args),keepalive:!!o.keepalive});}
  catch(e){throw new Error("Connexion impossible : vérifiez votre accès à Internet.");}
  const t=await r.text();let d=null;try{d=t?JSON.parse(t):null;}catch(e){d={message:t};}
  if(!r.ok){const m=(d&&(d.message||d.hint))||("Erreur "+r.status);if(/could not find the function|schema cache|PGRST202/i.test(m+" "+(d&&d.code)))throw new Error("La base n'est pas prête : lancez supabase.sql dans Supabase (SQL Editor → Run).");throw new Error(m);}
  return d;}
function fusionAtelier(items){if(!Array.isArray(items))return false;const vus=new Set(S.atelier.map(x=>x.t));let ajout=false;items.forEach(x=>{if(x&&x.t&&!vus.has(x.t)){S.atelier.push(x);ajout=true;}});S.atelier.sort((a,b)=>b.t-a.t);S.atelier=S.atelier.slice(0,10);return ajout;}
function appliquerDistant(d){const garde={brouillons:S.brouillons};
  S=Object.assign({m:{},rituel:{},serie:{last:null,n:0},best:{},theme:"nuit",filtres:null,xp:0},d.etat||{},garde);S.atelier=Array.isArray(d.atelier)?d.atelier.slice(0,10):[];S.maj=d.maj||S.maj;normaliser();
  try{localStorage.setItem(CLE,JSON.stringify(S));}catch(e){}SAUVE.dernier=etatPartage();appliquerTheme();majHud();majPerso();route();}
function planifierSauvegarde(){if(!SAUVE.code||!supaActif())return;clearTimeout(SAUVE.min);SAUVE.min=setTimeout(()=>pousserCode(),2500);}
async function pousserCode(o={}){if(!SAUVE.code||!supaActif())return false;if(SAUVE.ecr){SAUVE.att=true;return false;}const s=etatPartage();if(s===SAUVE.dernier&&!o.force)return true;SAUVE.ecr=true;let ok=false;
  try{const r=await rpcGuilde("guilde_enregistrer",{p_code:SAUVE.code,p_etat:JSON.parse(s),p_maj:S.maj||Date.now()},o);
    if(r&&r.ok===false){const d=await rpcGuilde("guilde_lire",{p_code:SAUVE.code});if(d){appliquerDistant(d);toast("Progression mise à jour","Un autre appareil avait enregistré plus récemment.","cle");}}
    else{SAUVE.dernier=s;SAUVE.ok=Date.now();SAUVE.erreur="";ok=true;}}
  catch(e){SAUVE.erreur=e.message;}
  finally{SAUVE.ecr=false;majEtatSauvegarde();if(SAUVE.att){SAUVE.att=false;planifierSauvegarde();}}
  return ok;}
async function pousserAtelierCode(){if(!SAUVE.code||!supaActif())return;try{await pousserCode({force:true});await rpcGuilde("guilde_enregistrer_atelier",{p_code:SAUVE.code,p_atelier:S.atelier.slice(0,10)});}catch(e){SAUVE.erreur=e.message;majEtatSauvegarde();}}
async function verifierDistant(){if(!SAUVE.code||SAUVE.ecr)return;try{const d=await rpcGuilde("guilde_lire",{p_code:SAUVE.code});if(d&&(d.maj||0)>(S.maj||0))appliquerDistant(d);}catch(e){}}
async function initSauvegarde(){if(!supaActif())return;let c=null;try{c=localStorage.getItem(CLE_CODE);}catch(e){}
  document.addEventListener("visibilitychange",()=>{if(!SAUVE.code)return;if(document.visibilityState==="hidden"){if(etatPartage()!==SAUVE.dernier)pousserCode({keepalive:true});}else verifierDistant();});
  if(!codeValide(c)){majEtatSauvegarde();return;}SAUVE.code=joliCode(c);
  try{const d=await rpcGuilde("guilde_lire",{p_code:SAUVE.code});
    if(d&&(d.maj||0)>(S.maj||0))appliquerDistant(d);
    else{if(d&&fusionAtelier(d.atelier)){try{localStorage.setItem(CLE,JSON.stringify(S));}catch(e){}}await pousserCode({force:!d});}}
  catch(e){SAUVE.erreur=e.message;}
  majEtatSauvegarde();}
function retenirCode(c){SAUVE.code=c?joliCode(c):null;try{if(c)localStorage.setItem(CLE_CODE,SAUVE.code);else localStorage.removeItem(CLE_CODE);}catch(e){}}
function etatSauvegardeTexte(){if(enClaude())return "Sur claude.ai, la progression est sauvegardée sur votre compte Claude.";if(!supaActif())return "Sauvegarde en ligne non configurée : la progression reste dans ce navigateur.";
  if(!SAUVE.code)return "Progression gardée dans ce navigateur seulement.";if(SAUVE.erreur)return "Dernier envoi impossible : "+SAUVE.erreur;
  return SAUVE.ok?`Sauvegardée en ligne à ${new Date(SAUVE.ok).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}.`:"Sauvegarde en ligne active.";}
function majEtatSauvegarde(){majPied();const z=$("#etat-sauvegarde");if(z)z.textContent=etatSauvegardeTexte();}

function vSauvegarde(main){
  const z=el("p",{class:"pix",id:"etat-sauvegarde",role:"status"},etatSauvegardeTexte());
  main.append(el("section",{class:"cadre pile"},el("div",{class:"titre rangee"},sprite("cle",36),el("div",{},el("span",{class:"oeil"},"Le coffre de la guilde"),el("h1",{},"Sauvegarde et code secret"))),
    el("p",{},"Pas de compte, pas d'e-mail : un code secret de 16 caractères suffit à retrouver votre progression, vos écus, votre personnage et vos copies sur n'importe quel appareil. Gardez-le pour vous : qui connaît le code a accès à la progression."),z));
  if(enClaude()||!supaActif()){main.append(el("section",{class:"cadre pile"},el("p",{},enClaude()?"Cette version du site tourne dans claude.ai : la progression y est déjà enregistrée sur votre compte Claude. Le code de sauvegarde sert sur la version publique du site.":"Pour activer la sauvegarde en ligne, renseignez js/config.js (voir le README).")));return;}
  const zone=el("section",{class:"cadre pile"});const zone2=el("section",{class:"cadre pile"});main.append(zone,zone2);
  function dessine(){
    if(SAUVE.code){const bC=el("button",{class:"btn or"},"Copier le code");const m=el("span",{class:"petit",role:"status"});bC.onclick=async()=>{try{await navigator.clipboard.writeText(SAUVE.code);m.textContent="Code copié.";}catch(e){m.textContent="Sélectionnez le code et copiez-le.";}};
      const bS=el("button",{class:"btn"},"Sauvegarder maintenant");bS.onclick=async()=>{bS.disabled=true;await pousserCode({force:true});bS.disabled=false;};
      const bO=el("button",{class:"btn mini"},"Oublier ce code sur cet appareil");bO.onclick=()=>{if(!bO.dataset.ok){bO.dataset.ok="1";bO.textContent="Confirmer : j'ai noté mon code";setTimeout(()=>{delete bO.dataset.ok;bO.textContent="Oublier ce code sur cet appareil";},4000);return;}retenirCode(null);SAUVE.erreur="";majEtatSauvegarde();dessine();};
      zone.replaceChildren(el("span",{class:"oeil"},"Votre code"),el("p",{class:"code-sauvegarde",tabindex:"0"},SAUVE.code),el("div",{class:"rangee"},bC,bS,m),el("p",{class:"petit doux"},"Notez-le dans un endroit sûr (gestionnaire de mots de passe, carnet). La guilde ne peut pas le retrouver pour vous : elle n'en conserve qu'une empreinte."),bO);}
    else{const bN=el("button",{class:"btn or"},sprite("cle",20),"Créer mon code de sauvegarde");const m=el("p",{class:"petit",role:"status"});
      bN.onclick=async()=>{bN.disabled=true;m.textContent="Création…";const c=genererCode();retenirCode(c);const ok=await pousserCode({force:true});if(!ok){retenirCode(null);m.textContent="Impossible de créer le code : "+(SAUVE.erreur||"réessayez.");bN.disabled=false;return;}toast("Code de sauvegarde créé","Notez-le : il retrouve votre progression partout.","cle");dessine();};
      zone.replaceChildren(el("span",{class:"oeil"},"Nouveau code"),el("p",{},"Votre progression actuelle sera enregistrée en ligne, puis à chaque bonne réponse, quelques secondes plus tard."),bN,m);}
    const inp=el("input",{type:"text",id:"code-existant",autocomplete:"off",autocapitalize:"characters",spellcheck:"false",placeholder:"XXXX-XXXX-XXXX-XXXX",maxlength:"24",style:"font-family:var(--f-pixel);letter-spacing:.12em"});
    const bR=el("button",{class:"btn"},"Récupérer ma progression");const m2=el("div",{class:"pile",role:"status",style:"gap:8px"});
    bR.onclick=async()=>{const c=inp.value;if(!codeValide(c)){m2.replaceChildren(el("p",{class:"petit"},"Ce code n'a pas le bon format : 16 caractères, lettres et chiffres (sans I, O, 0 ni 1)."));return;}
      bR.disabled=true;m2.replaceChildren(el("p",{class:"petit"},"Recherche…"));let d=null;try{d=await rpcGuilde("guilde_lire",{p_code:c});}catch(e){m2.replaceChildren(el("p",{class:"petit"},e.message));bR.disabled=false;return;}bR.disabled=false;
      if(!d){m2.replaceChildren(el("p",{class:"petit"},"Aucune sauvegarde ne correspond à ce code."));return;}
      const quand=d.modifie_le?new Date(d.modifie_le).toLocaleString("fr-FR",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"}):"";const xp=(d.etat&&d.etat.xp)||0;
      const appliquer=()=>{retenirCode(c);appliquerDistant(d);SAUVE.ok=Date.now();SAUVE.erreur="";majEtatSauvegarde();toast("Progression récupérée",`${fr(xp)} XP, sauvegarde du ${quand}.`,"cle");};
      const locale=(S.xp||0)>0||Object.keys(S.m||{}).length>0;
      if(!locale){appliquer();return;}
      const bOui=el("button",{class:"btn or"},"Remplacer la progression de cet appareil");bOui.onclick=appliquer;
      m2.replaceChildren(el("p",{class:"avis"},`Sauvegarde trouvée : ${fr(xp)} XP, enregistrée le ${quand}. Elle remplacera la progression de cet appareil (${fr(S.xp||0)} XP).`),bOui);};
    zone2.replaceChildren(el("span",{class:"oeil"},"J'ai déjà un code"),el("label",{for:"code-existant",class:"petit"},"Tapez votre code pour retrouver votre progression sur cet appareil :"),el("div",{class:"rangee"},inp,bR),m2);}
  dessine();
}
