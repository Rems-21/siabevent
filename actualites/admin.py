from django.contrib import admin
from django.utils.html import format_html
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('titre', 'resume_court', 'image_miniature', 'date_creation')
    list_filter = ('date_creation',)
    search_fields = ('titre', 'resume', 'contenu')
    readonly_fields = ('date_creation', 'image_preview')
    fieldsets = (
        ('Informations principales', {
            'fields': ('titre', 'resume', 'contenu')
        }),
        ('Image', {
            'fields': ('image', 'image_preview')
        }),
        ('Métadonnées', {
            'fields': ('date_creation',),
            'classes': ('collapse',)
        }),
    )
    
    def resume_court(self, obj):
        """Affiche un résumé court dans la liste"""
        if obj.resume:
            return obj.resume[:50] + '...' if len(obj.resume) > 50 else obj.resume
        return '-'
    resume_court.short_description = 'Résumé'
    
    def image_miniature(self, obj):
        """Affiche une miniature de l'image dans la liste"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.image.url
            )
        return '-'
    image_miniature.short_description = 'Image'
    
    def image_preview(self, obj):
        """Affiche un aperçu de l'image dans le formulaire"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 10px;" />',
                obj.image.url
            )
        return 'Aucune image'
    image_preview.short_description = 'Aperçu de l\'image'
