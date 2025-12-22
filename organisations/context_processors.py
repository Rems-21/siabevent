from .models import Pays

class PaysFooterDict:
    """Classe pour simuler un objet Pays quand les pays ne sont pas en base"""
    def __init__(self, code, nom, code_drapeau=None):
        self.code = code
        self.nom = nom
        self.code_drapeau = code_drapeau or code
    
    def get_flag_url(self, size='w40'):
        """Retourne l'URL du drapeau depuis flagcdn"""
        return f"https://flagcdn.com/{size}/{self.code_drapeau or self.code}.png"

def pays_footer(request):
    """Context processor pour rendre les pays du footer disponibles dans tous les templates"""
    # Codes ISO des 14 pays pour le footer dans l'ordre spécifié
    codes_pays_footer = ['cm', 'ga', 'cd', 'ci', 'tg', 'rw', 'cf', 'bj', 'sn', 'gn', 'bf', 'ml', 'bi', 'sl']
    
    # Noms des pays
    noms_pays = {
        'cm': 'Cameroun',
        'ga': 'Gabon',
        'cd': 'République démocratique du Congo',
        'ci': 'Côte d\'Ivoire',
        'tg': 'Togo',
        'rw': 'Rwanda',
        'cf': 'République centrafricaine',
        'bj': 'Bénin',
        'sn': 'Sénégal',
        'gn': 'Guinée',
        'bf': 'Burkina Faso',
        'ml': 'Mali',
        'bi': 'Burundi',
        'sl': 'Sierra Leone'
    }
    
    # Récupérer les pays depuis la base de données
    pays_db = Pays.objects.filter(code__in=codes_pays_footer)
    
    # Créer un dictionnaire pour un accès rapide
    pays_dict = {p.code.lower(): p for p in pays_db}
    
    # Construire la liste finale dans l'ordre spécifié
    pays_list = []
    for code in codes_pays_footer:
        if code in pays_dict:
            # Utiliser le pays de la base de données
            pays_list.append(pays_dict[code])
        else:
            # Créer un objet dict-like pour les pays non en base
            pays_list.append(PaysFooterDict(code, noms_pays.get(code, code.upper()), code))
    
    return {'pays_footer': pays_list}

