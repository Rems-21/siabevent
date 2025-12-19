# Commandes Git - Guide Rapide

## 🚀 Commandes pour Déployer sur GitHub

### 1. Vérifier l'état actuel
```bash
git status
```

### 2. Ajouter tous les fichiers (sauf ceux dans .gitignore)
```bash
git add .
```

### 3. Créer le premier commit
```bash
git commit -m "Initial commit - Application Django SIAB Events"
```

### 4. Créer un dépôt sur GitHub
1. Allez sur https://github.com/new
2. Nom du dépôt : `siab.events`
3. Description : "Application Django pour SIAB Events 2026"
4. Choisissez Public ou Private
5. **NE PAS** cocher "Initialize with README"
6. Cliquez sur "Create repository"

### 5. Connecter au dépôt GitHub
```bash
# Remplacez USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/USERNAME/siab.events.git
```

### 6. Renommer la branche en 'main' (si nécessaire)
```bash
git branch -M main
```

### 7. Pousser le code sur GitHub
```bash
git push -u origin main
```

## 📝 Commandes Quotidiennes

### Ajouter des modifications
```bash
git add .
git commit -m "Description des modifications"
git push
```

### Voir l'historique
```bash
git log --oneline
```

### Voir les différences
```bash
git diff
```

## ⚠️ Important

- Le fichier `.env` est dans `.gitignore` et ne sera **PAS** commité (c'est normal et sécurisé)
- Ne commitez jamais de fichiers sensibles (mots de passe, clés API, etc.)
- Vérifiez toujours avec `git status` avant de commiter

