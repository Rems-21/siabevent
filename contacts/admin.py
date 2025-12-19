from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'email', 'telephone', 'sujet', 'date_creation', 'traite')
    list_filter = ('sujet', 'traite', 'date_creation', 'pays')
    search_fields = ('nom', 'prenom', 'email', 'telephone', 'message')
    readonly_fields = ('date_creation',)
    date_hierarchy = 'date_creation'
    ordering = ('-date_creation',)
    list_editable = ('traite',)
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('nom', 'prenom', 'email', 'telephone', 'pays')
        }),
        ('Message', {
            'fields': ('sujet', 'message', 'consent')
        }),
        ('Gestion', {
            'fields': ('traite', 'date_creation'),
            'classes': ('collapse',),
        }),
    )
    
    actions = ['marquer_comme_traite', 'marquer_comme_non_traite']
    
    def marquer_comme_traite(self, request, queryset):
        queryset.update(traite=True)
        self.message_user(request, f"{queryset.count()} message(s) marqué(s) comme traité(s).")
    marquer_comme_traite.short_description = "Marquer comme traité"
    
    def marquer_comme_non_traite(self, request, queryset):
        queryset.update(traite=False)
        self.message_user(request, f"{queryset.count()} message(s) marqué(s) comme non traité(s).")
    marquer_comme_non_traite.short_description = "Marquer comme non traité"
