"""
Django settings for siab_backend project.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-!_*dc%$gxqxgt5f12etx4dt$*+j@wvg1-bez2hd9ovvwk41f)&')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True') == 'True'

# ALLOWED_HOSTS - Configurez vos domaines en production
# Pour ngrok, on accepte les domaines ngrok
allowed_hosts_str = os.getenv('ALLOWED_HOSTS', '')
if allowed_hosts_str:
    # Convertir la chaîne en liste en nettoyant les espaces
    ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_str.split(',') if host.strip()]

    # Normaliser quelques formats pratiques :
    # - '*.domaine.com' -> '.domaine.com' (format supporté par Django pour tous les sous-domaines)
    # - Si '*' est présent, on autorise tous les hôtes (pour tests uniquement)
    normalized_hosts = []
    allow_all = False
    for host in ALLOWED_HOSTS:
        if host == '*':
            allow_all = True
            break
        if host.startswith('*.'):
            normalized_hosts.append('.' + host[2:])
        else:
            normalized_hosts.append(host)

    ALLOWED_HOSTS = ['*'] if allow_all else normalized_hosts
else:
    # Par défaut, accepter localhost et tous les domaines ngrok pour les tests
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '.ngrok-free.app', '.ngrok-free.dev', '.ngrok.io', '.ngrok.app']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'actualites',
    'reservations',
    'visiteurs',
    'panelistes',
    'presse',
    'contacts',
    'tombola',
    'pitch',
    'organisations',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Ajouter WhiteNoise pour servir les fichiers statiques en production
# Décommentez si vous utilisez WhiteNoise (recommandé pour Railway/Render)
# MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

ROOT_URLCONF = 'siab_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'siab_backend.wsgi.application'

# Database
# Utilisation de SQLite par défaut en développement
# PostgreSQL en production (automatique si DB_NAME est défini)
if os.getenv('DB_NAME'):
    # Configuration PostgreSQL pour la production
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
else:
    # SQLite pour le développement local
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Europe/Brussels'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files (Uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Les articles sont gérés via l'interface d'administration Django standard
# Accès : http://127.0.0.1:8000/admin/
# Identifiants : admin / admin123

# ============================================
# Configuration Email
# ============================================

# Email backend - Pour le développement, on affiche dans la console
# En production, utilisez un vrai service SMTP
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Configuration SMTP (pour la production)
# Décommentez et configurez ces paramètres en production
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'info@siab.events')
CONTACT_EMAIL = os.getenv('CONTACT_EMAIL', 'siab2025.info@gmail.com')

# Activer/désactiver l'envoi d'emails automatiques depuis les formulaires
# Par défaut, les données sont toujours sauvegardées dans la base de données
# L'email est optionnel et peut être désactivé en production
SEND_EMAIL_NOTIFICATIONS = os.getenv('SEND_EMAIL_NOTIFICATIONS', 'False') == 'True'

# Note: Pour Gmail, créez un mot de passe d'application:
# https://myaccount.google.com/apppasswords
# Ajoutez ces variables dans un fichier .env:
# EMAIL_HOST_USER=votre.email@gmail.com
# EMAIL_HOST_PASSWORD=votre_mot_de_passe_application
# CONTACT_EMAIL=email_de_reception@siab.com
# SEND_EMAIL_NOTIFICATIONS=True  # Activer les notifications par email (optionnel)

# ============================================
# Configuration Stripe
# ============================================

# Clés Stripe (à configurer dans .env pour la production)
STRIPE_PUBLIC_KEY = os.getenv('STRIPE_PUBLIC_KEY', 'pk_test_...')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_...')

# Note: Obtenez vos clés Stripe sur: https://dashboard.stripe.com/test/apikeys
# Ajoutez ces variables dans un fichier .env:
# STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique
# STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
# STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook

# Pour les webhooks locaux, utilisez Stripe CLI:
# stripe listen --forward-to localhost:8000/api/stripe-webhook-tombola/
# stripe listen --forward-to localhost:8000/api/stripe-webhook-pitch/

# ============================================
# Configuration Sécurité Production
# ============================================

# Paramètres de sécurité pour la production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_SECONDS = 31536000  # 1 an
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
