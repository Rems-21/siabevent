# Configuration Email pour SIAB 2026

## 📧 Notifications Email (Optionnelles)

**Important** : Tous les formulaires envoient leurs données **directement au backend Django** qui les sauvegarde dans la base de données. L'envoi d'email est **optionnel** et sert uniquement de notification pour l'administrateur.

Les données sont **toujours** accessibles via l'interface d'administration Django, même si l'email est désactivé.

## 🔧 Configuration en développement

Par défaut :
- Les données sont **toujours** sauvegardées dans la base de données
- Les notifications email sont **désactivées** par défaut (`SEND_EMAIL_NOTIFICATIONS=False`)
- Si activées, en mode DEBUG, les emails s'affichent **dans la console** (terminal où Django tourne)

Aucune configuration supplémentaire n'est nécessaire pour tester ! Les données sont accessibles dans l'admin Django.

## 🚀 Configuration en production

### Activer les notifications email (optionnel)

Pour activer l'envoi d'emails de notification en production, configurez les variables d'environnement suivantes :

**Important** : Même sans email, toutes les données sont sauvegardées dans la base de données et accessibles via l'admin Django.

### Option 1 : Gmail (Recommandé pour démarrer)

1. **Créer un mot de passe d'application Google** :
   - Allez sur : https://myaccount.google.com/apppasswords
   - Connectez-vous avec votre compte Gmail
   - Créez un nouveau mot de passe d'application
   - Copiez le mot de passe généré (16 caractères)

2. **Créer un fichier `.env`** à la racine du projet :

```env
# Activer les notifications par email (optionnel)
SEND_EMAIL_NOTIFICATIONS=True

# Configuration Email Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre.email@gmail.com
EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com
```

**Note** : Si `SEND_EMAIL_NOTIFICATIONS=False` ou n'est pas défini, les données seront toujours sauvegardées mais aucun email ne sera envoyé.

### Option 2 : Autre service SMTP

Modifiez ces variables selon votre fournisseur :

```env
# Activer les notifications par email (optionnel)
SEND_EMAIL_NOTIFICATIONS=True

EMAIL_HOST=smtp.votre-fournisseur.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre.email@example.com
EMAIL_HOST_PASSWORD=votre_mot_de_passe
DEFAULT_FROM_EMAIL=noreply@siab.com
CONTACT_EMAIL=contact@siab.com
```

## 📝 Description des variables

- **SEND_EMAIL_NOTIFICATIONS** : Activer/désactiver l'envoi d'emails (True/False). Par défaut : False
- **EMAIL_HOST** : Serveur SMTP (ex: smtp.gmail.com) - Requis si SEND_EMAIL_NOTIFICATIONS=True
- **EMAIL_PORT** : Port SMTP (587 pour TLS, 465 pour SSL)
- **EMAIL_USE_TLS** : Utiliser TLS (True/False)
- **EMAIL_HOST_USER** : Adresse email qui envoie les messages
- **EMAIL_HOST_PASSWORD** : Mot de passe ou mot de passe d'application
- **DEFAULT_FROM_EMAIL** : Adresse email "expéditeur" visible dans les messages
- **CONTACT_EMAIL** : Adresse email qui **reçoit** les notifications (si activées)

## ✅ Test

1. Remplissez le formulaire de contact sur la page `/contacts.html`
2. Cliquez sur "Envoyer"
3. **Vérifiez la base de données** : Les données sont toujours sauvegardées dans `/admin/contacts/contact/`
4. **Si email activé** :
   - **En développement** : Vérifiez le terminal Django pour voir l'email
   - **En production** : Vérifiez la boîte email configurée dans `CONTACT_EMAIL`

## 🔐 Sécurité

⚠️ **IMPORTANT** :
- Ne committez JAMAIS le fichier `.env` dans Git !
- Le fichier `.env` est déjà dans `.gitignore`
- En production, utilisez les variables d'environnement du serveur

## 📊 Gestion des contacts dans l'admin

**Important** : Tous les messages sont **toujours** sauvegardés dans la base de données Django, même si l'email est désactivé.

**Accès** : http://127.0.0.1:8000/admin/contacts/contact/

Vous pouvez :
- Voir tous les messages reçus
- Filtrer par sujet, date, statut (traité/non traité)
- Marquer les messages comme "traités"
- Rechercher par nom, email, téléphone
- Exporter les données
- Gérer les contacts directement depuis l'interface

**C'est la méthode principale pour consulter les données**, l'email n'est qu'une notification optionnelle.

## 🆘 Dépannage

### Les emails ne s'envoient pas

1. Vérifiez les logs dans le terminal Django
2. Vérifiez que le fichier `.env` existe et est bien configuré
3. Pour Gmail, assurez-vous d'utiliser un **mot de passe d'application**, pas votre mot de passe normal
4. Vérifiez que votre pare-feu autorise les connexions sortantes sur le port 587

### Les emails vont dans les spams

- Configurez les enregistrements SPF et DKIM de votre domaine
- Utilisez un service email professionnel (SendGrid, Mailgun, AWS SES, etc.)

## 📚 Services email recommandés pour la production

- **SendGrid** : 100 emails/jour gratuits
- **Mailgun** : 5000 emails/mois gratuits les 3 premiers mois
- **AWS SES** : Très bon marché si vous utilisez AWS
- **Brevo (ex-Sendinblue)** : 300 emails/jour gratuits

