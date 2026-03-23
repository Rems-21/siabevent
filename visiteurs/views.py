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
        type_biens = ', '.join(request.POST.getlist('type_biens_services'))
        badge = BadgeVisiteur(
            prenom=request.POST.get('prenom'),
            nom=request.POST.get('nom'),
            email=request.POST.get('email'),
            code_pays=request.POST.get('code_pays'),
            telephone=request.POST.get('telephone', ''),
            message=request.POST.get('message', ''),
            profession=request.POST.get('profession', ''),
            profession_autre=request.POST.get('profession_autre', ''),
            sexe=request.POST.get('sexe', ''),
            age=request.POST.get('age', ''),
            type_biens_services=type_biens,
            source_info=request.POST.get('source_info', ''),
            banques_africaines=request.POST.get('banques_africaines', ''),
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

