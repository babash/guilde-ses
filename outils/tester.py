#!/usr/bin/env python3
"""Tests de bout en bout de la Guilde des SES, dans un vrai navigateur.

    pip install playwright && playwright install chromium
    python3 outils/tester.py            # CHROME=/chemin/vers/chrome pour un autre navigateur

Les fonctions Supabase sont simulées en mémoire (même logique que supabase.sql) :
aucun appel réseau n'est fait vers la vraie base.
"""
import asyncio
import hashlib
import json
import os
import pathlib
import re
import sys

from playwright.async_api import async_playwright

RACINE = pathlib.Path(__file__).resolve().parent.parent
URL = (RACINE / "index.html").as_uri()
ROUTES = ["accueil", "loge", "echoppe", "echoppe-chapeaux", "echoppe-familiers", "quetes", "sauvegarde",
          "atelier", "atelier-intro", "atelier-question", "atelier-dissertation", "quete",
          "joute-ecoles", "joute-riposte", "joute-plan", "paires-notions", "paires-dates", "sceaux",
          "bibliotheque-idees", "bibliotheque-oeuvres", "grille-notions", "grille-auteurs", "grille-oeuvres",
          "chronique-debats", "chronique-chapitre", "duel", "forge-ordre", "forge-faux", "faussaire", "enigme",
          "balance-valeurs", "balance-plus-moins", "comptoir-calculs", "comptoir-lecture", "codex", "archives",
          "ch-1-s1", "ch-t-e3", "paires-auteurs"]
ECHECS = []


def verifier(cond, msg):
    print(("  ok  " if cond else "  ÉCHEC ") + msg)
    if not cond:
        ECHECS.append(msg)


class FausseBase:
    """Les trois fonctions de supabase.sql, en mémoire."""
    def __init__(self):
        self.lignes = {}

    @staticmethod
    def empreinte(code):
        c = re.sub(r"[^A-Za-z0-9]", "", code or "").upper()
        if not re.fullmatch(r"[A-HJ-NP-Z2-9]{16}", c):
            raise ValueError("Code de sauvegarde invalide")
        return hashlib.sha256(c.encode()).hexdigest()

    def appeler(self, fn, a):
        e = self.empreinte(a.get("p_code"))
        r = self.lignes.get(e)
        if fn == "guilde_lire":
            return None if r is None else {"etat": r["etat"], "maj": r["maj"], "atelier": r["atelier"], "modifie_le": "2026-11-08T08:00:00Z"}
        if fn == "guilde_enregistrer":
            if r and r["maj"] > a["p_maj"]:
                return {"ok": False, "maj": r["maj"]}
            self.lignes[e] = {"etat": a["p_etat"], "maj": a["p_maj"], "atelier": (r or {}).get("atelier", [])}
            return {"ok": True, "maj": a["p_maj"]}
        if fn == "guilde_enregistrer_atelier":
            if not r:
                return False
            r["atelier"] = a["p_atelier"]
            return True
        raise ValueError(fn)


async def brancher(page, base):
    async def rpc(route):
        fn = route.request.url.rsplit("/", 1)[-1]
        try:
            corps = base.appeler(fn, json.loads(route.request.post_data or "{}"))
            await route.fulfill(status=200, content_type="application/json", body=json.dumps(corps))
        except ValueError as e:
            await route.fulfill(status=400, content_type="application/json", body=json.dumps({"message": str(e)}))
    await page.route("**/rest/v1/rpc/*", rpc)
    await page.route(re.compile(r"https://fonts\.(googleapis|gstatic)\.com/.*"), lambda r: r.abort())


async def nouvelle_page(nav, base, largeur=1280):
    ctx = await nav.new_context(viewport={"width": largeur, "height": 900})
    await ctx.grant_permissions(["clipboard-read", "clipboard-write"])
    page = await ctx.new_page()
    erreurs = []
    page.on("pageerror", lambda e: erreurs.append(str(e)))
    await brancher(page, base)
    await page.goto(URL)
    await page.wait_for_timeout(400)
    return ctx, page, erreurs


async def aller(page, route):
    await page.evaluate(f"location.hash='#{route}'")
    await page.wait_for_timeout(250)


