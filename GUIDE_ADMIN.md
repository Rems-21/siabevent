# Guide d'administration - SIAB Events

## Accès à l'administration

**URL** : `http://127.0.0.1:8000/admin/`

**Identifiants** :
- Username : `admin`
- Password : `admin123`

## Gérer les articles

1. Connectez-vous à l'admin Django
2. Cliquez sur **"Articles"** dans la section "ACTUALITES"
3. Vous verrez la liste de tous les articles avec :
   - Le titre
   - Un résumé court
   - Une miniature de l'image
   - La date de création

### Ajouter un nouvel article

1. Cliquez sur le bouton **"Ajouter Article"** en haut à droite
2. Remplissez les champs :
   - **Titre** : Le titre de l'article
   - **Résumé** : Un court résumé (affiché sur la page d'accueil des actualités)
   - **Contenu** : Le contenu complet de l'article
   - **Image** : Une image d'illustration (optionnelle)
3. Cliquez sur **"Enregistrer"**

### Modifier un article

1. Dans la liste des articles, cliquez sur le titre de l'article à modifier
2. Modifiez les champs souhaités
3. Pour changer l'image, téléchargez une nouvelle image
4. Cliquez sur **"Enregistrer"**

### Supprimer un article

1. Dans la liste des articles, cochez la case à gauche de l'article
2. Sélectionnez **"Supprimer les articles sélectionnés"** dans le menu déroulant en haut
3. Cliquez sur **"Exécuter"**
4. Confirmez la suppression

## Fonctionnalités avancées

### Recherche
Utilisez la barre de recherche en haut à droite pour trouver des articles par titre, résumé ou contenu.

### Filtres
Utilisez les filtres sur le côté droit pour afficher les articles par date de création.

### Aperçu de l'image
Lors de la modification d'un article, vous verrez un aperçu de l'image actuelle dans la section "Aperçu de l'image".

## Notes importantes

- Les articles sont affichés sur la page publique `http://127.0.0.1:8000/actualites.html`
- Les articles sont triés par date de création (le plus récent en premier)
- Les images sont automatiquement sauvegardées dans le dossier `media/uploads/`
- La date de création est générée automatiquement et ne peut pas être modifiée

