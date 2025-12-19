# SIAB Events - Résumé du projet

## Architecture finale

### Backend : Django + SQLite
- Framework web Python robuste et sécurisé
- Base de données SQLite (simple, pas de configuration requise)
- Interface d'administration Django intégrée

### Frontend : HTML/CSS/JS + Bootstrap
- Templates Django pour le rendu des pages
- Bootstrap 5 pour le design responsive
- JavaScript pour les interactions dynamiques

## Structure du projet

```
siab.events/
├── manage.py                    # Script de gestion Django
├── requirements.txt             # Dépendances Python
├── db.sqlite3                   # Base de données SQLite
│
├── siab_backend/                # Configuration Django
│   ├── settings.py              # Configuration du projet
│   ├── urls.py                  # Routes principales
│   └── wsgi.py                  # Configuration WSGI
│
├── actualites/                  # Application Articles
│   ├── models.py                # Modèle Article (BDD)
│   ├── views.py                 # Vues publiques
│   ├── urls.py                  # Routes de l'app
│   └── admin.py                 # Configuration admin Django
│
├── templates/                   # Templates HTML
│   ├── index.html               # Page d'accueil
│   ├── actualites.html          # Page actualités
│   ├── participer.html
│   ├── tombola.html
│   ├── pitch.html
│   ├── apropos.html
│   ├── logistique.html
│   ├── contacts.html
│   └── includes/                # Composants partagés
│       ├── header.html
│       └── footer.html
│
├── static/                      # Fichiers statiques
│   ├── css/                     # Styles CSS
│   ├── js/                      # Scripts JavaScript
│   ├── images/                  # Images du site
│   └── video/                   # Vidéos
│
└── media/                       # Fichiers uploadés
    └── uploads/                 # Images des articles
```

## Fonctionnalités

### Pages publiques
- ✅ Accueil avec vidéo et animations
- ✅ Participer (inscription)
- ✅ Activités (Tombola, Pitch)
- ✅ Actualités (articles dynamiques)
- ✅ Infos utiles (À propos, Logistique, Contacts)
- ✅ Design responsive (mobile/tablet/desktop)
- ✅ Animations au scroll

### Administration
- ✅ Interface Django admin complète
- ✅ Gestion des articles (CRUD)
- ✅ Upload d'images
- ✅ Aperçu des images
- ✅ Recherche et filtres
- ✅ Authentification sécurisée

### API
- ✅ `GET /api/get_articles.php` - Récupère tous les articles (format JSON)

## Démarrage rapide

### 1. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 2. Lancer les migrations
```bash
python manage.py migrate
```

### 3. Créer un superutilisateur
```bash
python manage.py createsuperuser
```

### 4. Démarrer le serveur
```bash
python manage.py runserver
```

### 5. Accéder au site
- **Site public** : http://127.0.0.1:8000/
- **Admin** : http://127.0.0.1:8000/admin/

## Technologies utilisées

### Backend
- Python 3.13
- Django 4.2.26
- SQLite 3

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript ES6+
- Bootstrap 5.3.0
- Font Awesome 6.0.0

## Sécurité

✅ Protection CSRF Django  
✅ Authentification sécurisée  
✅ Gestion des permissions  
✅ Protection XSS  
✅ Validation des données  
✅ Upload de fichiers sécurisé  

## Notes importantes

- La base de données SQLite est idéale pour le développement
- Pour la production, migrez vers PostgreSQL ou MySQL
- N'oubliez pas de changer le `SECRET_KEY` en production
- Activez HTTPS en production
- Configurez `ALLOWED_HOSTS` en production
- Mettez `DEBUG = False` en production

## Support et documentation

- **README_DJANGO.md** : Documentation complète Django
- **GUIDE_ADMIN.md** : Guide d'utilisation de l'interface admin
- **Django Docs** : https://docs.djangoproject.com/
- **Bootstrap Docs** : https://getbootstrap.com/docs/

