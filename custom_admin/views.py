from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from django.conf import settings
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.pdfgen import canvas
from io import BytesIO
import os

# Import des modèles
from contacts.models import Contact
from reservations.models import Reservation
from tombola.models import ParticipationTombola
from pitch.models import CandidaturePitch
from visiteurs.models import BadgeVisiteur
from presse.models import BadgePresse
from panelistes.models import Paneliste
from actualites.models import Article
from organisations.models import Partenaire, Exposant, Representant, Pays


# Configuration des modèles disponibles
MODELS_CONFIG = {
    'contacts': {
        'model': Contact,
        'name': 'Contacts',
        'fields': ['nom', 'prenom', 'email', 'telephone', 'pays', 'sujet', 'date_creation'],
        'search_fields': ['nom', 'prenom', 'email', 'sujet', 'message'],
    },
    'reservations': {
        'model': Reservation,
        'name': 'Réservations',
        'fields': ['nom_entreprise', 'email', 'type_stand', 'nombre_stands', 'statut', 'date_reservation'],
        'search_fields': ['nom_entreprise', 'email', 'secteur_activite', 'ville', 'pays'],
    },
    'tombola': {
        'model': ParticipationTombola,
        'name': 'Tombola',
        'fields': ['nom', 'prenom', 'email', 'telephone', 'lot', 'nombre_tickets', 'prix_unitaire', 'numeros_tickets', 'montant_total', 'statut', 'date_inscription'],
        'search_fields': ['nom', 'prenom', 'email', 'telephone', 'pays', 'numeros_tickets', 'lot'],
    },
    'pitch': {
        'model': CandidaturePitch,
        'name': 'Candidatures Pitch',
        'fields': ['nom_projet', 'nom_porteur', 'prenom_porteur', 'email', 'domaine_activite', 'statut', 'date_soumission'],
        'search_fields': ['nom_projet', 'nom_porteur', 'prenom_porteur', 'email', 'domaine_activite'],
    },
    'visiteurs': {
        'model': BadgeVisiteur,
        'name': 'Badges Visiteurs',
        'fields': ['nom', 'prenom', 'email', 'telephone', 'code_pays', 'date_inscription'],
        'search_fields': ['nom', 'prenom', 'email', 'code_pays'],
    },
    'presse': {
        'model': BadgePresse,
        'name': 'Badges Presse',
        'fields': ['nom', 'prenom', 'email', 'nom_media', 'type_media', 'date_demande'],
        'search_fields': ['nom', 'prenom', 'email', 'nom_media'],
    },
    'panelistes': {
        'model': Paneliste,
        'name': 'Panélistes',
        'fields': ['nom', 'prenom', 'email', 'pays_origine', 'theme', 'statut', 'date_candidature'],
        'search_fields': ['nom', 'prenom', 'email', 'pays_origine', 'theme'],
    },
    'articles': {
        'model': Article,
        'name': 'Articles',
        'fields': ['titre', 'date_creation'],
        'search_fields': ['titre', 'resume', 'contenu'],
    },
    'partenaires': {
        'model': Partenaire,
        'name': 'Partenaires',
        'fields': ['nom', 'site_web', 'actif', 'date_creation'],
        'search_fields': ['nom', 'description'],
    },
    'exposants': {
        'model': Exposant,
        'name': 'Exposants',
        'fields': ['nom', 'secteur', 'site_web', 'actif', 'date_creation'],
        'search_fields': ['nom', 'secteur', 'description'],
    },
    'representants': {
        'model': Representant,
        'name': 'Représentants',
        'fields': ['nom', 'titre', 'email', 'telephone', 'actif'],
        'search_fields': ['nom', 'titre', 'email'],
    },
}


@login_required
def admin_dashboard(request):
    """Page principale de l'administration personnalisée"""
    context = {
        'models': MODELS_CONFIG,
    }
    return render(request, 'custom_admin/dashboard.html', context)


