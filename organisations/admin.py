from django.contrib import admin
from .models import Partenaire, Exposant, Representant, Pays


@admin.register(Pays)
class PaysAdmin(admin.ModelAdmin):
    list_display = ('nom', 'code', 'code_drapeau')
    search_fields = ('nom', 'code')
    list_filter = ('nom',)


@admin.register(Partenaire)
class PartenaireAdmin(admin.ModelAdmin):
    list_display = ('nom', 'ordre_affichage', 'actif', 'date_creation')
    list_filter = ('actif', 'date_creation')
    search_fields = ('nom', 'description')
    list_editable = ('ordre_affichage', 'actif')
    fieldsets = (
        ('Informations principales', {
            'fields': ('nom', 'logo', 'description', 'site_web')
        }),
        ('Affichage', {
            'fields': ('ordre_affichage', 'actif')
        }),
    )


@admin.register(Exposant)
class ExposantAdmin(admin.ModelAdmin):
    list_display = ('nom', 'secteur', 'ordre_affichage', 'actif', 'date_creation')
    list_filter = ('actif', 'secteur', 'date_creation')
    search_fields = ('nom', 'description', 'secteur')
    list_editable = ('ordre_affichage', 'actif')
    fieldsets = (
        ('Informations principales', {
            'fields': ('nom', 'logo', 'description', 'site_web', 'secteur')
        }),
        ('Affichage', {
            'fields': ('ordre_affichage', 'actif')
        }),
    )


@admin.register(Representant)
class RepresentantAdmin(admin.ModelAdmin):
    list_display = ('nom', 'titre', 'ordre_affichage', 'actif', 'date_creation')
    list_filter = ('actif', 'pays', 'date_creation')
    search_fields = ('nom', 'titre', 'email', 'telephone')
    list_editable = ('ordre_affichage', 'actif')
    filter_horizontal = ('pays',)
    fieldsets = (
        ('Informations principales', {
            'fields': ('nom', 'titre', 'photo')
        }),
        ('Contact', {
            'fields': ('email', 'telephone')
        }),
        ('Pays représentés', {
            'fields': ('pays',)
        }),
        ('Affichage', {
            'fields': ('ordre_affichage', 'actif')
        }),
    )
