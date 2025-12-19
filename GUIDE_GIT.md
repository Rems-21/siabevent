# Guide Git - Déploiement du Code

Ce guide vous explique comment créer un dépôt Git et pousser votre code sur GitHub.

## 📋 Prérequis

- Git installé sur votre machine
- Compte GitHub (gratuit) : https://github.com

## 🚀 Étapes de Déploiement

### 1. Vérifier l'installation de Git

```bash
git --version
```

Si Git n'est pas installé, téléchargez-le depuis : https://git-scm.com/downloads

### 2. Configurer Git (première fois uniquement)

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### 3. Initialiser le dépôt Git local

Dans le dossier de votre projet :

```bash
cd "C:\Users\Dr Remus\Desktop\siab.events"
git init
```

### 4. Vérifier les fichiers à ignorer

Le fichier `.gitignore` est déjà configuré pour ignorer :
- Fichiers Python (`__pycache__`, `*.pyc`)
- Fichiers sensibles (`.env`, `db.sqlite3`)
- Fichiers statiques compilés (`staticfiles/`)
- Fichiers uploadés (`media/`)

### 5. Ajouter les fichiers au dépôt

```bash
# Voir les fichiers qui seront ajoutés
git status

# Ajouter tous les fichiers (sauf ceux dans .gitignore)
git add .

# Vérifier ce qui sera commité
git status
```

### 6. Créer le premier commit

```bash
git commit -m "Initial commit - Application Django SIAB Events"
```

### 7. Créer un dépôt sur GitHub

1. Allez sur https://github.com
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Remplissez les informations :
   - **Repository name** : `siab.events` (ou un autre nom)
   - **Description** : "Application Django pour SIAB Events 2026"
   - **Visibility** : Public ou Private (selon votre choix)
   - **NE PAS** cocher "Initialize with README" (le dépôt existe déjà)
4. Cliquez sur **"Create repository"**

### 8. Connecter le dépôt local à GitHub

GitHub vous donnera des instructions. Utilisez la commande pour un dépôt existant :

```bash
# Remplacer USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/USERNAME/siab.events.git

# Vérifier que le remote est bien configuré
git remote -v
```

### 9. Pousser le code sur GitHub

```bash
# Renommer la branche principale en 'main' (si nécessaire)
git branch -M main

# Pousser le code sur GitHub
git push -u origin main
```

Vous devrez peut-être vous authentifier :
- **Token d'accès personnel** : GitHub utilise maintenant des tokens au lieu des mots de passe
- Créez un token : https://github.com/settings/tokens
- Sélectionnez les permissions : `repo` (accès complet aux dépôts)

## 🔄 Commandes Git Utiles

### Voir l'état du dépôt

```bash
git status
```

### Ajouter des fichiers modifiés

```bash
git add .                    # Ajouter tous les fichiers modifiés
git add nom_fichier.py       # Ajouter un fichier spécifique
```

### Créer un commit

```bash
git commit -m "Description des modifications"
```

### Pousser les modifications

```bash
git push
```

### Récupérer les dernières modifications

```bash
git pull
```

### Voir l'historique des commits

```bash
git log
```

### Créer une nouvelle branche

```bash
git checkout -b nom-de-la-branche
```

### Retourner sur la branche principale

```bash
git checkout main
```

## 📝 Exemple de Workflow Quotidien

```bash
# 1. Voir les modifications
git status

# 2. Ajouter les fichiers modifiés
git add .

# 3. Créer un commit avec un message descriptif
git commit -m "Ajout de la fonctionnalité X"

# 4. Pousser sur GitHub
git push
```

## 🔐 Sécurité

### Fichiers à NE JAMAIS commiter

Le fichier `.gitignore` protège déjà ces fichiers :
- ✅ `.env` (variables d'environnement sensibles)
- ✅ `db.sqlite3` (base de données locale)
- ✅ `__pycache__/` (fichiers Python compilés)
- ✅ `staticfiles/` (fichiers statiques compilés)
- ✅ `media/` (fichiers uploadés)

### Vérifier avant de commiter

```bash
# Voir ce qui sera commité
git status

# Voir les différences
git diff
```

## 🚨 Problèmes Courants

### Erreur : "fatal: remote origin already exists"

```bash
# Supprimer le remote existant
git remote remove origin

# Ajouter le nouveau remote
git remote add origin https://github.com/USERNAME/siab.events.git
```

### Erreur : "failed to push some refs"

```bash
# Récupérer les modifications distantes d'abord
git pull origin main --allow-unrelated-histories

# Puis pousser
git push -u origin main
```

### Oublier de créer le fichier .env

Le fichier `.env` est dans `.gitignore`, donc il ne sera pas commité. C'est normal !

Pour créer le fichier `.env` localement :
```bash
python create_env.py
```

## 📚 Ressources

- [Documentation Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Créer un token GitHub](https://github.com/settings/tokens)

## ✅ Checklist de Déploiement

- [ ] Git installé et configuré
- [ ] Dépôt Git initialisé localement (`git init`)
- [ ] Fichiers ajoutés (`git add .`)
- [ ] Premier commit créé (`git commit`)
- [ ] Dépôt créé sur GitHub
- [ ] Remote configuré (`git remote add origin`)
- [ ] Code poussé sur GitHub (`git push`)
- [ ] Fichier `.env` vérifié (ne doit PAS être dans Git)

---

**Bon déploiement ! 🚀**

