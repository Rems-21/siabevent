from django.shortcuts import render
from .models import Partenaire, Exposant, Representant

def index_page(request):
    """Vue pour la page d'accueil avec les données dynamiques"""
    # Récupérer les partenaires actifs
    partenaires = Partenaire.objects.filter(actif=True)
    
    # Récupérer les exposants actifs
    exposants = Exposant.objects.filter(actif=True)
    
    # Récupérer les représentants actifs avec leurs pays
    representants = Representant.objects.filter(actif=True).prefetch_related('pays')
    
    context = {
        'partenaires': partenaires,
        'exposants': exposants,
        'representants': representants,
    }
    
    return render(request, 'index.html', context)
