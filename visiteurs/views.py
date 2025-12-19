from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import BadgeVisiteur


def visiter_page(request):
    """Vue pour afficher la page visiteur"""
    return render(request, 'visiter.html')


@require_http_methods(["POST"])
def submit_badge(request):
    """Vue pour traiter la soumission du formulaire badge visiteur"""
    try:
        badge = BadgeVisiteur(
            prenom=request.POST.get('prenom'),
            nom=request.POST.get('nom'),
            email=request.POST.get('email'),
            code_pays=request.POST.get('code_pays'),
            telephone=request.POST.get('telephone', ''),
            message=request.POST.get('message', '')
        )
        
        badge.save()
        
        messages.success(
            request, 
            'Votre demande de badge visiteur a été enregistrée avec succès ! Vous recevrez votre badge par email.'
        )
        return redirect('badge_success')
        
    except Exception as e:
        messages.error(
            request, 
            f'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.'
        )
        return redirect('visiter')


def badge_success(request):
    """Vue pour la page de confirmation badge visiteur"""
    return render(request, 'badge_success.html')

