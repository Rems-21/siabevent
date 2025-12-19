# 💳 Système de Paiement Stripe - SIAB 2026

## ✅ Ce qui a été créé

### 1. App Django "tombola" 🎫
Gère les participations à la tombola avec paiement Stripe

**Fonctionnalités** :
- Formulaire d'inscription à la tombola
- Sélection du nombre de tickets (10€ par ticket)
- Paiement sécurisé via Stripe Checkout
- Génération automatique de numéros de tickets après paiement
- Page de confirmation avec récapitulatif
- Interface d'administration complète

**URLs** :
- Page formulaire : `/tombola.html`
- Succès : `/tombola-success.html`
- Admin : `/admin/tombola/participationtombola/`

### 2. App Django "pitch" 🎤
Gère les candidatures au concours de pitch avec paiement

**Fonctionnalités** :
- Formulaire en 2 étapes pour soumettre une candidature
- Upload de documents (Pitch deck, Business Plan)
- Paiement des frais de dossier (50€) via Stripe
- Page de confirmation avec prochaines étapes
- Système d'évaluation et notation dans l'admin
- Interface d'administration complète

**URLs** :
- Page formulaire : `/pitch.html`
- Succès : `/pitch-success.html`
- Admin : `/admin/pitch/candidaturepitch/`

### 3. Intégration Stripe
- Configuration complète de Stripe Checkout
- Webhooks pour confirmer les paiements automatiquement
- Support des paiements en mode test et production
- Sécurité 3D Secure activée

## 🚀 Démarrage rapide

### 1. Installer Stripe
```bash
pip install stripe==7.9.0
```

### 2. Configurer Stripe (Mode Test)

Créez un fichier `.env` à la racine :
```env
# Clés Stripe de test (obtenez-les sur dashboard.stripe.com)
STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
```

### 3. Lancer le serveur Django
```bash
python manage.py runserver
```

### 4. Lancer Stripe CLI pour les webhooks (dans un autre terminal)
```bash
# Pour la tombola
stripe listen --forward-to localhost:8000/api/stripe-webhook-tombola/

# OU pour le pitch
stripe listen --forward-to localhost:8000/api/stripe-webhook-pitch/
```

### 5. Tester avec une carte de test

Utilisez la carte Stripe de test :
- **Numéro** : 4242 4242 4242 4242
- **Date** : N'importe quelle date future (ex: 12/30)
- **CVC** : N'importe quel 3 chiffres (ex: 123)

## 📁 Structure des fichiers

```
siab.events/
├── tombola/                    # App Tombola
│   ├── models.py              # Modèle ParticipationTombola
│   ├── views.py               # Vues et paiement Stripe
│   ├── admin.py               # Interface admin
│   ├── urls.py                # URLs
│   └── migrations/
│
├── pitch/                      # App Pitch
│   ├── models.py              # Modèle CandidaturePitch
│   ├── views.py               # Vues et paiement Stripe
│   ├── admin.py               # Interface admin
│   ├── urls.py                # URLs
│   └── migrations/
│
├── templates/
│   ├── tombola_success.html   # Page succès tombola
│   └── pitch_success.html     # Page succès pitch
│
├── siab_backend/
│   ├── settings.py            # Configuration Stripe ajoutée
│   └── urls.py                # Routes principales
│
├── CONFIG_STRIPE.md           # Documentation complète Stripe
└── README_PAIEMENTS.md        # Ce fichier
```

## 🎯 Fonctionnement du flux de paiement

### Tombola
1. Utilisateur remplit le formulaire sur `/tombola.html`
2. Clic sur "Participer" → Redirection vers Stripe Checkout
3. Paiement avec carte bancaire
4. Stripe notifie via webhook → Statut passé à "paid"
5. Numéros de tickets générés automatiquement
6. Redirection vers `/tombola-success.html` avec les détails

### Pitch
1. Utilisateur remplit le formulaire en 2 étapes sur `/pitch.html`
2. Upload des documents (Pitch doc + Business Plan)
3. Clic sur "Envoyer" → Redirection vers Stripe Checkout
4. Paiement des frais de dossier (50€)
5. Stripe notifie via webhook → Statut passé à "paid"
6. Redirection vers `/pitch-success.html` avec les prochaines étapes

