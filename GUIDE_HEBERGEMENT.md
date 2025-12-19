# Guide d'Hébergement - SIAB Events Django

Ce guide vous explique comment héberger votre application Django SIAB Events en production avec configuration email.

## 📋 Table des matières

1. [Préparation du projet](#préparation-du-projet)
2. [Options d'hébergement](#options-dhébergement)
3. [Configuration email](#configuration-email)
4. [Configuration de la base de données](#configuration-de-la-base-de-données)
5. [Déploiement détaillé par plateforme](#déploiement-détaillé-par-plateforme)
6. [Sécurité en production](#sécurité-en-production)
7. [Dépannage](#dépannage)

---

## 🔧 Préparation du projet

### 1. Mettre à jour les dépendances

Assurez-vous que votre `requirements.txt` contient toutes les dépendances nécessaires :

```txt
Django==4.2.7
python-dotenv==1.0.0
Pillow==10.1.0
stripe==7.9.0
psycopg2-binary==2.9.9  # Pour PostgreSQL
gunicorn==21.2.0  # Serveur WSGI pour production
whitenoise==6.6.0  # Pour servir les fichiers statiques
```

### 2. Créer un fichier `.env.example`

Créez un fichier `.env.example` à la racine avec toutes les variables nécessaires :

```env
# Django
SECRET_KEY=votre_secret_key_unique_et_longue
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com,www.votre-domaine.com

# Base de données PostgreSQL
DB_NAME=siab_events
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_db
DB_HOST=localhost
DB_PORT=5432

# Email (Optionnel - les données sont toujours sauvegardées dans la BDD)
SEND_EMAIL_NOTIFICATIONS=False  # Activer pour recevoir des notifications par email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre.email@gmail.com
EMAIL_HOST_PASSWORD=votre_mot_de_passe_application
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com

# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Mettre à jour `settings.py` pour la production

Voir la section [Configuration de la production](#configuration-de-la-production) ci-dessous.

---

## 🌐 Options d'hébergement

### Option 1 : Railway (Recommandé - Gratuit au début)

**Avantages :**
- ✅ Gratuit jusqu'à 500 heures/mois
- ✅ PostgreSQL inclus gratuitement
- ✅ Déploiement automatique depuis GitHub
- ✅ Configuration simple
- ✅ SSL automatique

**Prix :** Gratuit puis ~$5-20/mois

### Option 2 : Render

**Avantages :**
- ✅ Plan gratuit disponible
- ✅ PostgreSQL gratuit
- ✅ Déploiement automatique
- ✅ SSL automatique

**Prix :** Gratuit puis ~$7-25/mois

### Option 3 : Heroku

**Avantages :**
- ✅ Très populaire et bien documenté
- ✅ Add-ons nombreux
- ⚠️ Plus de plan gratuit (depuis 2022)

**Prix :** ~$5-25/mois

### Option 4 : DigitalOcean App Platform

**Avantages :**
- ✅ Performances excellentes
- ✅ PostgreSQL géré
- ✅ SSL automatique

**Prix :** ~$5-12/mois

### Option 5 : VPS (Hetzner, OVH, Scaleway)

**Avantages :**
- ✅ Contrôle total
- ✅ Prix très compétitifs
- ⚠️ Configuration manuelle requise

**Prix :** ~$3-10/mois

---

## 📧 Configuration Email

### Option 1 : Gmail (Simple pour démarrer)

1. **Créer un mot de passe d'application** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Créez un nouveau mot de passe d'application
   - Copiez le mot de passe (16 caractères)

2. **Variables d'environnement** :
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre.email@gmail.com
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com
```

### Option 2 : SendGrid (Recommandé pour production)

1. **Créer un compte** : https://sendgrid.com (100 emails/jour gratuits)

2. **Créer une clé API** :
   - Dashboard → Settings → API Keys
   - Créez une nouvelle clé avec permissions "Mail Send"

3. **Variables d'environnement** :
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=votre_clé_api_sendgrid
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com
```

### Option 3 : Brevo (ex-Sendinblue)

1. **Créer un compte** : https://www.brevo.com (300 emails/jour gratuits)

2. **Variables d'environnement** :
```env
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre_email@example.com
EMAIL_HOST_PASSWORD=votre_clé_smtp_brevo
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com
```

### Option 4 : Mailgun

1. **Créer un compte** : https://www.mailgun.com (5000 emails/mois gratuits les 3 premiers mois)

2. **Variables d'environnement** :
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=postmaster@votre-domaine.mailgun.org
EMAIL_HOST_PASSWORD=votre_mot_de_passe_mailgun
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com
```

---

## 🗄️ Configuration de la base de données

### Migration de SQLite vers PostgreSQL

1. **Installer PostgreSQL localement** (pour tester) :
   - Windows : https://www.postgresql.org/download/windows/
   - Mac : `brew install postgresql`
   - Linux : `sudo apt-get install postgresql`

2. **Créer la base de données** :
```bash
createdb siab_events
```

3. **Mettre à jour `settings.py`** (voir section ci-dessous)

4. **Migrer les données** :
```bash
python manage.py migrate
```

---

## 🚀 Déploiement détaillé par plateforme

### Déploiement sur Railway

#### Étape 1 : Préparer le projet

Créez un fichier `Procfile` à la racine :
```
web: gunicorn siab_backend.wsgi:application --bind 0.0.0.0:$PORT
```

Créez un fichier `runtime.txt` :
```
python-3.11.0
```

#### Étape 2 : Créer un compte Railway

1. Allez sur https://railway.app
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Sélectionnez "Deploy from GitHub repo"
5. Choisissez votre dépôt

#### Étape 3 : Ajouter PostgreSQL

1. Dans votre projet Railway, cliquez sur "+ New"
2. Sélectionnez "Database" → "PostgreSQL"
3. Railway créera automatiquement la base de données

#### Étape 4 : Configurer les variables d'environnement

Dans Railway → Settings → Variables, ajoutez :

```env
SECRET_KEY=votre_secret_key_longue_et_unique
DEBUG=False
ALLOWED_HOSTS=votre-app.railway.app

   # Database (Railway génère automatiquement ces variables)
   # DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT sont automatiques

   # Email (Optionnel - les données sont toujours sauvegardées dans la BDD)
   SEND_EMAIL_NOTIFICATIONS=False  # Activer pour recevoir des notifications par email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=votre.email@gmail.com
   EMAIL_HOST_PASSWORD=votre_mot_de_passe_application
   DEFAULT_FROM_EMAIL=noreply@siab.com
   CONTACT_EMAIL=contact@siab.com

# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Étape 5 : Déployer

Railway déploiera automatiquement à chaque push sur GitHub.

#### Étape 6 : Migrations

Dans Railway → Deployments → votre déploiement → View Logs, vous verrez les logs.

Pour exécuter les migrations manuellement, utilisez Railway CLI :
```bash
railway run python manage.py migrate
railway run python manage.py collectstatic --noinput
railway run python manage.py createsuperuser
```

---

### Déploiement sur Render

#### Étape 1 : Préparer le projet

Créez un fichier `render.yaml` à la racine :

```yaml
services:
  - type: web
    name: siab-events
    env: python
    buildCommand: pip install -r requirements.txt && python manage.py collectstatic --noinput
    startCommand: gunicorn siab_backend.wsgi:application
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: False
      - key: ALLOWED_HOSTS
        value: siab-events.onrender.com
      - key: DATABASE_URL
        fromDatabase:
          name: siab-events-db
          property: connectionString
```

#### Étape 2 : Créer un compte Render

1. Allez sur https://render.com
2. Connectez-vous avec GitHub
3. Cliquez sur "New +" → "Web Service"
4. Connectez votre dépôt GitHub

#### Étape 3 : Créer PostgreSQL

1. Dans Render Dashboard → "New +" → "PostgreSQL"
2. Nommez-le "siab-events-db"
3. Notez les informations de connexion

#### Étape 4 : Configurer le Web Service

1. **Build Command** :
```
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

2. **Start Command** :
```
gunicorn siab_backend.wsgi:application
```

3. **Variables d'environnement** :
```env
SECRET_KEY=<généré automatiquement>
DEBUG=False
ALLOWED_HOSTS=siab-events.onrender.com
DATABASE_URL=<généré automatiquement depuis PostgreSQL>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre.email@gmail.com
EMAIL_HOST_PASSWORD=votre_mot_de_passe_application
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com
```

#### Étape 5 : Déployer

Render déploiera automatiquement. Après le déploiement, exécutez les migrations via le shell :
```bash
python manage.py migrate
python manage.py createsuperuser
```

---

### Déploiement sur VPS (Ubuntu/Debian)

#### Étape 1 : Préparer le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Python et dépendances
sudo apt install python3-pip python3-venv python3-dev postgresql postgresql-contrib nginx git -y

# Installer Gunicorn
pip3 install gunicorn
```

#### Étape 2 : Créer un utilisateur

```bash
sudo adduser siab
sudo usermod -aG sudo siab
su - siab
```

#### Étape 3 : Cloner le projet

```bash
cd /home/siab
git clone https://github.com/votre-username/siab.events.git
cd siab.events
```

#### Étape 4 : Créer un environnement virtuel

```bash
python3 -venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Étape 5 : Configurer PostgreSQL

```bash
sudo -u postgres psql
```

Dans PostgreSQL :
```sql
CREATE DATABASE siab_events;
CREATE USER siab_user WITH PASSWORD 'votre_mot_de_passe';
ALTER ROLE siab_user SET client_encoding TO 'utf8';
ALTER ROLE siab_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE siab_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE siab_events TO siab_user;
\q
```

#### Étape 6 : Configurer Django

Créez un fichier `.env` :
```bash
nano .env
```

Ajoutez toutes les variables d'environnement.

#### Étape 7 : Migrations

```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

#### Étape 8 : Configurer Gunicorn

Créez `/etc/systemd/system/siab.service` :

```ini
[Unit]
Description=Gunicorn instance pour SIAB Events
After=network.target

[Service]
User=siab
Group=www-data
WorkingDirectory=/home/siab/siab.events
Environment="PATH=/home/siab/siab.events/venv/bin"
ExecStart=/home/siab/siab.events/venv/bin/gunicorn --workers 3 --bind unix:/home/siab/siab.events/siab.sock siab_backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Démarrer le service :
```bash
sudo systemctl start siab
sudo systemctl enable siab
```

#### Étape 9 : Configurer Nginx

Créez `/etc/nginx/sites-available/siab` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location /static/ {
        alias /home/siab/siab.events/staticfiles/;
    }

    location /media/ {
        alias /home/siab/siab.events/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/siab/siab.events/siab.sock;
    }
}
```

Activer le site :
```bash
sudo ln -s /etc/nginx/sites-available/siab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Étape 10 : Configurer SSL avec Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

---

## 🔒 Sécurité en production

### Mise à jour de `settings.py`

Créez un fichier `settings_production.py` ou modifiez `settings.py` :

```python
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# ... reste de la configuration ...

# Base de données PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'siab_events'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Sécurité
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Fichiers statiques
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Email (Optionnel - les données sont toujours sauvegardées dans la BDD)
SEND_EMAIL_NOTIFICATIONS = os.getenv('SEND_EMAIL_NOTIFICATIONS', 'False') == 'True'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@siab.com')
CONTACT_EMAIL = os.getenv('CONTACT_EMAIL', 'contact@siab.com')
```

### Checklist de sécurité

- [ ] `DEBUG = False` en production
- [ ] `SECRET_KEY` unique et longue (générez avec `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
- [ ] `ALLOWED_HOSTS` configuré avec votre domaine
- [ ] HTTPS activé (SSL/TLS)
- [ ] Base de données PostgreSQL avec mot de passe fort
- [ ] Variables d'environnement sécurisées (pas dans le code)
- [ ] Fichiers `.env` dans `.gitignore`
- [ ] Mots de passe admin forts
- [ ] Sauvegardes régulières de la base de données

---

## 🐛 Dépannage

### Les emails ne s'envoient pas

1. **Vérifiez les logs** :
   - Railway/Render : Dashboard → Logs
   - VPS : `journalctl -u siab -f`

2. **Vérifiez les variables d'environnement** :
   - Assurez-vous que toutes les variables email sont définies
   - Pour Gmail, utilisez un mot de passe d'application, pas votre mot de passe normal

3. **Testez la connexion SMTP** :
```python
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Message de test', 'from@example.com', ['to@example.com'])
```

### Erreur 500 en production

1. **Vérifiez les logs** :
   - Railway/Render : Dashboard → Logs
   - VPS : `journalctl -u siab -f`

2. **Vérifiez les migrations** :
```bash
python manage.py migrate
```

3. **Vérifiez les fichiers statiques** :
```bash
python manage.py collectstatic --noinput
```

### La base de données ne se connecte pas

1. **Vérifiez les variables d'environnement** :
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

2. **Testez la connexion** :
```bash
psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

### Les fichiers statiques ne s'affichent pas

1. **Collectez les fichiers statiques** :
```bash
python manage.py collectstatic --noinput
```

2. **Vérifiez la configuration Nginx** (si VPS) :
   - Le chemin `STATIC_ROOT` correspond à la configuration Nginx

---

## 📚 Ressources supplémentaires

- [Documentation Django - Déploiement](https://docs.djangoproject.com/fr/4.2/howto/deployment/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Gunicorn Documentation](https://gunicorn.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## ✅ Checklist de déploiement

- [ ] Mettre à jour `requirements.txt` avec toutes les dépendances
- [ ] Créer `Procfile` (pour Railway/Heroku)
- [ ] Créer `runtime.txt` (pour Railway/Heroku)
- [ ] Mettre à jour `settings.py` pour la production
- [ ] Configurer PostgreSQL
- [ ] Configurer les variables d'environnement
- [ ] Configurer l'email
- [ ] Exécuter les migrations
- [ ] Collecter les fichiers statiques
- [ ] Créer un superutilisateur
- [ ] Tester l'application en production
- [ ] Configurer un nom de domaine (optionnel)
- [ ] Configurer SSL/HTTPS
- [ ] Configurer les sauvegardes automatiques

---

**Bon déploiement ! 🚀**

