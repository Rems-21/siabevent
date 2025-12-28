from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils import timezone
from .models import CandidaturePitch
import stripe
import logging

# Configuration du logger
logger = logging.getLogger(__name__)

# Configuration Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

def pitch_page(request):
    """Vue pour afficher la page pitch"""
    return render(request, 'pitch.html')

@require_http_methods(["POST"])
def submit_pitch(request):
    """Soumettre une candidature au pitch et créer une session de paiement"""
    try:
        # Récupération des données du formulaire
        nom_porteur = request.POST.get('nom', '').strip()
        prenom_porteur = request.POST.get('prenom', '').strip()
        email = request.POST.get('email', '').strip()
        indicatif_pays = request.POST.get('indicatif', '').strip()
        telephone = request.POST.get('telephone', '').strip()
        pays_residence = request.POST.get('pays-residence', '').strip()
        pays_origine = request.POST.get('pays-origine', '').strip()
        pays_impact = request.POST.get('pays-impact', '').strip()
        
        nom_projet = request.POST.get('nom-projet', '').strip()
        domaine_activite = request.POST.get('domaine', '').strip()
        resume_executif = request.POST.get('resume', '').strip()
        nombre_projets_realises = request.POST.get('financement', '').strip()
        lien_video = request.POST.get('video-link', '').strip()
        
        # Fichiers
        document_presentation = request.FILES.get('pitch-doc')
        logo = request.FILES.get('business-plan')
        declaration_acceptee = request.POST.get('declaration') == 'on'
        
        # Validation
        if not all([nom_porteur, prenom_porteur, email, telephone, pays_residence, pays_origine, pays_impact,
                   nom_projet, domaine_activite, resume_executif]):
            return JsonResponse({'success': False, 'message': 'Tous les champs obligatoires doivent être remplis.'}, status=400)
        
        if not nombre_projets_realises:
            return JsonResponse({'success': False, 'message': 'Le nombre de projets réalisés est obligatoire.'}, status=400)
        
        if not document_presentation or not logo:
            return JsonResponse({'success': False, 'message': 'Le document de présentation et le logo sont obligatoires.'}, status=400)
        
        # Validation des types de fichiers
        document_ext = document_presentation.name.split('.')[-1].lower()
        if document_ext not in ['pdf', 'ppt', 'pptx']:
            return JsonResponse({'success': False, 'message': 'Le document de présentation doit être un fichier PDF, PPT ou PPTX.'}, status=400)
        
        logo_ext = logo.name.split('.')[-1].lower()
        if logo_ext not in ['pdf', 'png', 'jpg', 'jpeg', 'svg']:
            return JsonResponse({'success': False, 'message': 'Le logo doit être un fichier PDF ou image (PNG, JPG, SVG).'}, status=400)
        
        if not declaration_acceptee:
            return JsonResponse({'success': False, 'message': 'Vous devez accepter la déclaration.'}, status=400)
        
        try:
            nombre_projets_realises = int(nombre_projets_realises)
            if nombre_projets_realises < 1 or nombre_projets_realises > 25:
                return JsonResponse({'success': False, 'message': 'Le nombre de projets réalisés doit être entre 1 et 25.'}, status=400)
        except ValueError:
            return JsonResponse({'success': False, 'message': 'Nombre de projets réalisés invalide.'}, status=400)
        
        # Frais de dossier (50€)
        frais_dossier = 50.00
        
        # Créer la candidature dans la base de données
        candidature = CandidaturePitch.objects.create(
            nom_porteur=nom_porteur,
            prenom_porteur=prenom_porteur,
            email=email,
            indicatif_pays=indicatif_pays,
            telephone=telephone,
            pays_residence=pays_residence,
            pays_origine=pays_origine,
            pays_impact=pays_impact,
            nom_projet=nom_projet,
            domaine_activite=domaine_activite,
            resume_executif=resume_executif,
            nombre_projets_realises=nombre_projets_realises,
            lien_video=lien_video,
            document_presentation=document_presentation,
            logo=logo,
            declaration_acceptee=declaration_acceptee,
            frais_dossier=frais_dossier,
            statut='pending'
        )
        
        # Créer une session Stripe Checkout
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': 'SIAB 2026 - Frais de dossier Pitch',
                        'description': f'Candidature au concours de pitch - Projet: {nom_projet}',
                    },
                    'unit_amount': int(frais_dossier * 100),  # Stripe utilise les centimes
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=request.build_absolute_uri('/pitch-success') + f'?session_id={{CHECKOUT_SESSION_ID}}&candidature_id={candidature.id}',
            cancel_url=request.build_absolute_uri('/pitch') + '?cancelled=true',
            customer_email=email,
            metadata={
                'candidature_id': candidature.id,
                'type': 'pitch',
                'nom_projet': nom_projet
            }
        )
        
        # Sauvegarder l'ID de la session
        candidature.stripe_checkout_session_id = checkout_session.id
        candidature.save()
        
        return JsonResponse({
            'success': True,
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Erreur: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def stripe_webhook_pitch(request):
    """Webhook Stripe pour gérer les événements de paiement"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    logger.info("Webhook reçu pour pitch")
    
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
        candidature_id = session['metadata'].get('candidature_id')
        
        logger.info(f"checkout.session.completed - candidature_id: {candidature_id}")
        
        if candidature_id:
            try:
                candidature = CandidaturePitch.objects.get(id=candidature_id)
                logger.info(f"Candidature trouvée: {candidature.id} - Statut actuel: {candidature.statut}")
                
                candidature.statut = 'paid'
                candidature.date_paiement = timezone.now()
                candidature.stripe_payment_intent_id = session.get('payment_intent')
                
                candidature.save()
                logger.info(f"Candidature {candidature.id} mise à jour avec succès - Statut: {candidature.statut}")
                
            except CandidaturePitch.DoesNotExist:
                logger.error(f"Candidature {candidature_id} non trouvée dans la base de données")
            except Exception as e:
                logger.error(f"Erreur lors de la mise à jour de la candidature {candidature_id}: {str(e)}", exc_info=True)
        else:
            logger.warning("Aucun candidature_id dans les métadonnées de la session")
    else:
        logger.info(f"Événement non géré: {event['type']}")
    
    return JsonResponse({'status': 'success'})

def pitch_success(request):
    """Page de succès après paiement"""
    candidature_id = request.GET.get('candidature_id')
    session_id = request.GET.get('session_id')
    
    context = {
        'candidature_id': candidature_id,
        'session_id': session_id
    }
    
    try:
        if candidature_id:
            candidature = CandidaturePitch.objects.get(id=candidature_id)
            context['candidature'] = candidature
            
            # Vérification manuelle du statut Stripe si le webhook n'a pas fonctionné
            if candidature.statut == 'pending' and session_id:
                try:
                    logger.info(f"Vérification manuelle du paiement pour candidature {candidature_id}")
                    session = stripe.checkout.Session.retrieve(session_id)
                    if session.payment_status == 'paid':
                        logger.info(f"Paiement confirmé manuellement pour candidature {candidature_id}")
                        candidature.statut = 'paid'
                        candidature.date_paiement = timezone.now()
                        candidature.stripe_payment_intent_id = session.payment_intent
                        candidature.save()
                        logger.info(f"Candidature {candidature_id} mise à jour manuellement avec succès")
                        # Recharger l'objet pour avoir les dernières données
                        candidature.refresh_from_db()
                        context['candidature'] = candidature
                except Exception as e:
                    logger.error(f"Erreur lors de la vérification manuelle: {str(e)}", exc_info=True)
    except CandidaturePitch.DoesNotExist:
        logger.warning(f"Candidature {candidature_id} non trouvée")
        pass
    
    return render(request, 'pitch_success.html', context)
