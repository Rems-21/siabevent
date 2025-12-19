from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact

def contacts_page(request):
    """Vue pour afficher la page de contact"""
    return render(request, 'contacts.html')

@require_http_methods(["POST"])
def submit_contact(request):
    """Vue pour traiter le formulaire de contact et envoyer l'email"""
    try:
        # Récupération des données du formulaire
        nom = request.POST.get('nom', '').strip()
        prenom = request.POST.get('prenom', '').strip()
        email = request.POST.get('email', '').strip()
        telephone = request.POST.get('telephone', '').strip()
        pays = request.POST.get('pays', '').strip()
        sujet = request.POST.get('sujet', '').strip()
        message = request.POST.get('message', '').strip()
        consent = request.POST.get('consent') == 'on'
        
        # Validation basique
        if not all([nom, prenom, email, telephone, sujet, message]):
            return JsonResponse({
                'success': False,
                'message': 'Tous les champs obligatoires doivent être remplis.'
            }, status=400)
        
        if not consent:
            return JsonResponse({
                'success': False,
                'message': 'Vous devez accepter le consentement pour continuer.'
            }, status=400)
        
        # Sauvegarder dans la base de données (TOUJOURS effectué)
        contact = Contact.objects.create(
            nom=nom,
            prenom=prenom,
            email=email,
            telephone=telephone,
            pays=pays,
            sujet=sujet,
            message=message,
            consent=consent
        )
        
        # Envoi d'email optionnel (seulement si activé dans les paramètres)
        email_sent = False
        if settings.SEND_EMAIL_NOTIFICATIONS:
            try:
                # Préparer l'email
                subject = f'SIAB 2026 - Nouveau message de contact: {sujet}'
                email_message = f"""
Nouveau message de contact reçu sur le site SIAB 2026

--------------------------------------------------
INFORMATIONS DU CONTACT
--------------------------------------------------
Nom: {nom}
Prénom: {prenom}
Email: {email}
Téléphone: {telephone}
Pays: {pays if pays else 'Non spécifié'}

--------------------------------------------------
SUJET
--------------------------------------------------
{sujet}

--------------------------------------------------
MESSAGE
--------------------------------------------------
{message}

--------------------------------------------------
Date de réception: {contact.date_creation.strftime('%d/%m/%Y à %H:%M')}
--------------------------------------------------

Ce message a été envoyé depuis le formulaire de contact du site SIAB 2026.
Vous pouvez consulter ce message dans l'interface d'administration Django.
"""
                
                # Envoyer l'email
                send_mail(
                    subject=subject,
                    message=email_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_EMAIL],
                    fail_silently=True,  # Ne pas faire échouer la requête si l'email échoue
                )
                email_sent = True
            except Exception as e:
                print(f"Erreur lors de l'envoi de l'email (non bloquant): {str(e)}")
                email_sent = False
        
        return JsonResponse({
            'success': True,
            'message': 'Votre message a bien été enregistré. Nous vous contacterons dans les plus brefs délais.',
            'email_sent': email_sent,
            'contact_id': contact.id
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Une erreur est survenue: {str(e)}'
        }, status=500)
