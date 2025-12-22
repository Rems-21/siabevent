# Configuration Stripe pour SIAB 2026

## 💳 Paiements en ligne avec Stripe

Le site SIAB 2026 utilise **Stripe** pour gérer les paiements en ligne de manière sécurisée pour :
- **Tombola** : Achat de tickets (10€ par ticket)
- **Pitch** : Frais de dossier pour candidature (50€)

## 🚀 Installation et Configuration

### Étape 1 : Créer un compte Stripe

1. Allez sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Créez un compte gratuit
3. Accédez au **Dashboard Stripe**

### Étape 2 : Obtenir les clés API

1. Dans le Dashboard Stripe, allez dans **Développeurs** > **Clés API**
2. Vous verrez deux types de clés :
   - **Clés de test** (pour le développement) : Commencent par `pk_test_` et `sk_test_`
   - **Clés en production** (pour la mise en ligne) : Commencent par `pk_live_` et `sk_live_`

3. Copiez vos clés de test pour commencer

### Étape 3 : Configurer les variables d'environnement

Créez ou modifiez le fichier `.env` à la racine du projet :

```env
# Clés Stripe (Mode Test pour le développement)
STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook_ici
```

### Étape 4 : Configurer les Webhooks (Important !)

Les webhooks permettent à Stripe de notifier votre application quand un paiement est complété.

#### Option A : Webhooks locaux (Développement)

