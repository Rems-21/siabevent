from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils import timezone
from .models import ParticipationTombola
import stripe
import random
import string
import logging

# Configuration du logger
logger = logging.getLogger(__name__)

# Configuration Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

def tombola_page(request):
    """Vue pour afficher la page tombola"""
    return render(request, 'tombola.html')

@require_http_methods(["POST"])
def create_tombola_checkout(request):
    """Créer une session de paiement Stripe pour la tombola"""
    try:
        # Récupération des données
        nom = request.POST.get('nom', '').strip()
        prenom = request.POST.get('prenom', '').strip()
        email = request.POST.get('email', '').strip()
        telephone = request.POST.get('telephone', '').strip()
        pays = request.POST.get('pays', '').strip()
        lot = request.POST.get('lot', 'lot1').strip()
        nombre_tickets = int(request.POST.get('nombre_tickets', 1))
        
        # Validation
        if not all([nom, prenom, email, telephone, pays]):
            return JsonResponse({'success': False, 'message': 'Tous les champs sont obligatoires.'}, status=400)
        
        if nombre_tickets < 1 or nombre_tickets > 100:
            return JsonResponse({'success': False, 'message': 'Nombre de tickets invalide (1-100).'}, status=400)
        
        if lot not in ['lot1', 'lot2']:
            return JsonResponse({'success': False, 'message': 'Lot invalide.'}, status=400)
        
        # Prix unitaire selon le lot (en euros)
        prix_unitaire = 5.00 if lot == 'lot1' else 10.00
        montant_total = nombre_tickets * prix_unitaire
        
        # Créer la participation dans la base de données
        participation = ParticipationTombola.objects.create(
            nom=nom,
            prenom=prenom,
            email=email,
            telephone=telephone,
            pays=pays,
            lot=lot,
            nombre_tickets=nombre_tickets,
            prix_unitaire=prix_unitaire,
            montant_total=montant_total,
            statut='pending'
        )
        
        # Créer une session Stripe Checkout
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': f'SIAB 2026 - Tombola ({nombre_tickets} ticket{"s" if nombre_tickets > 1 else ""})',
                        'description': f'Participation à la tombola du SIAB 2026',
                    },
                    'unit_amount': int(prix_unitaire * 100),  # Stripe utilise les centimes
                },
                'quantity': nombre_tickets,
            }],
            mode='payment',
            success_url=request.build_absolute_uri('/tombola-success') + f'?session_id={{CHECKOUT_SESSION_ID}}&participation_id={participation.id}',
            cancel_url=request.build_absolute_uri('/tombola') + '?cancelled=true',
            customer_email=email,
            metadata={
                'participation_id': participation.id,
                'type': 'tombola'
            }
        )
        
        # Sauvegarder l'ID de la session
        participation.stripe_checkout_session_id = checkout_session.id
        participation.save()
        
        return JsonResponse({
            'success': True,
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Erreur: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def stripe_webhook_tombola(request):
    """Webhook Stripe pour gérer les événements de paiement"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    logger.info("Webhook reçu pour tombola")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        logger.info(f"Événement Stripe reçu: {event['type']}")
    except ValueError as e:
        logger.error(f"Invalid payload: {str(e)}")
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {str(e)}")
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    except Exception as e:
        logger.error(f"Erreur lors de la vérification du webhook: {str(e)}", exc_info=True)
        return JsonResponse({'error': 'Webhook verification failed'}, status=400)
    
    # Gérer l'événement
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        participation_id = session['metadata'].get('participation_id')
        
        logger.info(f"checkout.session.completed - participation_id: {participation_id}")
        
        if participation_id:
            try:
                participation = ParticipationTombola.objects.get(id=participation_id)
                logger.info(f"Participation trouvée: {participation.id} - Statut actuel: {participation.statut}")
                
                participation.statut = 'paid'
                participation.date_paiement = timezone.now()
                participation.stripe_payment_intent_id = session.get('payment_intent')
                
                # Générer les numéros de tickets
                participation.numeros_tickets = ','.join([
                    ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
                    for _ in range(participation.nombre_tickets)
                ])
                
                participation.save()
                logger.info(f"Participation {participation.id} mise à jour avec succès - Statut: {participation.statut}")
                
            except ParticipationTombola.DoesNotExist:
                logger.error(f"Participation {participation_id} non trouvée dans la base de données")
            except Exception as e:
                logger.error(f"Erreur lors de la mise à jour de la participation {participation_id}: {str(e)}", exc_info=True)
        else:
            logger.warning("Aucun participation_id dans les métadonnées de la session")
    else:
        logger.info(f"Événement non géré: {event['type']}")
    
    return JsonResponse({'status': 'success'})

def tombola_success(request):
    """Page de succès après paiement"""
    participation_id = request.GET.get('participation_id')
    session_id = request.GET.get('session_id')
    
    context = {
        'participation_id': participation_id,
        'session_id': session_id
    }
    
    try:
        if participation_id:
            participation = ParticipationTombola.objects.get(id=participation_id)
            context['participation'] = participation
            
            # Vérification manuelle du statut Stripe si le webhook n'a pas fonctionné
            if participation.statut == 'pending' and session_id:
                try:
                    logger.info(f"Vérification manuelle du paiement pour participation {participation_id}")
                    session = stripe.checkout.Session.retrieve(session_id)
                    if session.payment_status == 'paid':
                        logger.info(f"Paiement confirmé manuellement pour participation {participation_id}")
                        participation.statut = 'paid'
                        participation.date_paiement = timezone.now()
                        participation.stripe_payment_intent_id = session.payment_intent
                        
                        # Générer les numéros de tickets si pas déjà fait
                        if not participation.numeros_tickets:
                            participation.numeros_tickets = ','.join([
                                ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
                                for _ in range(participation.nombre_tickets)
                            ])
                        
                        participation.save()
                        logger.info(f"Participation {participation_id} mise à jour manuellement avec succès")
                        # Recharger l'objet pour avoir les dernières données
                        participation.refresh_from_db()
                        context['participation'] = participation
                except Exception as e:
                    logger.error(f"Erreur lors de la vérification manuelle: {str(e)}", exc_info=True)
    except ParticipationTombola.DoesNotExist:
        logger.warning(f"Participation {participation_id} non trouvée")
        pass
    
    return render(request, 'tombola_success.html', context)
