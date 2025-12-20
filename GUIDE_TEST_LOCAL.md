# Guide de Test Local - SIAB Events

Ce guide vous explique comment tester votre application Django en local et la rendre accessible à distance sans hébergement.

## 🚀 Option 1 : Test Local Simple (sur votre PC uniquement)

### Étape 1 : Vérifier Python

```bash
python --version
```

Vous devez avoir Python 3.8 ou supérieur.

### Étape 2 : Créer un environnement virtuel

```bash
python -m venv venv
```

### Étape 3 : Activer l'environnement virtuel

**Sur Windows (PowerShell)** :
```bash
venv\Scripts\Activate.ps1
```

**Si vous avez une erreur**, utilisez :
```bash
venv\Scripts\activate
```

### Étape 4 : Installer les dépendances

```bash
pip install -r requirements.txt
```

### Étape 5 : Vérifier le fichier .env

Assurez-vous que le fichier `.env` existe. Sinon, créez-le :

```bash
python create_env.py
```

### Étape 6 : Appliquer les migrations

```bash
python manage.py migrate
```

### Étape 7 : Créer un superutilisateur (optionnel)

```bash
python manage.py createsuperuser
```

Suivez les instructions pour créer un compte admin.

### Étape 8 : Collecter les fichiers statiques

```bash
python manage.py collectstatic --noinput
```

### Étape 9 : Lancer le serveur

```bash
python manage.py runserver
```

### Étape 10 : Accéder à l'application

Ouvrez votre navigateur et allez sur :
- **Site principal** : http://127.0.0.1:8000/
- **Admin Django** : http://127.0.0.1:8000/admin/

---

## 🌐 Option 2 : Test avec Accès à Distance (ngrok)

Cette méthode permet à d'autres personnes d'accéder à votre application depuis Internet, même si elle tourne sur votre PC.

### Étape 1 : Installer ngrok

1. Allez sur https://ngrok.com/download
2. Téléchargez la version Windows
3. Extrayez le fichier `ngrok.exe` dans un dossier (ex: `C:\ngrok\`)
4. Créez un compte gratuit sur https://dashboard.ngrok.com
5. Copiez votre **authtoken** depuis le dashboard

### Étape 2 : Configurer ngrok

Ouvrez PowerShell en tant qu'administrateur et exécutez :

```bash
# Remplacez VOTRE_TOKEN par le token de votre compte ngrok
C:\ngrok\ngrok.exe config add-authtoken VOTRE_TOKEN
```

### Étape 3 : Modifier les paramètres Django pour accepter les connexions externes

Modifiez temporairement `siab_backend/settings.py` :

```python
# Pour permettre ngrok, ajoutez votre domaine ngrok dans ALLOWED_HOSTS
ALLOWED_HOSTS = ['*']  # Temporairement pour les tests
```

Ou mieux, dans votre fichier `.env` :

```env
ALLOWED_HOSTS=localhost,127.0.0.1,*.ngrok-free.app,*.ngrok.io
```

### Étape 4 : Lancer Django sur toutes les interfaces

Dans un terminal, lancez Django :

```bash
# Activer l'environnement virtuel
venv\Scripts\activate

# Lancer sur toutes les interfaces (0.0.0.0)
python manage.py runserver 0.0.0.0:8000
```

### Étape 5 : Lancer ngrok dans un autre terminal

Ouvrez un **nouveau terminal** et exécutez :

```bash
C:\ngrok\ngrok.exe http 8000
```

Vous verrez quelque chose comme :

```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:8000
```

### Étape 6 : Partager l'URL ngrok

Copiez l'URL `https://xxxx-xx-xx-xx-xx.ngrok-free.app` et partagez-la avec les personnes qui doivent tester.

**Important** :
- Cette URL fonctionne tant que ngrok et Django tournent
- L'URL change à chaque fois que vous relancez ngrok (sauf avec un plan payant)
- Votre PC doit rester allumé et connecté à Internet

### Étape 7 : Accéder à l'application

- **Via ngrok** : `https://xxxx-xx-xx-xx-xx.ngrok-free.app`
- **Admin Django** : `https://xxxx-xx-xx-xx-xx.ngrok-free.app/admin/`

---

## 🔧 Configuration Stripe pour les Tests

### Webhooks Stripe avec ngrok

Pour tester les webhooks Stripe en local :

1. **Installer Stripe CLI** : https://stripe.com/docs/stripe-cli

2. **Lancer Stripe CLI** :
```bash
stripe listen --forward-to localhost:8000/api/stripe-webhook-tombola/
stripe listen --forward-to localhost:8000/api/stripe-webhook-pitch/
```

3. **Configurer le webhook secret** dans votre `.env` :
```env
STRIPE_WEBHOOK_SECRET=whsec_...  # Copié depuis Stripe CLI
```

4. **Pour ngrok**, utilisez l'URL ngrok :
```bash
stripe listen --forward-to https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/stripe-webhook-tombola/
```

---

## 📝 Commandes Rapides

### Démarrer le serveur local

```bash
# Activer l'environnement
venv\Scripts\activate

# Lancer Django
python manage.py runserver
```

### Démarrer avec ngrok

**Terminal 1** (Django) :
```bash
venv\Scripts\activate
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2** (ngrok) :
```bash
C:\ngrok\ngrok.exe http 8000
```

---

## ⚠️ Notes Importantes

### Sécurité

- **Ne partagez jamais** votre URL ngrok publiquement
- Utilisez `ALLOWED_HOSTS` approprié en production
- Le fichier `.env` ne doit jamais être partagé

### Limitations ngrok Gratuit

- URL change à chaque redémarrage
- Limite de connexions simultanées
- Limite de bande passante
- Pour un usage professionnel, considérez un plan payant

### Base de Données

- En local, vous utilisez SQLite (`db.sqlite3`)
- Les données sont stockées localement
- Pour partager les données, utilisez PostgreSQL sur Railway/Render

---

## 🐛 Dépannage

### Erreur : "ModuleNotFoundError"

```bash
# Réinstaller les dépendances
pip install -r requirements.txt
```

### Erreur : "Port 8000 already in use"

```bash
# Utiliser un autre port
python manage.py runserver 8001
```

Puis dans ngrok :
```bash
C:\ngrok\ngrok.exe http 8001
```

### Erreur : "ALLOWED_HOSTS"

Ajoutez dans `.env` :
```env
ALLOWED_HOSTS=localhost,127.0.0.1,*.ngrok-free.app,*.ngrok.io
```

### ngrok ne fonctionne pas

1. Vérifiez que votre token est configuré
2. Vérifiez que le port 8000 est bien utilisé par Django
3. Vérifiez votre pare-feu Windows

---

## ✅ Checklist de Test

- [ ] Django fonctionne en local (`http://127.0.0.1:8000`)
- [ ] L'interface admin est accessible
- [ ] Les formulaires fonctionnent
- [ ] Les données sont sauvegardées dans la base de données
- [ ] ngrok fonctionne (si test à distance)
- [ ] Stripe fonctionne (si test de paiement)
- [ ] Les webhooks Stripe fonctionnent (si test de paiement)

---

**Bon test ! 🚀**

