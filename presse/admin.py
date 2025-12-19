from django.contrib import admin
from .models import BadgePresse


@admin.register(BadgePresse)
class BadgePresseAdmin(admin.ModelAdmin):
    list_display = ('prenom', 'nom', 'nom_media', 'type_media', 'pays_origine_media', 'email', 'badge_delivre', 'date_demande')
    list_filter = ('badge_delivre', 'type_media', 'pays_origine_media', 'date_demande')
    search_fields = ('nom', 'prenom', 'nom_media', 'email', 'pays_origine_media')
    readonly_fields = ('date_demande',)
    
    fieldsets = (
        ('Informations du journaliste', {
            'fields': ('prenom', 'nom', 'email', 'telephone', 'code_pays')
        }),
        ('Informations du média', {
            'fields': ('nom_media', 'type_media', 'pays_origine_media', 'message')
        }),
        ('Collaborateurs', {
            'fields': ('emails_collaborateurs',),
            'classes': ('collapse',),
        }),
        ('Administration', {
            'fields': ('badge_delivre', 'date_demande')
        }),
    )
    
    actions = ['marquer_delivre', 'marquer_non_delivre']
    
    def marquer_delivre(self, request, queryset):
        queryset.update(badge_delivre=True)
    marquer_delivre.short_description = "Marquer badge comme délivré"
    
    def marquer_non_delivre(self, request, queryset):
        queryset.update(badge_delivre=False)
    marquer_non_delivre.short_description = "Marquer badge comme non délivré"

