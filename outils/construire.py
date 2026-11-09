#!/usr/bin/env python3
"""Construit les fichiers générés de la Guilde des SES.

    python3 outils/construire.py            # js/donnees.js à partir de donnees/*.json
    python3 outils/construire.py --claude   # en plus : dist/guilde-ses-claude.html,
                                            # la version en un seul fichier pour claude.ai

Aucune dépendance : Python 3.8 ou plus suffit.
"""
import json
import pathlib
import re
import sys

RACINE = pathlib.Path(__file__).resolve().parent.parent
FICHES = (("auteurs", "auteurs"), ("notions", "notions"), ("dates", "dates"),
          ("mecanismes", "mecas"), ("chiffres", "chiffres"))


def lire(nom):
    return json.loads((RACINE / "donnees" / nom).read_text("utf-8"))


def donnees():
    d = {cle: lire(f"{nom}.json") for nom, cle in FICHES}
    p = lire("programme.json")
    d.update(chapitres=p["chapitres"], programmes=p["programmes"], officiel=p["officiel"])
    d["meta"] = lire("meta.json")
    ids = [x["id"] for nom, cle in FICHES for x in d[cle]]
    doublons = sorted({i for i in ids if ids.count(i) > 1})
    if doublons:
        sys.exit(f"Identifiants en double : {', '.join(doublons)}")
    return d


def ecrire_donnees(d):
    js = ("// Fichier généré par outils/construire.py à partir de donnees/*.json : ne pas modifier à la main.\n"
          "const DATA = " + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + ";\n")
    (RACINE / "js" / "donnees.js").write_text(js, "utf-8")
    n = sum(len(d[cle]) for _, cle in FICHES)
    v = sum(1 for _, cle in FICHES for x in d[cle] if x.get("verif"))
    print(f"js/donnees.js : {n} fiches, dont {v} à source vérifiée ({round(100 * v / n)} %).")


def version_claude():
    """Un seul fichier HTML (styles et scripts intégrés), sans la configuration Supabase :
    sur claude.ai, la progression est enregistrée sur le compte Claude."""
    html = (RACINE / "index.html").read_text("utf-8")
    css = (RACINE / "css" / "guilde.css").read_text("utf-8")
    html = html.replace('<link rel="stylesheet" href="css/guilde.css">', "<style>\n" + css + "\n</style>")

    def script(m):
        nom = m.group(1)
        if nom == "config":
            return ""
        code = (RACINE / "js" / f"{nom}.js").read_text("utf-8").replace("</", "<\\/")
        return "<script>\n" + code + "</script>\n"

    html = re.sub(r'<script src="js/([a-z-]+)\.js"></script>\n', script, html)
    sortie = RACINE / "dist" / "guilde-ses-claude.html"
    sortie.parent.mkdir(exist_ok=True)
    sortie.write_text(html, "utf-8")
    print(f"{sortie.relative_to(RACINE)} : {len(html.encode('utf-8')) // 1024} Kio.")


if __name__ == "__main__":
    ecrire_donnees(donnees())
    if "--claude" in sys.argv:
        version_claude()
