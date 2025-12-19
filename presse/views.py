from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import BadgePresse
import json


def presse_page(request):
    """Vue pour afficher la page presse"""
    return render(request, 'presse.html')


@require_http_methods(["POST"])
def submit_badge_presse(request):
    """Vue pour traiter la soumission du formulaire badge presse"""
    try:
        # Récupérer les emails des collaborateurs (envoyés comme JSON ou liste)
        emails_collaborateurs = request.POST.get('emails_collaborateurs', '')
        
        badge = BadgePresse(
            prenom=request.POST.get('prenom'),
            nom=request.POST.get('nom'),
            nom_media=request.POST.get('nom_media'),
            type_media=request.POST.get('type_media'),
            pays_origine_media=request.POST.get('pays_origine_media'),
            code_pays=request.POST.get('code_pays'),
            telephone=request.POST.get('telephone'),
            email=request.POST.get('email'),
            message=request.POST.get('message', ''),
            emails_collaborateurs=emails_collaborateurs
        )
        
        badge.save()
        
        messages.success(
            request, 
            'Votre demande de badge presse a été enregistrée avec succès !'
        )
        return redirect('presse_success')
        
    except Exception as e:
        messages.error(
            request, 
            f'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.'
        )
        return redirect('presse')


def presse_success(request):
    """Vue pour la page de confirmation badge presse"""
    return render(request, 'presse_success.html')

