from django.contrib import admin
from django.utils.html import format_html
from .models import CandidaturePitch

@admin.register(CandidaturePitch)
class CandidaturePitchAdmin(admin.ModelAdmin):
    list_display = ('nom_projet', 'nom_porteur', 'prenom_porteur', 'email', 'domaine_activite', 'statut', 'score', 'date_soumission')
    list_filter = ('statut', 'domaine_activite', 'date_soumission', 'pays_residence', 'pays_impact')
    search_fields = ('nom_projet', 'nom_porteur', 'prenom_porteur', 'email', 'telephone', 'domaine_activite')
    readonly_fields = ('date_soumission', 'date_paiement', 'display_documents')
    date_hierarchy = 'date_soumission'
    ordering = ('-date_soumission',)
    list_editable = ('statut', 'score')
    
    fieldsets = (
        ('Porteur de projet', {
            'fields': ('nom_porteur', 'prenom_porteur', 'email', 'indicatif_pays', 'telephone', 
                      'pays_residence', 'pays_origine', 'pays_impact')
        }),
        ('Projet', {
            'fields': ('nom_projet', 'domaine_activite', 'resume_executif', 'financement_recherche', 'lien_video')
        }),
        ('Documents', {
            'fields': ('document_pitch', 'business_plan', 'display_documents', 'declaration_acceptee')
        }),
        ('Paiement', {
            'fields': ('frais_dossier', 'statut', 'stripe_payment_intent_id', 'stripe_checkout_session_id'),
            'classes': ('collapse',),
        }),
        ('Évaluation', {
            'fields': ('score', 'note_evaluation', 'date_evaluation'),
            'classes': ('collapse',),
        }),
        ('Métadonnées', {
            'fields': ('date_soumission', 'date_paiement'),
            'classes': ('collapse',),
        }),
    )
    
    def display_documents(self, obj):
        html = ""
        if obj.document_pitch:
            html += format_html('<p><strong>Document Pitch:</strong> <a href="{}" target="_blank">Télécharger</a></p>', obj.document_pitch.url)
        if obj.business_plan:
            html += format_html('<p><strong>Business Plan:</strong> <a href="{}" target="_blank">Télécharger</a></p>', obj.business_plan.url)
        return html if html else "Aucun document"
    display_documents.short_description = "Documents téléchargés"
    
    actions = ['marquer_comme_paye', 'marquer_comme_selectionne', 'marquer_comme_rejete']
    
    def marquer_comme_paye(self, request, queryset):
        queryset.update(statut='paid')
        self.message_user(request, f"{queryset.count()} candidature(s) marquée(s) comme payée(s).")
    marquer_comme_paye.short_description = "Marquer comme payé"
    
    def marquer_comme_selectionne(self, request, queryset):
        queryset.update(statut='selected')
        self.message_user(request, f"{queryset.count()} candidature(s) sélectionnée(s).")
    marquer_comme_selectionne.short_description = "Marquer comme sélectionné"
    
    def marquer_comme_rejete(self, request, queryset):
        queryset.update(statut='rejected')
        self.message_user(request, f"{queryset.count()} candidature(s) rejetée(s).")
    marquer_comme_rejete.short_description = "Marquer comme rejeté"
