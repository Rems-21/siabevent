from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import Reservation


def reservation_page(request):
    """Vue pour afficher la page de réservation"""
    return render(request, 'reservation.html')


@require_http_methods(["POST"])
def submit_reservation(request):
    """Vue pour traiter la soumission du formulaire de réservation"""
    try:
        # Récupérer les données du formulaire
        reservation = Reservation(
            # Informations entreprise
            nom_entreprise=request.POST.get('nom_entreprise'),
            secteur_activite=request.POST.get('secteur_activite'),
            adresse=request.POST.get('adresse'),
            ville=request.POST.get('ville'),
            pays=request.POST.get('pays'),
            telephone=request.POST.get('telephone'),
            email=request.POST.get('email'),
            site_web=request.POST.get('site_web'),
            
            # Contact principal
            nom_contact=request.POST.get('nom_contact'),
            fonction_contact=request.POST.get('fonction_contact'),
            telephone_contact=request.POST.get('telephone_contact'),
            email_contact=request.POST.get('email_contact'),
            
            # Stand
            type_stand=request.POST.get('type_stand'),
            nombre_stands=int(request.POST.get('nombre_stands', 1)),
            
            # Options
            mobilier_supplementaire=request.POST.get('mobilier_supplementaire') == 'on',
            eclairage_supplementaire=request.POST.get('eclairage_supplementaire') == 'on',
            branchement_electrique=request.POST.get('branchement_electrique') == 'on',
            connexion_internet=request.POST.get('connexion_internet') == 'on',
            
            # Commentaires
            besoins_specifiques=request.POST.get('besoins_specifiques', '')
        )
        
        reservation.save()
        
        messages.success(
            request, 
            'Votre réservation a été enregistrée avec succès ! Nous vous contacterons dans les plus brefs délais.'
        )
        return redirect('reservation_success')
        
    except Exception as e:
        messages.error(
            request, 
            f'Une erreur est survenue lors de l\'enregistrement de votre réservation. Veuillez réessayer.'
        )
        return redirect('reservation')


def reservation_success(request):
    """Vue pour la page de confirmation de réservation"""
    return render(request, 'reservation_success.html')
