#!/usr/bin/env python3
"""Réécrit donnees/*.json au format du dépôt : une fiche par ligne (diffs lisibles)."""
import json, pathlib, sys
RACINE = pathlib.Path(__file__).resolve().parent.parent
for nom in sys.argv[1:] or ["auteurs", "notions", "dates", "mecanismes", "chiffres"]:
    p = RACINE / "donnees" / f"{nom}.json"
    d = json.loads(p.read_text("utf-8"))
    p.write_text("[\n" + ",\n".join(json.dumps(x, ensure_ascii=False) for x in d) + "\n]\n", "utf-8")
    print(p.name, len(d))
