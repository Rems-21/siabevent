from django.contrib import admin
from .models import ParticipationTombola

@admin.register(ParticipationTombola)
class ParticipationTombolaAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'email', 'nombre_tickets', 'montant_total', 'statut', 'date_inscription', 'date_paiement')
    list_filter = ('statut', 'date_inscription', 'pays')
    search_fields = ('nom', 'prenom', 'email', 'telephone', 'numeros_tickets')
    readonly_fields = ('date_inscription', 'date_paiement', 'montant_total')
    date_hierarchy = 'date_inscription'
    ordering = ('-date_inscription',)
    list_editable = ('statut',)
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('nom', 'prenom', 'email', 'telephone', 'pays')
        }),
        ('Tickets', {
            'fields': ('nombre_tickets', 'prix_unitaire', 'montant_total', 'numeros_tickets')
        }),
        ('Paiement Stripe', {
            'fields': ('statut', 'stripe_payment_intent_id', 'stripe_checkout_session_id'),
            'classes': ('collapse',),
        }),
        ('Métadonnées', {
            'fields': ('date_inscription', 'date_paiement'),
            'classes': ('collapse',),
        }),
    )
    
    actions = ['marquer_comme_paye', 'marquer_comme_annule']
    
    def marquer_comme_paye(self, request, queryset):
        queryset.update(statut='paid')
        self.message_user(request, f"{queryset.count()} participation(s) marquée(s) comme payée(s).")
    marquer_comme_paye.short_description = "Marquer comme payé"
    
    def marquer_comme_annule(self, request, queryset):
        queryset.update(statut='cancelled')
        self.message_user(request, f"{queryset.count()} participation(s) annulée(s).")
    marquer_comme_annule.short_description = "Annuler"