@login_required
def model_list(request, model_name):
    """Affiche la liste des données d'un modèle avec recherche"""
    if model_name not in MODELS_CONFIG:
        return render(request, 'custom_admin/error.html', {'error': 'Modèle non trouvé'})
    
    config = MODELS_CONFIG[model_name]
    model = config['model']
    search_query = request.GET.get('search', '')
    
    # Récupérer tous les objets
    queryset = model.objects.all()
    
    # Appliquer la recherche si nécessaire
    if search_query:
        search_fields = config['search_fields']
        q_objects = Q()
        for field in search_fields:
            q_objects |= Q(**{f'{field}__icontains': search_query})
        queryset = queryset.filter(q_objects)
    
    # Pagination simple (50 par page)
    from django.core.paginator import Paginator
    paginator = Paginator(queryset, 50)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    # Préparer les données pour l'affichage
    data_list = []
    for obj in page_obj:
        row_data = {}
        for field in config['fields']:
            try:
                # Vérifier si le champ existe
                if not hasattr(obj, field):
                    row_data[field] = '-'
                else:
                    value = getattr(obj, field, None)
                    if value is None or value == '':
                        row_data[field] = '-'
                    elif isinstance(value, bool):
                        row_data[field] = 'Oui' if value else 'Non'
                    elif hasattr(value, 'strftime'):  # Date/DateTime
                        row_data[field] = value.strftime("%d/%m/%Y %H:%M")
                    elif hasattr(obj, f'get_{field}_display'):  # Pour les choix
                        try:
                            row_data[field] = getattr(obj, f'get_{field}_display')()
                        except:
                            row_data[field] = str(value) if value else '-'
                    else:
                        value_str = str(value)
                        # Limiter la longueur pour l'affichage
                        if len(value_str) > 50:
                            row_data[field] = value_str[:47] + '...'
                        else:
                            row_data[field] = value_str
            except Exception as e:
                # En cas d'erreur, mettre un tiret
                row_data[field] = '-'
        row_data['_obj'] = obj  # Garder l'objet pour référence
        data_list.append(row_data)
    
    context = {
        'model_name': model_name,
        'model_display_name': config['name'],
        'fields': config['fields'],
        'data_list': data_list,
        'page_obj': page_obj,
        'search_query': search_query,
        'total_count': queryset.count(),
    }
    
    return render(request, 'custom_admin/model_list.html', context)


