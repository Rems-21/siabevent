from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import Paneliste


def paneliste_page(request):
    """Vue pour afficher la page panéliste"""
    return render(request, 'paneliste.html')


@require_http_methods(["POST"])
def submit_paneliste(request):
    """Vue pour traiter la soumission du formulaire panéliste"""
    try:
        paneliste = Paneliste(
            nom=request.POST.get('nom'),
            prenom=request.POST.get('prenom'),
            pays_origine=request.POST.get('pays_origine'),
            telephone=request.POST.get('telephone'),
            email=request.POST.get('email'),
            theme=request.POST.get('theme'),
            message=request.POST.get('message', '')
        )
        
        # Gérer le fichier CV
        if 'cv_fichier' in request.FILES:
            paneliste.cv_fichier = request.FILES['cv_fichier']
        
        paneliste.save()
        
        messages.success(
            request, 
            'Votre candidature a été enregistrée avec succès ! Nous examinerons votre profil et vous contacterons.'
        )
        return redirect('paneliste_success')
        
    except Exception as e:
        messages.error(
            request, 
            f'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.'
        )
        return redirect('paneliste')


def paneliste_success(request):
    """Vue pour la page de confirmation panéliste"""
    return render(request, 'paneliste_success.html')

