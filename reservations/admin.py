from django.contrib import admin
from .models import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'nom_entreprise', 
        'nom_contact', 
        'type_stand', 
        'nombre_stands',
        'statut', 
        'date_reservation'
    )
    list_filter = ('statut', 'type_stand', 'date_reservation', 'pays')
    search_fields = (
        'nom_entreprise', 
        'secteur_activite', 
        'nom_contact', 
        'email', 
        'email_contact'
    )
    readonly_fields = ('date_reservation', 'date_modification')
    
    fieldsets = (
        ('Informations de l\'entreprise', {
            'fields': (
                'nom_entreprise', 
                'secteur_activite', 
                'adresse', 
                'ville', 
                'pays',
                'telephone', 
                'email', 
                'site_web'
            )
        }),
        ('Contact principal', {
            'fields': (
                'nom_contact', 
                'fonction_contact', 
                'telephone_contact', 
                'email_contact'
            )
        }),
        ('Réservation de stand', {
            'fields': (
                'type_stand', 
                'nombre_stands'
            )
        }),
        ('Options supplémentaires', {
            'fields': (
                'mobilier_supplementaire',
                'eclairage_supplementaire',
                'branchement_electrique',
                'connexion_internet',
                'besoins_specifiques'
            ),
            'classes': ('collapse',)
        }),
        ('Administration', {
            'fields': (
                'statut', 
                'date_reservation', 
                'date_modification'
            )
        }),
    )
    
    actions = ['marquer_confirmee', 'marquer_en_attente', 'marquer_annulee']
    
    def marquer_confirmee(self, request, queryset):
        queryset.update(statut='confirmee')
    marquer_confirmee.short_description = "Marquer comme confirmée"
    
    def marquer_en_attente(self, request, queryset):
        queryset.update(statut='en_attente')
    marquer_en_attente.short_description = "Marquer en attente"
    
    def marquer_annulee(self, request, queryset):
        queryset.update(statut='annulee')
    marquer_annulee.short_description = "Marquer comme annulée"
