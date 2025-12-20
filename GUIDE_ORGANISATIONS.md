# Guide de Gestion des Partenaires, Exposants et Représentants

Ce guide explique comment gérer les partenaires, exposants et représentants depuis l'interface d'administration Django.

## Accès à l'interface d'administration

1. Accédez à `/admin/` sur votre site
2. Connectez-vous avec vos identifiants administrateur
3. Vous verrez les sections suivantes :
   - **Partenaires** : Gestion des partenaires SIAB
   - **Exposants** : Gestion des exposants
   - **Représentants** : Gestion des représentants par pays
   - **Pays** : Gestion des pays (pour les représentants)

## Ajouter un Partenaire

1. Cliquez sur **Partenaires** dans le menu admin
2. Cliquez sur **Ajouter un partenaire**
3. Remplissez les champs :
   - **Nom du partenaire** : Nom de l'organisation (ex: CIEC, EXOCOM)
   - **Logo** : Téléchargez le logo du partenaire (format recommandé: PNG, JPG)
   - **Site web** : URL du site web (optionnel)
   - **Description** : Description du partenaire (optionnel)
   - **Ordre d'affichage** : Numéro pour ordonner l'affichage (0 = premier)
   - **Actif** : Cochez pour afficher le partenaire sur le site
4. Cliquez sur **Enregistrer**

## Ajouter un Exposant

1. Cliquez sur **Exposants** dans le menu admin
2. Cliquez sur **Ajouter un exposant**
3. Remplissez les champs :
   - **Nom de l'exposant** : Nom de l'entreprise (ex: FOX COMMUNICATION)
   - **Logo** : Téléchargez le logo de l'exposant
   - **Site web** : URL du site web (optionnel)
   - **Description** : Description de l'exposant (optionnel)
   - **Secteur d'activité** : Secteur d'activité (optionnel)
   - **Ordre d'affichage** : Numéro pour ordonner l'affichage
   - **Actif** : Cochez pour afficher l'exposant sur le site
4. Cliquez sur **Enregistrer**

## Ajouter un Représentant

### Étape 1 : Créer les Pays (si nécessaire)

1. Cliquez sur **Pays** dans le menu admin
2. Cliquez sur **Ajouter un pays**
3. Remplissez les champs :
   - **Code pays (ISO)** : Code ISO à 2 lettres (ex: `sn` pour Sénégal, `bf` pour Burkina Faso)
   - **Nom du pays** : Nom complet du pays (ex: Sénégal, Burkina Faso)
   - **Code pour drapeau (flagcdn)** : Code pour le drapeau (généralement le même que le code ISO, optionnel)
4. Cliquez sur **Enregistrer**

**Codes pays courants :**
- `sn` : Sénégal
- `bf` : Burkina Faso
- `bj` : Bénin
- `tg` : Togo
- `sl` : Sierra Leone
- `gn` : Guinée

### Étape 2 : Créer le Représentant

1. Cliquez sur **Représentants** dans le menu admin
2. Cliquez sur **Ajouter un représentant**
3. Remplissez les champs :
   - **Nom complet** : Nom du représentant (ex: M. DIALLO MOHAMED)
   - **Titre** : Titre du représentant (par défaut: "Représentant SIAB")
   - **Photo** : Téléchargez la photo du représentant (optionnel)
   - **Pays représentés** : Sélectionnez un ou plusieurs pays (maintenez Ctrl/Cmd pour sélectionner plusieurs)
   - **Email** : Email de contact (optionnel)
   - **Téléphone** : Numéro de téléphone (optionnel)
   - **Ordre d'affichage** : Numéro pour ordonner l'affichage
   - **Actif** : Cochez pour afficher le représentant sur le site
4. Cliquez sur **Enregistrer**

## Modifier ou Supprimer

- **Modifier** : Cliquez sur l'élément dans la liste, modifiez les champs, puis **Enregistrer**
- **Supprimer** : Cochez la case à côté de l'élément, sélectionnez **Supprimer les éléments sélectionnés** dans le menu déroulant, puis confirmez

## Ordre d'affichage

- Les éléments sont triés par **Ordre d'affichage** (croissant), puis par nom
- Utilisez des numéros pour contrôler l'ordre : 0, 1, 2, 3, etc.
- Les éléments avec le même ordre sont triés alphabétiquement

## Affichage sur le site

- Seuls les éléments avec **Actif** coché sont affichés sur la page d'accueil
- Les partenaires sont affichés dans un carousel (5 par slide)
- Les exposants sont affichés dans une grille
- Les représentants sont affichés dans un carousel (5 par slide)

## Notes importantes

- **Logos et Photos** : Utilisez des images de bonne qualité (format PNG ou JPG recommandé)
- **Taille recommandée** :
  - Logos partenaires/exposants : 200x100px minimum
  - Photos représentants : 200x200px (carré) pour un meilleur rendu
- **Pays** : Créez les pays une seule fois, puis réutilisez-les pour plusieurs représentants
- **Actif/Désactif** : Décochez **Actif** pour masquer temporairement un élément sans le supprimer

