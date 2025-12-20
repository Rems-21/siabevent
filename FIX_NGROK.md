# Fix : Erreur DisallowedHost avec ngrok

## 🔧 Solution Rapide

Si vous avez l'erreur :
```
DisallowedHost at /
Invalid HTTP_HOST header: 'xxxx.ngrok-free.dev'
```

### Option 1 : Mettre à jour le fichier .env

Ouvrez votre fichier `.env` et modifiez la ligne `ALLOWED_HOSTS` :

```env
ALLOWED_HOSTS=localhost,127.0.0.1,*.ngrok-free.app,*.ngrok-free.dev,*.ngrok.io,*.ngrok.app
```

Le `*` permet d'accepter tous les sous-domaines ngrok.

### Option 2 : Ajouter le domaine spécifique

Si vous préférez être plus précis, ajoutez votre domaine ngrok exact :

```env
ALLOWED_HOSTS=localhost,127.0.0.1,azotic-pseudoartistically-angla.ngrok-free.dev
```

### Option 3 : Accepter tous les domaines (pour les tests uniquement)

**⚠️ À utiliser uniquement pour les tests locaux !**

Dans votre fichier `.env` :
```env
ALLOWED_HOSTS=*
```

Ou dans `siab_backend/settings.py`, j'ai déjà modifié le code pour accepter les domaines ngrok par défaut.

## ✅ Vérification

Après avoir modifié `.env`, redémarrez votre serveur Django :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez-le
python manage.py runserver 0.0.0.0:8000
```

## 🔒 Sécurité

- En **production**, utilisez uniquement votre domaine réel
- Ne laissez **jamais** `ALLOWED_HOSTS=*` en production
- Pour ngrok, utilisez `*.ngrok-free.app` ou le domaine exact

