# Explorateur de Fichiers Angular

## Présentation

Ce projet est une application Angular qui simule un explorateur de fichiers moderne, inspiré de l’Explorateur Windows. Il permet de naviguer dans une arborescence de dossiers/fichiers, d’effectuer des opérations courantes (ajout, renommage, suppression, copier/coller, favoris, etc.) et offre une expérience utilisateur professionnelle et fluide.

---

## Fonctionnalités principales

- **Navigation dans l’arborescence** (sidebar) avec sélection rapide et favoris
- **Vue “Détails”** (tableau triable) : Nom, Type, Taille, Date
- **Barre d’outils** : Précédent, Suivant, Haut, barre d’adresse, recherche en temps réel
- **Ajout de dossier/fichier** via formulaire
- **Renommage inline** (double-clic ou menu contextuel)
- **Menu contextuel (clic droit)** : Renommer, Supprimer, Copier, Couper, Coller, Favori
- **Suppression** via menu contextuel
- **Copier/Couper/Coller** (multi-éléments, gestion des conflits de nom)
- **Sélection multiple** (cases à cocher, tout sélectionner, actions groupées)
- **Favoris / Accès rapide** (barre en haut de la sidebar)
- **Navigation clavier** (flèches, entrée, espace, échap dans le tableau)
- **Recherche** (filtrage en temps réel)
- **Transitions et fluidité** sur tous les éléments interactifs
- **Responsive** (adapté aux petits écrans)

---

## Répartition des tâches par membre

### **Membre 1 – Chef de projet / Intégration générale**
- Création du projet Angular, gestion du repo GitHub
- Structure globale du projet (dossiers, components)
- Intégration et coordination des différentes parties
- Fusion et tests finaux

### **Membre 2 – Service + Données simulées**
- Création du service `FileSystemMockService` (src/app/services/file-system.mock.ts)
- Définition du modèle `FileNode` (src/app/models/file-node.ts)
- Méthodes d’ajout, suppression, renommage, copier/coller, gestion des favoris
- Pré-remplissage de l’arborescence façon Windows

### **Membre 3 – Composant folder (dossier)**
- Composant récursif pour l’arborescence (sidebar)
- Affichage d’un dossier et de ses enfants
- Gestion de l’ouverture/fermeture, sélection, favoris
- Propagation des événements de navigation

### **Membre 4 – Composant file (fichier)**
- Composant d’affichage d’un fichier (icône, nom, taille, date)
- Gestion du renommage inline, menu contextuel, sélection
- Actions sur les fichiers (téléchargement, suppression, copier/coller)

### **Membre 5 – Ajout/édition de fichiers (formulaires)**
- Composant `FileForm` pour l’ajout/édition de fichiers et dossiers
- Gestion des entrées (nom, type), validation, annulation
- Intégration dans la vue principale et dans les dossiers

---

## Explication du code principal

- **src/app/components/file-explorer/file-explorer.ts**
  - Composant principal : gère l’état global (dossier courant, sélection, favoris, clipboard, etc.)
  - Affiche la barre d’outils, la sidebar, la vue Détails, les actions groupées
  - Gère la navigation, le tri, la recherche, la sélection multiple, le menu contextuel, le renommage inline, le copier/coller, les favoris

- **src/app/components/folder/folder-tree.ts**
  - Composant récursif pour l’arborescence (sidebar)
  - Permet la navigation rapide et la gestion des favoris

- **src/app/services/file-system.mock.ts**
  - Service simulant un système de fichiers en mémoire
  - Fournit les méthodes pour manipuler l’arborescence (ajout, suppression, renommage, copier/coller, favoris)

- **src/app/components/file-form/FileForm.ts**
  - Composant formulaire pour l’ajout/édition de fichiers et dossiers
  - Utilisé dans la vue principale et dans les dossiers

- **src/app/components/file-explorer/file-explorer.html/css**
  - Structure et style de l’UI : layout flex, sidebar, barre d’outils, tableau Détails, transitions, responsive

---

## Lancer le projet

```bash
cd file-explorer-app
npm install
ng serve
```

Ouvre [http://localhost:4200](http://localhost:4200) dans ton navigateur.

---

## Remarques
- Toutes les opérations sont simulées en mémoire (pas de backend réel)
- L’upload réel, l’aperçu rapide, le drag & drop, etc. peuvent être ajoutés facilement
- Le code est modulaire et prêt pour une extension future (API, persistance, etc.)
