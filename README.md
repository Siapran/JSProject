# JSProject
Bureau virtuel par Pierre-Antoine Porte et Tristan Robin

Interface Jquery Tabs
===============
L'interface a été crée et on lui a appliqué un style. On utilise les tabs et l'accordéon


Développement d'un éditeur de texte
===============
L'éditeur de texte permet de modifier le contenu du document. On peut appliquer les différents effets de style demandé sur un document.
Ainsi on a implanté les fonctions suivantes :
* Les fonctions de sauvegarde/récupération du texte saisi (sur le serveur par appel ajax)
* les fonctions undo/redo
* les fonctions de mise en forme suivante : mise en gras, mise en italique, augmentation/diminution de la taille des caractères, soulignement, justification (gauche et centrée)
* les fonctions de création de listes (numérotées ou pas)


Coordination de l'arborescence de répertoires avec la zone d'édition
======================
Jstree est implanté via un fichier root.json contenant les fichiers et dossiers du dossier homedir. Il est mis à jour via une fonction d'écriture dans le fichier root.json

Ainsi nous avons implanté :
* un clic sur une feuille de l'arbre (représentant un document) ajoute un onglet dans la zone d'édition contenant le document correspondant et lui donne le focus (au cas où l'onglet est déjà présent, il récupère le focus)
* la création d'un nouveau document ajoute un nouvel onglet dans la zone d'édition portant le nom du nouveau document et lui donne le focus
la suppression d'une feuille de l'arbre supprime l'éventuel onglet correspondant et supprime le fichier correspondant sur le serveur (après demande de confirmation). Seule, la suppression de répertoire vide est autorisée
* le renommage d'un document modifie le nom de l'onglet correspondant (on ne gèrera pas les problèmes de duplications des noms de documents. On suppose donc qu'ils ont tous des noms différents)


DEVELOPPEMENTS LIBRES
==========

Intégration de widgets/plugins existants : Calendrier et Calculatrice
Développement de jeu : Un snake dans un canvas facon objet javascript, disponible dans mysnake.js
