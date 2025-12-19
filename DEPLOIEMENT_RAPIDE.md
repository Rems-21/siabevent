# Guide de Déploiement Rapide - SIAB Events

Ce guide vous permet de déployer rapidement votre application Django sur différentes plateformes.

## 🚀 Déploiement sur Railway (Le plus simple)

### Prérequis
- Compte GitHub
- Compte Railway (gratuit) : https://railway.app

### Étapes

1. **Pousser votre code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-username/siab.events.git
   git push -u origin main
   ```

2. **Créer un projet Railway**
   - Allez sur https://railway.app
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre dépôt

3. **Ajouter PostgreSQL**
   - Dans votre projet Railway, cliquez sur "+ New"
   - Sélectionnez "Database" → "PostgreSQL"
   - Railway créera automatiquement la base de données

4. **Configurer les variables d'environnement**
   
   Dans Railway → Settings → Variables, ajoutez :
   
   ```env
   SECRET_KEY=<générez avec: python -c "import secrets; print(secrets.token_urlsafe(50))">
   DEBUG=False
   ALLOWED_HOSTS=votre-app.railway.app
   
   # Email (Optionnel - les données sont toujours sauvegardées dans la BDD)
   SEND_EMAIL_NOTIFICATIONS=False  # Activer pour recevoir des notifications par email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=votre.email@gmail.com
   EMAIL_HOST_PASSWORD=votre_mot_de_passe_application_gmail
   DEFAULT_FROM_EMAIL=noreply@siab.com
   CONTACT_EMAIL=contact@siab.com
   
   STRIPE_PUBLIC_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
   
   **Note** : Les variables de base de données (`DB_NAME`, `DB_USER`, etc.) sont automatiquement générées par Railway.

5. **Déployer**
   - Railway déploiera automatiquement
   - Attendez que le déploiement soit terminé

6. **Exécuter les migrations**
   
   Utilisez Railway CLI ou le terminal intégré :
   ```bash
   railway run python manage.py migrate
   railway run python manage.py createsuperuser
   ```

7. **Accéder à votre site**
   - Votre site sera disponible sur `https://votre-app.railway.app`
   - L'admin Django : `https://votre-app.railway.app/admin/`

---

## 🌐 Déploiement sur Render

### Prérequis
- Compte GitHub
- Compte Render (gratuit) : https://render.com

### Étapes

1. **Pousser votre code sur GitHub** (même chose que Railway)

2. **Créer un Web Service**
   - Allez sur https://render.com
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre dépôt GitHub
   - Sélectionnez votre dépôt

3. **Configurer le service**
   - **Name** : `siab-events`
   - **Environment** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command** : `gunicorn siab_backend.wsgi:application`

4. **Créer PostgreSQL**
   - Dans Render Dashboard → "New +" → "PostgreSQL"
   - Nommez-le `siab-events-db`
   - Sélectionnez le plan gratuit

5. **Configurer les variables d'environnement**
   
   Dans votre Web Service → Environment, ajoutez :
   
   ```env
   SECRET_KEY=<générez avec: python -c "import secrets; print(secrets.token_urlsafe(50))">
   DEBUG=False
   ALLOWED_HOSTS=siab-events.onrender.com
   
   # Email (Optionnel - les données sont toujours sauvegardées dans la BDD)
   SEND_EMAIL_NOTIFICATIONS=False  # Activer pour recevoir des notifications par email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=votre.email@gmail.com
   EMAIL_HOST_PASSWORD=votre_mot_de_passe_application_gmail
   DEFAULT_FROM_EMAIL=noreply@siab.com
   CONTACT_EMAIL=contact@siab.com
   
   STRIPE_PUBLIC_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
   
   **Note** : La variable `DATABASE_URL` est automatiquement générée par Render.

6. **Déployer**
   - Cliquez sur "Create Web Service"
   - Render déploiera automatiquement

7. **Exécuter les migrations**
   
   Dans votre Web Service → Shell, exécutez :
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

8. **Accéder à votre site**
   - Votre site sera disponible sur `https://siab-events.onrender.com`
   - L'admin Django : `https://siab-events.onrender.com/admin/`

---

## 📧 Configuration Email Rapide

### Option 1 : Gmail (Le plus simple)

1. **Créer un mot de passe d'application** :
   - https://myaccount.google.com/apppasswords
   - Créez un nouveau mot de passe d'application
   - Copiez le mot de passe (16 caractères)

2. **Ajouter dans les variables d'environnement** :
   ```env
   SEND_EMAIL_NOTIFICATIONS=True  # Activer les notifications par email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=votre.email@gmail.com
   EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
   DEFAULT_FROM_EMAIL=noreply@siab.com
   CONTACT_EMAIL=contact@siab.com
   ```

### Option 2 : SendGrid (Recommandé pour production)

1. **Créer un compte** : https://sendgrid.com
2. **Créer une clé API** : Dashboard → Settings → API Keys
3. **Ajouter dans les variables d'environnement** :
   ```env
   SEND_EMAIL_NOTIFICATIONS=True  # Activer les notifications par email
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=apikey
   EMAIL_HOST_PASSWORD=votre_clé_api_sendgrid
   DEFAULT_FROM_EMAIL=noreply@siab.com
   CONTACT_EMAIL=contact@siab.com
   ```

---

## ✅ Checklist Post-Déploiement

- [ ] Les migrations sont exécutées (`python manage.py migrate`)
- [ ] Un superutilisateur est créé (`python manage.py createsuperuser`)
- [ ] Les fichiers statiques sont collectés (automatique avec `collectstatic`)
- [ ] Les variables d'environnement sont configurées
- [ ] Les données sont sauvegardées dans la base de données (vérifier dans l'admin)
- [ ] L'email est configuré et testé (si activé)
- [ ] Le site est accessible en HTTPS
- [ ] L'interface admin fonctionne
- [ ] Les formulaires envoient les données au backend correctement

---

## 🐛 Problèmes courants

### Erreur 500
- Vérifiez les logs dans Railway/Render
- Assurez-vous que les migrations sont exécutées
- Vérifiez que `DEBUG=False` et `ALLOWED_HOSTS` est configuré

### Les emails ne s'envoient pas (si activés)
- Vérifiez que `SEND_EMAIL_NOTIFICATIONS=True` est défini
- Vérifiez les variables d'environnement email
- Pour Gmail, utilisez un mot de passe d'application, pas votre mot de passe normal
- Vérifiez les logs pour les erreurs SMTP
- **Note** : Les données sont toujours sauvegardées dans la BDD même si l'email échoue

### Les fichiers statiques ne s'affichent pas
- Assurez-vous que `collectstatic` est exécuté dans le build command
- Vérifiez que `STATIC_ROOT` est correctement configuré

---

## 📚 Documentation complète

Pour plus de détails, consultez le **GUIDE_HEBERGEMENT.md** qui contient :
- Guide complet pour toutes les plateformes
- Configuration détaillée de la sécurité
- Guide de dépannage approfondi
- Configuration VPS complète

---

**Bon déploiement ! 🚀**

