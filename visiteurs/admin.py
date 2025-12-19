from django.contrib import admin
from .models import BadgeVisiteur


@admin.register(BadgeVisiteur)
class BadgeVisiteurAdmin(admin.ModelAdmin):
    list_display = ('prenom', 'nom', 'email', 'code_pays', 'telephone', 'badge_envoye', 'date_inscription')
    list_filter = ('badge_envoye', 'code_pays', 'date_inscription')
    search_fields = ('prenom', 'nom', 'email', 'code_pays', 'telephone')
    readonly_fields = ('date_inscription',)
    
    fieldsets = (
        ('Informations du visiteur', {
            'fields': ('prenom', 'nom', 'email', 'code_pays', 'telephone', 'message')
        }),
        ('Administration', {
            'fields': ('badge_envoye', 'date_inscription')
        }),
    )
    
    actions = ['marquer_badge_envoye', 'marquer_badge_non_envoye']
    
    def marquer_badge_envoye(self, request, queryset):
        queryset.update(badge_envoye=True)
    marquer_badge_envoye.short_description = "Marquer badge comme envoyé"
    
    def marquer_badge_non_envoye(self, request, queryset):
        queryset.update(badge_envoye=False)
    marquer_badge_non_envoye.short_description = "Marquer badge comme non envoyé"

