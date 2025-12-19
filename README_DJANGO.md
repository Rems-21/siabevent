# Backend Django - SIAB Events

## Structure du projet

```
siab.events - Copie/
├── manage.py                 # Script de gestion Django
├── requirements.txt          # Dépendances Python
├── .env                      # Variables d'environnement (à créer)
├── siab_backend/             # Configuration du projet Django
│   ├── settings.py          # Configuration
│   ├── urls.py              # URLs principales
│   └── wsgi.py              # WSGI config
├── actualites/               # Application Django pour les actualités
│   ├── models.py            # Modèle Article
│   ├── views.py             # Vues API
│   ├── urls.py              # URLs de l'app
│   └── admin.py             # Interface admin Django
├── templates/                # Templates HTML
│   ├── index.html
│   ├── participer.html
│   ├── actualites.html
│   └── admin/
│       ├── login.html
│       └── index.html
├── static/                   # Fichiers statiques
│   ├── css/
│   ├── js/
│   ├── images/
│   └── video/
└── media/                    # Fichiers uploadés
    └── uploads/
```

## Installation

### 1. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 2. Configuration

Créez un fichier `.env` à la racine (copiez `.env.example`) :

```env
SECRET_KEY=votre_secret_key_django_unique
```

**Note** : Pour SQLite (base de données par défaut), aucune autre configuration n'est nécessaire.

### 3. Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Créer un superutilisateur

```bash
python manage.py createsuperuser
```

## Utilisation

### Démarrer le serveur

```bash
python manage.py runserver
```

Le serveur démarre sur `http://localhost:8000`

### Accès

- **Site**: `http://localhost:8000`
- **Admin Django**: `http://localhost:8000/admin/` (identifiants: admin / admin123)
- **Actualités publiques**: `http://localhost:8000/actualites.html`

### Gestion des articles

Les articles sont maintenant gérés directement depuis l'interface d'administration Django :
1. Connectez-vous à `http://localhost:8000/admin/`
2. Cliquez sur "Articles" dans la section "Actualites"
3. Vous pouvez ajouter, modifier ou supprimer des articles

## Routes API

### Publiques
- `GET /api/get_articles.php` - Récupérer tous les articles (format JSON)

## Commandes utiles

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques (production)
python manage.py collectstatic
```

## Sécurité

⚠️ **Pour la production** :

1. Changez `SECRET_KEY` dans `.env`
2. Changez le mot de passe du superutilisateur Django
3. Mettez `DEBUG = False` dans `settings.py`
4. Configurez `ALLOWED_HOSTS` dans `settings.py`
5. Utilisez HTTPS
6. Configurez un serveur web (Nginx + Gunicorn)