1. **Installer Stripe CLI** :
   - Windows : Téléchargez depuis [https://github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases)
   - Mac : `brew install stripe/stripe-cli/stripe`
   - Linux : `sudo apt install stripe`

2. **Se connecter** :
   ```bash
   stripe login
   ```

3. **Lancer le serveur Django** (dans un terminal) :
   ```bash
   python manage.py runserver
   ```

4. **Écouter les webhooks** (dans un autre terminal) :
   ```bash
   # Pour la tombola
   stripe listen --forward-to localhost:8000/api/stripe-webhook-tombola/
   
   # Pour le pitch
   stripe listen --forward-to localhost:8000/api/stripe-webhook-pitch/
   ```

5. **Copier le secret webhook** affiché dans le terminal et l'ajouter dans `.env`

#### Option B : Webhooks en production

1. Allez dans **Développeurs** > **Webhooks** dans le Dashboard Stripe
2. Cliquez sur **Ajouter un endpoint**
3. Ajoutez vos URLs de webhook :
   - `https://siab.events/api/stripe-webhook-tombola/`
4. Sélectionnez les événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copiez le **secret de signature** et ajoutez-le dans vos variables d'environnement

## 🧪 Test des paiements

### Cartes bancaires de test

Stripe fournit des cartes de test pour simuler différents scénarios :

| Numéro de carte | Description |
|----------------|-------------|
| 4242 4242 4242 4242 | Paiement réussi |
| 4000 0000 0000 0002 | Paiement refusé (carte refusée) |
| 4000 0000 0000 9995 | Paiement refusé (fonds insuffisants) |
| 4000 0025 0000 3155 | Nécessite authentification 3D Secure |

- **Date d'expiration** : N'importe quelle date future (ex: 12/30)
- **CVC** : N'importe quel nombre de 3 chiffres (ex: 123)
- **Code postal** : N'importe quel code postal

### Tester la tombola

1. Allez sur `http://localhost:8000/tombola.html`
2. Remplissez le formulaire
3. Cliquez sur "Participer"
4. Utilisez une carte de test Stripe
5. Vérifiez que vous êtes redirigé vers la page de succès
6. Vérifiez dans l'admin Django : `http://localhost:8000/admin/tombola/participationtombola/`

### Tester le pitch

1. Allez sur `http://localhost:8000/pitch.html`
2. Remplissez le formulaire en 2 étapes
3. Téléchargez les documents requis
4. Cliquez sur "Envoyer votre Candidature"
5. Utilisez une carte de test Stripe
6. Vérifiez que vous êtes redirigé vers la page de succès
7. Vérifiez dans l'admin Django : `http://localhost:8000/admin/pitch/candidaturepitch/`

## 📊 Gestion dans l'admin Django

### Tombola

**URL** : `http://localhost:8000/admin/tombola/participationtombola/`

Fonctionnalités :
- Voir toutes les participations
- Filtrer par statut (pending, paid, cancelled)
- Rechercher par nom, email, téléphone
- Voir les numéros de tickets générés
- Marquer comme payé manuellement si nécessaire
- Exporter les données

### Pitch

**URL** : `http://localhost:8000/admin/pitch/candidaturepitch/`

Fonctionnalités :
- Voir toutes les candidatures
- Filtrer par statut (pending, paid, selected, rejected)
- Rechercher par nom de projet, porteur, domaine
- Télécharger les documents (Pitch doc, Business Plan)
- Noter et évaluer les candidatures (score /100)
- Marquer comme sélectionné/rejeté
- Exporter les données

## 💰 Tarification

### Frais Stripe

Stripe prélève des frais sur chaque transaction :
- **Frais standard** : 1,5% + 0,25€ par transaction réussie en Europe
- **Pas de frais mensuels** ni d'abonnement

### Exemple de calcul

- **Tombola (10€ par ticket)** :
  - Prix pour le client : 10,00€
  - Frais Stripe : 0,40€
  - Vous recevez : 9,60€

- **Pitch (50€ frais de dossier)** :
  - Prix pour le client : 50,00€
  - Frais Stripe : 1,00€
  - Vous recevez : 49,00€

## 🔐 Sécurité

### Bonnes pratiques

1. **Ne JAMAIS committer les clés Stripe** dans Git
   - Le fichier `.env` est déjà dans `.gitignore`

2. **Utiliser les clés de test** en développement
   - Les paiements de test n'utilisent pas de vraies cartes

3. **Activer l'authentification 3D Secure**
   - Stripe l'active automatiquement pour respecter les réglementations européennes

4. **Surveiller les transactions suspectes**
   - Utilisez les outils de détection de fraude de Stripe

## 🚨 Dépannage

### Les paiements ne fonctionnent pas

1. Vérifiez que les clés Stripe sont correctement configurées dans `.env`
2. Vérifiez que Stripe CLI est lancé (en développement)
3. Regardez les logs du serveur Django
4. Vérifiez le Dashboard Stripe pour voir les paiements

### Les webhooks ne fonctionnent pas

1. Vérifiez que `STRIPE_WEBHOOK_SECRET` est configuré
2. En développement, assurez-vous que Stripe CLI est lancé
3. Vérifiez les logs de Stripe CLI
4. Testez le webhook manuellement depuis le Dashboard Stripe

### Erreur "CSRF token missing"

1. Assurez-vous que `{% csrf_token %}` est présent dans les formulaires
2. Les webhooks utilisent `@csrf_exempt` car Stripe ne peut pas fournir de token CSRF

## 📚 Documentation Stripe

- **Documentation officielle** : [https://stripe.com/docs](https://stripe.com/docs)
- **API Python** : [https://stripe.com/docs/api/python](https://stripe.com/docs/api/python)
- **Dashboard** : [https://dashboard.stripe.com](https://dashboard.stripe.com)
- **Stripe CLI** : [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

## 🎯 Passage en production

Quand vous êtes prêt à accepter de vrais paiements :

1. **Activez votre compte Stripe** en fournissant vos informations bancaires
2. **Changez les clés** de test par les clés en production dans `.env`
3. **Configurez les webhooks** en production (pas avec Stripe CLI)
4. **Testez** avec une vraie carte (puis remboursez-vous)
5. **Surveillez** le Dashboard Stripe régulièrement

## ✅ Checklist avant mise en production

- [ ] Compte Stripe activé et vérifié
- [ ] Clés de production configurées
- [ ] Webhooks en production configurés et testés
- [ ] SSL/HTTPS activé sur le site
- [ ] Conditions générales de vente ajoutées
- [ ] Politique de remboursement définie
- [ ] Tests de paiement effectués avec succès
- [ ] Admin Django sécurisé (mot de passe fort)
- [ ] Logs de paiement en place
- [ ] Email de confirmation configuré

---

🎉 **Vous êtes maintenant prêt à accepter des paiements avec Stripe !**

Pour toute question : [https://support.stripe.com](https://support.stripe.com)

