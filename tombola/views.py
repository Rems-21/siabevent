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
    
    logger.info("🔔 Webhook reçu pour tombola")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        logger.info(f"✅ Signature validée - Event: {event['type']}")
    except ValueError as e:
        logger.error(f"❌ Erreur payload webhook: {str(e)}")
        return JsonResponse({'status': 'error'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"❌ Erreur signature webhook: {str(e)}")
        return JsonResponse({'status': 'error'}, status=400)
    
    # ✅ GÉRER L'ÉVÉNEMENT CHECKOUT.SESSION.COMPLETED
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        participation_id = session['metadata'].get('participation_id')
        
        logger.info(f"💰 checkout.session.completed reçu - participation_id: {participation_id}")
        
        if participation_id:
            try:
                participation = ParticipationTombola.objects.get(id=participation_id)
                logger.info(f"📝 Participation trouvée: {participation.id}")
                
                # ✅ METTRE À JOUR LE STATUT À "PAID"
                # Cela déclenchera la méthode save() qui génèrera les tickets
                participation.statut = 'paid'
                participation.date_paiement = timezone.now()
                participation.stripe_payment_intent_id = session.get('payment_intent')
                participation.save()  # ← Les tickets sont générés ICI !
                
                logger.info(f"✅ STATUT MISE À JOUR: {participation.id} → 'paid'")
                logger.info(f"✅ Tickets générés: {participation.numeros_tickets}")
                
            except ParticipationTombola.DoesNotExist:
                logger.error(f"❌ Participation {participation_id} NON TROUVÉE!")
            except Exception as e:
                logger.error(f"❌ Erreur critique webhook: {str(e)}", exc_info=True)
    
    # Toujours retourner 200 à Stripe
    return JsonResponse({'status': 'success'})


def tombola_success(request):
    """Page de succès après paiement"""
    participation_id = request.GET.get('participation_id')
    session_id = request.GET.get('session_id')
    
    context = {
        'participation': None,
        'participation_id': participation_id,
        'session_id': session_id,
        'statut_paiement': None
    }
    
    if participation_id:
        try:
            participation = ParticipationTombola.objects.get(id=participation_id)
            logger.info(f"📄 Page success - Participation: {participation.id}, Statut: {participation.statut}")
            
            # ✅ Si statut est pending, vérifier auprès de Stripe
            if participation.statut == 'pending' and session_id:
                try:
                    logger.info(f"🔍 Vérification manuelle du paiement pour session {session_id}")
                    session = stripe.checkout.Session.retrieve(session_id)
                    
                    if session.payment_status == 'paid':
                        logger.info(f"✅ Paiement confirmé par Stripe - Mise à jour...")
                        participation.statut = 'paid'
                        participation.date_paiement = timezone.now()
                        participation.stripe_payment_intent_id = session.payment_intent
                        participation.save()  # ← Les tickets sont générés ICI aussi !
                        
                        logger.info(f"✅ STATUT MISE À JOUR (fallback): {participation.id} → 'paid'")
                        logger.info(f"✅ Tickets générés: {participation.numeros_tickets}")
                    else:
                        logger.warning(f"⏳ Paiement en cours - Status: {session.payment_status}")
                
                except Exception as e:
                    logger.error(f"❌ Erreur vérification manuelle: {str(e)}")
            
            # ✅ AJOUTER LA PARTICIPATION AU CONTEXTE
            context['participation'] = participation
            context['statut_paiement'] = participation.statut
            
            logger.info(f"✅ Context mise à jour - Statut: {context['statut_paiement']}")
            
        except ParticipationTombola.DoesNotExist:
            logger.warning(f"⚠️ Participation {participation_id} non trouvée")
            context['erreur'] = "Participation introuvable"
        except Exception as e:
            logger.error(f"❌ Erreur page success: {str(e)}", exc_info=True)
            context['erreur'] = "Erreur lors du traitement"
    
    return render(request, 'tombola_success.html', context)
