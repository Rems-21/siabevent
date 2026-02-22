from django.contrib import admin
from django.utils.html import format_html
from .models import Paneliste


@admin.register(Paneliste)
class PanelisteAdmin(admin.ModelAdmin):
    list_display = ('prenom', 'nom', 'pays_origine', 'email', 'telephone', 'statut', 'date_candidature')
    list_filter = ('statut', 'pays_origine', 'date_candidature')
    search_fields = ('nom', 'prenom', 'email', 'theme', 'pays_origine')
    readonly_fields = ('date_candidature', 'cv_link')
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('nom', 'prenom', 'photo', 'pays_origine', 'telephone', 'email')
        }),
        ('CV et Intervention', {
            'fields': ('cv_fichier', 'cv_link', 'theme', 'message')
        }),
        ('Administration', {
            'fields': ('statut', 'notes_internes', 'date_candidature')
        }),
    )
    
    actions = ['marquer_accepte', 'marquer_refuse', 'marquer_en_attente']
    
    def cv_link(self, obj):
        if obj.cv_fichier:
            return format_html('<a href="{}" target="_blank">Télécharger le CV</a>', obj.cv_fichier.url)
        return "Aucun CV"
    cv_link.short_description = 'Lien CV'
    
    def marquer_accepte(self, request, queryset):
        queryset.update(statut='accepte')
    marquer_accepte.short_description = "Marquer comme accepté"
    
    def marquer_refuse(self, request, queryset):
        queryset.update(statut='refuse')
    marquer_refuse.short_description = "Marquer comme refusé"
    
    def marquer_en_attente(self, request, queryset):
        queryset.update(statut='en_attente')
    marquer_en_attente.short_description = "Marquer en attente"

