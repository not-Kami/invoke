# Agents — Invoke

Racine utile : ce dossier. `client/` et `server/` sont les deux apps. Le suivi Atelier vit à la racine.

<!-- atelier-journal:v1 -->
## Journal Atelier (obligatoire)

Avant de commencer, dans **ce dossier** : lire `JOURNAL.md` (dernières entrées), puis `TODO.md` et `NEXT.md`.
Avant de partir : **ajouter** une entrée en bas de `JOURNAL.md` (ne jamais réécrire le fichier entier).
Template : `Hub/templates/dossier/SESSION.md`.

`client/TODO.md` et `Docs/TODO.md` sont les archives du TFE. La source de vérité est `TODO.md` à la racine.

## Méthode du repo

Deux lignes. On ne mélange pas une vitrine fictive et la bêta dans le même commit.

| Branche | Rôle |
| --- | --- |
| `demo` | Vitrine. Personnage, table et activité peuvent être fictifs, marqués **Preview**. |
| `production` | Ce qui est déployé aujourd'hui, tel que soutenu au TFE. |
| `beta` | À ouvrir depuis `production`. Personnage, table et activité y sont de vraies données. Les aperçus de `demo` n'y entrent pas tels quels. |

- Une branche = un chantier. `NEXT.md` ne décrit que la marche suivante.
- Pas de commit sans demande explicite. Jamais de `.env`.
- Une donnée affichée sur `beta` vient de l'API, ou la zone reste vide.
- Le marketing vit dans `Docs/STRATEGIE-MARKETING.md`. Il ne promet pas une fonction qui n'est pas sur la branche montrée.
