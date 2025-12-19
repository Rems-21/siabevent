from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils import timezone
from .models import CandidaturePitch
import stripe

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
        financement_recherche = request.POST.get('financement', '0').strip()
        lien_video = request.POST.get('video-link', '').strip()
        
        # Fichiers
        document_pitch = request.FILES.get('pitch-doc')
        business_plan = request.FILES.get('business-plan')
        declaration_acceptee = request.POST.get('declaration') == 'on'
        
        # Validation
        if not all([nom_porteur, prenom_porteur, email, telephone, pays_residence, pays_origine, pays_impact,
                   nom_projet, domaine_activite, resume_executif, financement_recherche]):
            return JsonResponse({'success': False, 'message': 'Tous les champs obligatoires doivent être remplis.'}, status=400)
        
        if not document_pitch or not business_plan:
            return JsonResponse({'success': False, 'message': 'Les documents Pitch et Business Plan sont obligatoires.'}, status=400)
        
        if not declaration_acceptee:
            return JsonResponse({'success': False, 'message': 'Vous devez accepter la déclaration.'}, status=400)
        
        try:
            financement_recherche = float(financement_recherche)
        except ValueError:
            return JsonResponse({'success': False, 'message': 'Montant du financement invalide.'}, status=400)
        
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
            financement_recherche=financement_recherche,
            lien_video=lien_video,
            document_pitch=document_pitch,
            business_plan=business_plan,
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
            success_url=request.build_absolute_uri('/pitch-success.html') + f'?session_id={{CHECKOUT_SESSION_ID}}&candidature_id={candidature.id}',
            cancel_url=request.build_absolute_uri('/pitch.html') + '?cancelled=true',
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
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    
    # Gérer l'événement
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        candidature_id = session['metadata'].get('candidature_id')
        
        if candidature_id:
            try:
                candidature = CandidaturePitch.objects.get(id=candidature_id)
                candidature.statut = 'paid'
                candidature.date_paiement = timezone.now()
                candidature.stripe_payment_intent_id = session.get('payment_intent')
                candidature.save()
            except CandidaturePitch.DoesNotExist:
                pass
    
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
    except CandidaturePitch.DoesNotExist:
        pass
    
    return render(request, 'pitch_success.html', context)