def generate_pdf(model_name, queryset, model_display_name, fields):
    """Génère un PDF avec les données du modèle"""
    buffer = BytesIO()
    
    # Créer le document avec marges réduites
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=1.5*cm,
        bottomMargin=2*cm
    )
    elements = []
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Style pour le titre principal
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1AA45A'),
        spaceAfter=15,
        fontName='Helvetica-Bold',
        alignment=1,  # Centré
    )
    
    # Style pour le sous-titre
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#666666'),
        spaceAfter=20,
        alignment=1,  # Centré
    )
    
    # Style pour les informations
    info_style = ParagraphStyle(
        'CustomInfo',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#333333'),
        spaceAfter=25,
    )
    
    # Ajouter le logo
    logo_path = None
    
    try:
        # Essayer d'abord avec STATICFILES_DIRS (développement)
        if hasattr(settings, 'STATICFILES_DIRS') and settings.STATICFILES_DIRS:
            # STATICFILES_DIRS peut être une liste ou un tuple
            static_dirs = list(settings.STATICFILES_DIRS) if settings.STATICFILES_DIRS else []
            for static_dir in static_dirs:
                try:
                    # Convertir en string si c'est un Path object
                    static_dir_str = str(static_dir)
                    potential_path = os.path.join(static_dir_str, 'images', 'logo.png')
                    if os.path.exists(potential_path):
                        logo_path = potential_path
                        break
                except (TypeError, AttributeError):
                    continue
        
        # Si pas trouvé, essayer avec STATIC_ROOT (production)
        if not logo_path and hasattr(settings, 'STATIC_ROOT') and settings.STATIC_ROOT:
            try:
                static_root_str = str(settings.STATIC_ROOT)
                potential_path = os.path.join(static_root_str, 'images', 'logo.png')
                if os.path.exists(potential_path):
                    logo_path = potential_path
            except (TypeError, AttributeError):
                pass
        
        # Si toujours pas trouvé, essayer avec BASE_DIR
        if not logo_path:
            base_dir = getattr(settings, 'BASE_DIR', None)
            if base_dir:
                try:
                    base_dir_str = str(base_dir)
                    potential_path = os.path.join(base_dir_str, 'static', 'images', 'logo.png')
                    if os.path.exists(potential_path):
                        logo_path = potential_path
                except (TypeError, AttributeError):
                    pass
    except Exception:
        # En cas d'erreur, continuer sans logo
        logo_path = None
    
    if logo_path and os.path.exists(logo_path):
        try:
            # Charger l'image pour obtenir ses dimensions réelles
            from PIL import Image as PILImage
            img = PILImage.open(logo_path)
            img_width, img_height = img.size
            
            # Calculer les dimensions en gardant les proportions
            # Largeur maximale de 3cm, hauteur proportionnelle
            max_width = 3*cm
            aspect_ratio = img_height / img_width
            logo_width = max_width
            logo_height = max_width * aspect_ratio
            
            logo = Image(logo_path, width=logo_width, height=logo_height)
            logo.hAlign = 'CENTER'
            elements.append(logo)
            elements.append(Spacer(1, 0.15*inch))
        except Exception as e:
            # Si le logo ne peut pas être chargé, continuer sans logo
            pass
    
    # Titre principal
    title = Paragraph(f"Rapport: {model_display_name}", title_style)
    elements.append(title)
    
    # Sous-titre
    subtitle = Paragraph("Salon de l'immobilier Africain", subtitle_style)
    elements.append(subtitle)
    elements.append(Spacer(1, 0.15*inch))
    
    # Informations de génération
    date_str = timezone.now().strftime("%d/%m/%Y à %H:%M")
    info_text = f"<b>Généré le:</b> {date_str} | <b>Nombre d'enregistrements:</b> {queryset.count()}"
    info_para = Paragraph(info_text, info_style)
    elements.append(info_para)
    elements.append(Spacer(1, 0.25*inch))
    
    # Tableau des données
    if queryset.exists():
        # En-têtes avec formatage amélioré
        headers = []
        for field in fields:
            # Formater les noms de champs
            header = field.replace('_', ' ').title()
            # Traductions spécifiques
            translations = {
                'Nom': 'Nom',
                'Prenom': 'Prénom',
                'Email': 'Email',
                'Telephone': 'Téléphone',
                'Date Creation': 'Date de création',
                'Date Reservation': 'Date de réservation',
                'Date Inscription': 'Date d\'inscription',
                'Date Soumission': 'Date de soumission',
                'Date Demande': 'Date de demande',
                'Date Candidature': 'Date de candidature',
                'Statut': 'Statut',
                'Type Stand': 'Type de stand',
                'Type Media': 'Type de média',
                'Nombre Stands': 'Nombre de stands',
                'Nombre Tickets': 'Nombre de tickets',
                'Numeros Tickets': 'Numéros de tickets',
                'Montant Total': 'Montant total (€)',
                'Lot': 'Lot choisi',
                'Prix Unitaire': 'Prix unitaire (€)',
            }
            header = translations.get(header, header)
            headers.append(header)
        
        data = [headers]
        
        # Données avec formatage amélioré
        for idx, obj in enumerate(queryset):
            row = []
            for field in fields:
                try:
                    # Vérifier si le champ existe
                    if not hasattr(obj, field):
                        value = '-'
                    else:
                        value = getattr(obj, field, '')
                    
                    if value is None or value == '':
                        value = '-'
                    elif isinstance(value, bool):
                        value = 'Oui' if value else 'Non'
                    elif hasattr(value, 'strftime'):  # Date/DateTime
                        value = value.strftime("%d/%m/%Y %H:%M")
                    elif hasattr(obj, f'get_{field}_display'):  # Pour les choix
                        try:
                            value = getattr(obj, f'get_{field}_display')()
                        except:
                            value = str(value) if value else '-'
                    else:
                        value = str(value)
                        # Pour les champs de texte longs, limiter la longueur
                        if len(value) > 60:
                            value = value[:57] + '...'
                except Exception as e:
                    # En cas d'erreur, mettre un tiret
                    value = '-'
                row.append(value)
            data.append(row)
        
        # Créer le tableau avec largeurs adaptatives
        col_widths = [None] * len(fields)  # Auto-width
        
        table = Table(data, colWidths=col_widths, repeatRows=1)
        
        # Style amélioré du tableau
        table_style = TableStyle([
            # En-tête
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1AA45A')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            
            # Corps du tableau
            ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            
            # Bordures
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#1AA45A')),
            
            # Alternance de couleurs pour les lignes
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
            
            # Couleur du texte
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#333333')),
        ])
        
        table.setStyle(table_style)
        elements.append(table)
    else:
        no_data_style = ParagraphStyle(
            'NoData',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#999999'),
            alignment=1,  # Centré
        )
        no_data = Paragraph("Aucune donnée trouvée", no_data_style)
        elements.append(no_data)
    
    # Pied de page
    elements.append(Spacer(1, 0.5*inch))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#999999'),
        alignment=1,  # Centré
    )
    footer_text = f"Document généré par SIAB - {timezone.now().strftime('%Y')} | www.siab.com"
    footer = Paragraph(footer_text, footer_style)
    elements.append(footer)
    
    # Construire le PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer


@login_required
def export_pdf(request, model_name):
    """Exporte les données d'un modèle en PDF"""
    if model_name not in MODELS_CONFIG:
        return HttpResponse("Modèle non trouvé", status=404)
    
    config = MODELS_CONFIG[model_name]
    model = config['model']
    search_query = request.GET.get('search', '')
    
    # Récupérer les objets
    queryset = model.objects.all()
    
    # Appliquer la recherche si nécessaire
    if search_query:
        search_fields = config['search_fields']
        q_objects = Q()
        for field in search_fields:
            q_objects |= Q(**{f'{field}__icontains': search_query})
        queryset = queryset.filter(q_objects)
    
    # Générer le PDF
    buffer = generate_pdf(
        model_name,
        queryset,
        config['name'],
        config['fields']
    )
    
    # Réponse HTTP
    response = HttpResponse(buffer.read(), content_type='application/pdf')
    filename = f"{model_name}_{timezone.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response
