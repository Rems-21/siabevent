from django.shortcuts import render
from panelistes.models import Paneliste
from .models import Partenaire, Exposant, Representant

def index_page(request):
    """Vue pour la page d'accueil avec les données dynamiques"""
    # Récupérer les partenaires actifs
    partenaires = Partenaire.objects.filter(actif=True)
    
    # Récupérer les exposants actifs
    exposants = Exposant.objects.filter(actif=True)
    
    # Récupérer les représentants actifs avec leurs pays
    representants = Representant.objects.filter(actif=True).prefetch_related('pays')
    
    # Note: pays_footer est maintenant géré par le context processor
    context = {
        'partenaires': partenaires,
        'exposants': exposants,
        'representants': representants,
    }
    
    return render(request, 'index.html', context)

def participant_page(request):
    """Vue pour la page participant avec données dynamiques."""
    partenaires = Partenaire.objects.filter(actif=True)
    exposants = Exposant.objects.filter(actif=True)
    conferenciers = Paneliste.objects.filter(statut='accepte')
    context = {
        'partenaires': partenaires,
        'exposants': exposants,
        'conferenciers': conferenciers,
    }
    return render(request, 'participant.html', context)