async def main():
    base = FausseBase()
    async with async_playwright() as p:
        opts = {"executable_path": os.environ["CHROME"], "args": ["--no-sandbox"]} if os.environ.get("CHROME") else {}
        nav = await p.chromium.launch(**opts)

        print("1. Toutes les pages, sur ordinateur et sur téléphone")
        for largeur in (1280, 390):
            ctx, page, erreurs = await nouvelle_page(nav, base, largeur)
            for r in ROUTES:
                await aller(page, r)
                deborde = await page.evaluate("document.documentElement.scrollWidth > innerWidth + 1")
                mots = (await page.evaluate("document.body.innerText")).split()
                verifier(not deborde, f"{largeur}px #{r} sans débordement horizontal") if deborde else None
                if any(m in ("null", "undefined", "NaN") for m in mots):
                    verifier(False, f"{largeur}px #{r} : texte « null / undefined / NaN » affiché")
            verifier(not erreurs, f"{largeur}px : aucune erreur JavaScript {erreurs[:2] if erreurs else ''}")
            await ctx.close()

        print("2. Une bonne réponse rapporte XP et écus")
        ctx, page, erreurs = await nouvelle_page(nav, base)
        await aller(page, "quete")
        avant = await page.evaluate("[S.xp, S.ecus]")
        bon = await page.evaluate("(()=>{const b=[...document.querySelectorAll('.choix button')];return b.findIndex(x=>x.dataset.bon==='1')})()")
        if bon < 0:  # les boutons ne portent pas la réponse : on essaie chacun jusqu'à une bonne réponse
            for i in range(4):
                await page.locator(".choix button").nth(i).click()
                await page.wait_for_timeout(150)
                if (await page.evaluate("S.xp")) > avant[0]:
                    break
                await aller(page, "accueil"); await aller(page, "quete")
        apres = await page.evaluate("[S.xp, S.ecus]")
        verifier(apres[0] >= avant[0] and apres[1] >= avant[1], f"XP {avant[0]} → {apres[0]}, écus {avant[1]} → {apres[1]}")

        print("3. Code de sauvegarde : création puis récupération sur un autre appareil")
        await page.evaluate("S.xp=1234;S.ecus=777;S.perso.nom='Lysandre';sauver()")
        await aller(page, "sauvegarde")
        await page.locator("button:has-text('Créer mon code')").click()
        await page.wait_for_timeout(800)
        code = (await page.locator(".code-sauvegarde").inner_text()).strip()
        verifier(re.fullmatch(r"[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){3}", code) is not None, f"code affiché {code}")
        verifier(len(base.lignes) == 1, "une sauvegarde enregistrée dans la base")
        ctx2, page2, err2 = await nouvelle_page(nav, base)
        await aller(page2, "sauvegarde")
        await page2.fill("#code-existant", code.lower().replace("-", " "))
        await page2.locator("button:has-text('Récupérer')").click()
        await page2.wait_for_timeout(800)
        etat = await page2.evaluate("[S.xp, S.ecus, S.perso.nom]")
        verifier(etat == [1234, 777, "Lysandre"], f"progression retrouvée {etat}")
        await page2.evaluate("S.xp=1300;sauver()")
        await page2.wait_for_timeout(3200)
        verifier(next(iter(base.lignes.values()))["etat"].get("xp") == 1300, "envoi automatique quelques secondes après un changement")
        verifier(not err2, "aucune erreur JavaScript sur le second appareil")
        await ctx2.close()

        print("4. Atelier : consigne copiée, réponse d'une IA collée")
        await aller(page, "atelier-plan")
        await page.fill("#champ-problematique", "La croissance économique est-elle souhaitable en toutes circonstances ?")
        await page.fill("#champ-plan", "I. La croissance améliore le niveau de vie\nA. PIB par habitant\nB. Innovation (Schumpeter)\nII. Mais elle n'est pas toujours souhaitable\nA. Bien-être (Easterlin)\nB. Environnement (Meadows)")
        await page.locator("button:has-text('Copier la consigne')").click()
        await page.wait_for_timeout(300)
        consigne = await page.evaluate("navigator.clipboard.readText()")
        verifier("<copie>" in consigne and "Schumpeter" in consigne and "Barème" in consigne, f"consigne complète copiée ({len(consigne)} caractères)")
        reponse = "Voici la correction :\n```json\n" + json.dumps({
            "analyse_sujet": {"termes": ["croissance", "souhaitable", "toujours"], "enjeu": "Juger la désirabilité.", "pieges": ["traiter les causes"]},
            "criteres": [{"nom": "Analyse du sujet et définition des termes", "points": 2, "sur": 4, "commentaire": "Termes peu définis."},
                         {"nom": "Problématique", "points": 3, "sur": 5, "commentaire": "Correcte."},
                         {"nom": "Logique démonstrative et équilibre du plan", "points": 4, "sur": 7, "commentaire": "Oui/mais."},
                         {"nom": "Connaissances mobilisées dans le plan", "points": 2, "sur": 4, "commentaire": "Niveau lycée."}],
            "note": 11, "appreciation": "Copie correcte.", "points_forts": ["Plan clair"], "a_ameliorer": ["Définir les termes"],
            "erreurs": [], "attendu": "I. A. B. II. A. B.", "fiches": ["a030"], "conseil": "Définissez chaque terme."}, ensure_ascii=False) + "\n```"
        await page.fill("#reponse-ia", reponse)
        await page.locator("button:has-text('Afficher la correction')").click()
        await page.wait_for_timeout(400)
        verifier(await page.locator(".note-finale").count() == 1, "correction affichée avec sa note")
        verifier((await page.evaluate("S.atelier[0] && S.atelier[0].note")) == 11, "note recalculée à partir du barème et gardée dans l'historique")
        verifier(not erreurs, "aucune erreur JavaScript")
        await ctx.close()

        print("5. Jeux refondus : joute, devoir de la semaine, mots fléchés, forge, lecture de tableaux")
        ctx, page, erreurs = await nouvelle_page(nav, base, 390)
        for mode in ("ecoles", "riposte"):
            await aller(page, "joute-" + mode)
            await page.locator(".joute .choix button").nth(0).click()
            await page.wait_for_timeout(150)
            verifier(await page.locator(".carte-debat").count() == 1, f"joute « {mode} » : carte du débat affichée après la passe")
        await aller(page, "joute-plan")
        for _ in range(3):
            await page.locator(".joute .pile > .etape").nth(0).click()
        await page.locator("button:has-text('Vérifier le plan')").click()
        await page.wait_for_timeout(150)
        verifier(await page.locator(".plan-debat").count() == 1, "joute « plan » : plan corrigé et logique du dépassement affichés")
        ripostes = await page.evaluate("DEBATS.every(j=>new Set(j.positions.map(p=>p.objection)).size===j.positions.length)")
        verifier(ripostes, "chaque objection est propre à une position")
        devoir = await page.evaluate("""(()=>{S.qs={k:cleSemaine(),type:"dissertation",sujet:"s1",ok:0};const e0=S.ecus;
            emit("atelier",{note:12,exo:"plan"});const apresPlan=S.qs.ok;emit("atelier",{note:12,exo:"dissertation"});
            return [apresPlan, !!S.qs.ok, S.ecus-e0, QJ.some(q=>q.ev==="atelier")];})()""")
        verifier(devoir[0] == 0 and devoir[1] and devoir[2] >= 150 and not devoir[3],
                 f"devoir de la semaine : un plan ne compte pas, la dissertation oui (+{devoir[2]} écus), l'Atelier hors des quêtes du jour")
        grilles = await page.evaluate("""(()=>{const out=[];for(const mode of ["notions","auteurs","oeuvres"])for(let i=0;i<6;i++){
            const mots=mode==="notions"?DB.notions.filter(x=>x.mot&&x.indice&&x.mot.length<=12).map(x=>({w:x.mot,x,id:x.id,indice:x.indice})):motsAuteurs(DB.auteurs,mode);
            const G=genFleches(tirer(mots,60),{essais:35,cible:18});const fuite=G.places.some(p=>sansAccent(p.m.indice).toUpperCase().replace(/[^A-Z]/g," ").split(" ").includes(p.w||p.m.w));
            out.push([G.places.length,G.W,G.H,fuite,G.places.every(p=>p.n)]);}return out;})()""")
        verifier(all(g[0] >= 10 and g[1] <= 13 and g[2] <= 13 and not g[3] and g[4] for g in grilles),
                 f"mots fléchés : {min(g[0] for g in grilles)} à {max(g[0] for g in grilles)} mots par grille, 13 × 13 au plus, aucun indice ne contient sa réponse")
        await aller(page, "forge-faux")
        await page.locator(".chaine .etape").nth(0).click()
        await page.wait_for_timeout(100)
        verifier(await page.locator(".pourquoi").count() == 1, "forge : le maillon faux est expliqué")
        lectures = await page.evaluate("(()=>{let ok=true;for(let i=0;i<60;i++)for(const g of LECTURES){const o=g();if(o.opts.filter(x=>x.ok).length!==1||new Set(o.opts.map(x=>x.t)).size!==4)ok=false;}return ok;})()")
        verifier(lectures, "lecture de tableaux : une seule phrase exacte, quatre phrases distinctes")
        duel = await page.evaluate("(()=>{for(let i=0;i<200;i++){const q=qDuel(R0,DB.auteurs.concat(DB.dates),10);if((q.oeuvre.annee<q.evt.annee?0:1)!==q.bon||q.oeuvre.annee===q.evt.annee)return false;}return true;})()")
        verifier(duel, "duel : la réponse correspond toujours aux dates")
        verifier(not erreurs, f"aucune erreur JavaScript {erreurs[:2] if erreurs else ''}")
        await ctx.close()
        await nav.close()
    print("\n" + ("TOUT EST BON" if not ECHECS else f"{len(ECHECS)} ÉCHEC(S)"))
    sys.exit(1 if ECHECS else 0)


if __name__ == "__main__":
    asyncio.run(main())
