# Architecture de la Guilde des SES

## Principes

1. **Un site statique, sans framework ni dépendance.** Du HTML, du CSS et des scripts JavaScript classiques, servis tels quels par GitHub Pages. Le seul outil, `outils/construire.py`, regénère `js/donnees.js` après une modification du contenu.
2. **Tout est sourcé.** Chaque fiche porte ses liens de source ; une fiche non vérifiée l'affiche (« source à confirmer ») avec un lien de recherche.
3. **Aucune donnée personnelle.** Pas de compte ni d'e-mail : un code de sauvegarde tiré au sort, dont la base ne garde que l'empreinte.
4. **Aucune IA appelée par le site.** L'Atelier prépare une consigne ; la personne choisit son IA.

## Les fichiers

```
index.html               page unique ; l'ancre (#nom) choisit la vue
css/guilde.css           thème pixel (cadres 9-slice en SVG), jeux, personnage, atelier
js/donnees.js            GÉNÉRÉ : const DATA = {...} (ne pas modifier à la main)
js/config.js             URL et clé publique Supabase
js/jeux.js               état S, outils, sprites, fiches, questions, mini-jeux, accueil, chapitres
js/personnage.js         rendu pixel du personnage (calques, contour automatique) et des familiers
js/economie.js           catalogue de l'échoppe, scène animée, écus, quêtes du jour, hauts faits,
                         compagnon, sauvegarde sur le compte Claude (version claude.ai)
js/pages-personnage.js   la loge, l'échoppe, les quêtes, la carte d'aventurier·e
js/atelier.js            sujets, pré-diagnostic, consigne de correction, import de la réponse
js/sauvegarde.js         code de sauvegarde et synchronisation Supabase
js/navigation.js         menu, thème jour/nuit, routage, démarrage
donnees/*.json           le contenu : une fiche par ligne
supabase.sql             tables et fonctions de la sauvegarde (relançable)
outils/construire.py     regénère js/donnees.js ; --claude produit dist/guilde-ses-claude.html
outils/tester.py         tests de bout en bout (Playwright)
```

Les scripts partagent la même portée globale et se chargent **dans cet ordre** : chacun peut utiliser ce que les précédents définissent au chargement, et n'importe quelle fonction une fois la page démarrée.

## Le contenu (`donnees/`)

| Fichier | Une ligne = | Champs principaux |
|---|---|---|
| `auteurs.json` | une œuvre | `auteur`, `court`, `oeuvre`, `annee`, `idee`, `concept`, `courant`, `disc`, `chap`, `jury`, `src`, `verif` |
| `notions.json` | une notion | `terme`, `mot` (forme pour la grille), `def` |
| `dates.json` | un repère | `annee`, `date`, `evenement`, `detail` |
| `mecanismes.json` | un mécanisme | `titre`, `etapes` (dans l'ordre) |
| `chiffres.json` | un chiffre clé | `indicateur`, `valeur`, `unite`, `affichage`, `periode`, `champ`, `precision` |
| `programme.json` | — | `chapitres` (questions officielles), `programmes` et `officiel` (liens des textes) |

Communs à toutes les fiches : `id` (unique, `a001`, `n001`, `d001`, `m01`, `c01`), `disc` (`eco`, `socio`, `sp`, `epi`), `chap` (chapitres du programme : `2-E1`, `1-S3`, `T-RC2`, `HP`…), `src` (liste de `{l, u}`), `verif` (source vérifiée), `recherche` (lien de recherche quand `verif` est faux).

Après une modification : `python3 outils/construire.py`, puis `python3 outils/tester.py`.

## L'état d'une personne (`S`)

Tout tient dans un objet `S`, enregistré dans `localStorage` (clé `grimoire-lunaire-ses-v1`) à chaque changement :

- `m` : maîtrise par fiche, `{b: boîte 0-4, v: vues, j: justes, t: date}` (répétition espacée : une fiche est maîtrisée à partir de la boîte 3) ;
- `xp`, `ecus`, `inv` (objets achetés), `perso` (personnage), `hf` (hauts faits), `qj` (quêtes du jour), `st` (statistiques) ;
- `rituel` (quêtes du jour faites), `serie`, `best`, `theme`, `filtres` ;
- `atelier` (10 dernières copies), `brouillons` (copies en cours, jamais envoyées) ;
- `maj` : date de la dernière modification, qui arbitre entre deux appareils.

Les jeux émettent des événements (`reponse`, `partie`, `calcul`, `mot`, `quete`, `atelier`) ; `js/economie.js` les écoute pour les écus, les quêtes du jour et les hauts faits.

## La sauvegarde en ligne

```
navigateur                                   Supabase (projet partagé, préfixe guilde_)
──────────                                   ────────────────────────────────────────
code tiré au sort (16 car., 80 bits)
  └─ rpc guilde_enregistrer(code, état, maj) ─→ empreinte SHA-256 du code
                                                 n'écrase jamais une sauvegarde plus récente
  └─ rpc guilde_lire(code) ─────────────────→  état, maj, atelier (null si inconnu)
  └─ rpc guilde_enregistrer_atelier(code, …) →  historique de l'Atelier
```

- La table `guilde_progression` a la sécurité par ligne activée sans aucune politique : on ne la lit et ne l'écrit qu'à travers ces trois fonctions (`security definer`), seules exposées au rôle `anon`.
- Garde-fous pour une base partagée : 150 Ko par sauvegarde, 100 Ko d'historique, 2 000 sauvegardes au plus, 60 créations par heure.
- Le navigateur envoie l'état 2,5 s après un changement, et en quittant la page ; il relit la base quand la page revient au premier plan. Si un autre appareil a enregistré plus récemment, sa version l'emporte.
- Sur claude.ai, la même page enregistre plutôt sur le compte Claude (`js/economie.js`, capacité `db`).

## L'Atelier de rédaction

`consigneCorrection()` (dans `js/atelier.js`) assemble : le cadre de l'épreuve (bac + 3 ou bac + 5), les attentes du rapport du jury 2026, le barème de l'exercice, des repères de notation, les fiches les plus proches du sujet et de la copie (identifiant et résumé), le pré-diagnostic et la copie, présentée comme une donnée à évaluer. L'IA doit répondre par un objet JSON : `criteres`, `appreciation`, `points_forts`, `a_ameliorer`, `erreurs`, `attendu`, `fiches`, `conseil`.

`extraireJSON()` retrouve cet objet dans la réponse collée (avec ou sans bloc de code), `validerCorrection()` le contrôle : points bornés par le barème, **note recalculée** à partir des critères, fiches limitées aux identifiants existants. Une réponse illisible peut être gardée telle quelle dans l'historique.

Sur claude.ai, un bouton supplémentaire fait corriger directement par Claude (capacité `sample`).

## La version claude.ai

`python3 outils/construire.py --claude` produit `dist/guilde-ses-claude.html` : un seul fichier, styles et scripts intégrés, sans `js/config.js`. Les fonctions propres à claude.ai (`window.claude`) ne s'activent que là.
