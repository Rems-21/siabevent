# Architecture des Données - SIAB Events

## 📊 Flux de Données

Tous les formulaires de l'application envoient leurs données **directement au backend Django**, qui les sauvegarde dans la base de données. L'envoi d'email est **optionnel** et peut être activé/désactivé selon les besoins.

## 🔄 Processus Standard

```
Formulaire Frontend → Backend Django → Base de Données
                                    ↓
                            (Optionnel) Email de notification
```

### 1. Soumission du Formulaire

L'utilisateur remplit un formulaire sur le site web et clique sur "Envoyer".

### 2. Envoi au Backend

Les données sont envoyées via une requête POST au backend Django (pas d'envoi direct par email).

### 3. Sauvegarde dans la Base de Données

**TOUJOURS effectué** - Les données sont sauvegardées dans la base de données PostgreSQL/SQLite.

### 4. Notification Email (Optionnel)

Si activé dans les paramètres, un email de notification peut être envoyé à l'administrateur.

## 📝 Formulaires Disponibles

### 1. Formulaire de Contact (`/contacts`)

**Endpoint** : `POST /api/submit-contact/`

**Données sauvegardées** :
- Nom, Prénom
- Email, Téléphone
- Pays
- Sujet, Message
- Consentement RGPD

**Modèle** : `Contact` (dans `contacts/models.py`)

**Email** : Optionnel (configurable via `SEND_EMAIL_NOTIFICATIONS`)

---

### 2. Formulaire Paneliste (`/paneliste`)

**Endpoint** : `POST /api/submit-paneliste/`

**Données sauvegardées** :
- Nom, Prénom
- Email, Téléphone
- Pays d'origine
- Thème d'expertise
- Message
- Fichier CV (upload)

**Modèle** : `Paneliste` (dans `panelistes/models.py`)

**Email** : Non configuré (données uniquement dans la BDD)

---

### 3. Badge Presse (`/presse`)

**Endpoint** : `POST /api/submit-badge-presse/`

**Données sauvegardées** :
- Nom, Prénom
- Email, Téléphone
- Nom du média
- Type de média
- Pays d'origine du média
- Message
- Emails des collaborateurs

**Modèle** : `BadgePresse` (dans `presse/models.py`)

**Email** : Non configuré (données uniquement dans la BDD)

---

### 4. Réservation de Stand (`/reservation`)

**Endpoint** : `POST /api/submit-reservation/`

**Données sauvegardées** :
- Informations entreprise
- Contact principal
- Type et nombre de stands
- Options supplémentaires
- Besoins spécifiques

**Modèle** : `Reservation` (dans `reservations/models.py`)

**Email** : Non configuré (données uniquement dans la BDD)

---

### 5. Participation Tombola (`/tombola`)

**Endpoint** : `POST /api/create-tombola-checkout/`

**Données sauvegardées** :
- Nom, Prénom
- Email, Téléphone
- Pays
- Nombre de tickets
- Montant total
- Statut de paiement (via Stripe)
- Numéros de tickets générés

**Modèle** : `ParticipationTombola` (dans `tombola/models.py`)

**Paiement** : Intégration Stripe

**Email** : Non configuré (données uniquement dans la BDD)

---

### 6. Candidature Pitch (`/pitch`)

**Endpoint** : `POST /api/submit-pitch/`

**Données sauvegardées** :
- Informations porteur de projet
- Informations projet
- Domaine d'activité
- Résumé exécutif
- Montant de financement recherché
- Documents (Pitch, Business Plan)
- Lien vidéo
- Statut de paiement (via Stripe)

**Modèle** : `CandidaturePitch` (dans `pitch/models.py`)

**Paiement** : Intégration Stripe (frais de dossier)

**Email** : Non configuré (données uniquement dans la BDD)

---

## 🔧 Configuration

### Activer les Notifications Email

Dans votre fichier `.env` ou variables d'environnement :

```env
# Activer les notifications par email (optionnel)
SEND_EMAIL_NOTIFICATIONS=True

# Configuration email (requis si SEND_EMAIL_NOTIFICATIONS=True)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre.email@gmail.com
EMAIL_HOST_PASSWORD=votre_mot_de_passe_application
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com
```

### Désactiver les Notifications Email

```env
SEND_EMAIL_NOTIFICATIONS=False
```

Les données seront toujours sauvegardées dans la base de données, mais aucun email ne sera envoyé.

## 📊 Accès aux Données

### Interface d'Administration Django

Toutes les données sont accessibles via l'interface d'administration Django :

- **URL** : `https://votre-domaine.com/admin/`
- **Contacts** : `/admin/contacts/contact/`
- **Panelistes** : `/admin/panelistes/paneliste/`
- **Presse** : `/admin/presse/badgepresse/`
- **Réservations** : `/admin/reservations/reservation/`
- **Tombola** : `/admin/tombola/participationtombola/`
- **Pitch** : `/admin/pitch/candidaturepitch/`

### API REST (Optionnel)

Vous pouvez créer des endpoints API pour accéder aux données :

```python
# Exemple dans views.py
from rest_framework import viewsets
from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
```

## 🔐 Sécurité

- ✅ Toutes les données sont validées côté serveur
- ✅ Protection CSRF activée
- ✅ Validation des champs obligatoires
- ✅ Upload de fichiers sécurisé
- ✅ Données sensibles stockées de manière sécurisée

## 📈 Statistiques

Vous pouvez consulter les statistiques dans l'interface d'administration :

- Nombre de contacts reçus
- Nombre de candidatures pitch
- Nombre de participations tombola
- Nombre de réservations
- etc.

## 🚀 En Production

1. **Base de données** : Utilisez PostgreSQL (pas SQLite)
2. **Sauvegardes** : Configurez des sauvegardes régulières
3. **Notifications** : Activez les emails si nécessaire
4. **Monitoring** : Surveillez les logs pour détecter les erreurs

---

**Important** : Toutes les données sont **toujours** sauvegardées dans la base de données, indépendamment de la configuration email. L'email est uniquement une notification optionnelle pour l'administrateur.

