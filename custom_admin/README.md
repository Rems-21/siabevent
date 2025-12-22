# Administration Personnalisée SIAB

Cette application fournit une interface d'administration personnalisée pour gérer et exporter les données du site SIAB.

## Fonctionnalités

- **Dashboard centralisé** : Vue d'ensemble de tous les modèles de données
- **Recherche** : Recherche dans tous les champs pertinents de chaque modèle
- **Export PDF** : Téléchargement des données filtrées en format PDF
- **Pagination** : Affichage par pages de 50 enregistrements

## Accès

L'interface est accessible à l'URL : `/admin-custom/`

**Important** : L'accès nécessite une authentification (décorateur `@login_required`).

## Modèles disponibles

1. **Contacts** - Messages de contact reçus
2. **Réservations** - Réservations de stands
3. **Tombola** - Participations à la tombola
4. **Candidatures Pitch** - Candidatures au concours de pitch
5. **Badges Visiteurs** - Demandes de badges visiteurs
6. **Badges Presse** - Demandes de badges presse
7. **Panélistes** - Candidatures de panélistes
8. **Articles** - Articles d'actualité
9. **Partenaires** - Partenaires SIAB
10. **Exposants** - Exposants SIAB
11. **Représentants** - Représentants SIAB par pays

## Utilisation

### Recherche

1. Accédez à un modèle depuis le dashboard
2. Utilisez la barre de recherche pour filtrer les données
3. Les résultats sont filtrés en temps réel

### Export PDF

1. Depuis la page d'un modèle, cliquez sur "📥 Télécharger en PDF"
2. Le PDF contiendra toutes les données visibles (filtrées si une recherche est active)
3. Le fichier est nommé automatiquement avec le nom du modèle et la date/heure

## Installation

L'application est déjà configurée dans `settings.py` et les URLs sont intégrées dans `siab_backend/urls.py`.

### Dépendances

- `reportlab==4.0.7` - Pour la génération de PDFs (déjà ajouté dans `requirements.txt`)

## Structure des fichiers

```
custom_admin/
├── __init__.py
├── apps.py
├── urls.py
├── views.py
├── templatetags/
│   ├── __init__.py
│   └── admin_tags.py
└── README.md

templates/custom_admin/
├── dashboard.html
├── model_list.html
└── error.html

static/css/
└── custom_admin.css
```

## Personnalisation

Pour ajouter un nouveau modèle :

1. Ajoutez-le dans `MODELS_CONFIG` dans `views.py`
2. Définissez les champs à afficher et les champs de recherche
3. Le modèle apparaîtra automatiquement dans le dashboard