## 👨‍💼 Interface d'administration

### Tombola Admin
**URL** : `http://localhost:8000/admin/tombola/participationtombola/`

**Colonnes affichées** :
- Nom, Prénom, Email
- Nombre de tickets, Montant total
- Statut (pending, paid, cancelled)
- Dates d'inscription et paiement

**Actions disponibles** :
- Marquer comme payé (si paiement manuel)
- Annuler une participation
- Filtrer par statut, date, pays
- Rechercher par nom, email, téléphone

### Pitch Admin
**URL** : `http://localhost:8000/admin/pitch/candidaturepitch/`

**Colonnes affichées** :
- Nom du projet, Porteur
- Domaine d'activité
- Statut (pending, paid, selected, rejected)
- Score /100
- Date de soumission

**Actions disponibles** :
- Marquer comme payé
- Sélectionner pour le concours
- Rejeter la candidature
- Voir/télécharger les documents
- Noter et évaluer (score /100)
- Ajouter des notes d'évaluation

## 💰 Tarification

| Produit | Prix | Frais Stripe* | Vous recevez |
|---------|------|---------------|--------------|
| **1 ticket tombola** | 10,00€ | ~0,40€ | ~9,60€ |
| **10 tickets tombola** | 100,00€ | ~1,75€ | ~98,25€ |
| **Frais de dossier pitch** | 50,00€ | ~1,00€ | ~49,00€ |

*Frais Stripe : 1,5% + 0,25€ par transaction en Europe

## 🔐 Sécurité

✅ **Implémenté** :
- Paiements via Stripe Checkout (PCI-DSS compliant)
- Protection CSRF sur les formulaires
- Webhooks sécurisés avec signatures
- Clés API stockées dans variables d'environnement
- Authentification 3D Secure activée
- Validation des données côté serveur

## 📝 Modèles de données

### ParticipationTombola
- Informations personnelles (nom, prénom, email, téléphone, pays)
- Nombre de tickets et montant
- Statut (pending, paid, cancelled)
- IDs de paiement Stripe
- Numéros de tickets générés
- Dates d'inscription et paiement

### CandidaturePitch
- Informations du porteur de projet
- Détails du projet (nom, domaine, résumé)
- Financement recherché
- Documents uploadés (Pitch doc, Business Plan)
- Frais de dossier et statut
- Évaluation (score, notes)
- Dates de soumission, paiement, évaluation

## 🧪 Test complet

### 1. Tester la tombola
```bash
# Terminal 1 : Serveur Django
python manage.py runserver

# Terminal 2 : Webhook Stripe
stripe listen --forward-to localhost:8000/api/stripe-webhook-tombola/
```

1. Allez sur `http://localhost:8000/tombola.html`
2. Remplissez le formulaire
3. Utilisez la carte 4242 4242 4242 4242
4. Vérifiez la page de succès
5. Vérifiez l'admin Django

### 2. Tester le pitch
```bash
# Terminal 1 : Serveur Django
python manage.py runserver

# Terminal 2 : Webhook Stripe
stripe listen --forward-to localhost:8000/api/stripe-webhook-pitch/
```

1. Allez sur `http://localhost:8000/pitch.html`
2. Remplissez les 2 étapes
3. Uploadez des fichiers de test
4. Utilisez la carte 4242 4242 4242 4242
5. Vérifiez la page de succès
6. Vérifiez l'admin Django

## 📚 Documentation

- **Configuration détaillée Stripe** : Voir `CONFIG_STRIPE.md`
- **Documentation Stripe** : https://stripe.com/docs
- **Dashboard Stripe** : https://dashboard.stripe.com
- **Cartes de test** : https://stripe.com/docs/testing

## 🎉 C'est prêt !

Votre système de paiement est maintenant opérationnel !

Pour passer en production :
1. Activez votre compte Stripe
2. Remplacez les clés de test par les clés de production
3. Configurez les webhooks en production
4. Testez avec une vraie carte
5. Lancez ! 🚀

