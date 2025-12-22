from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    # Admin Django
    path('siab/2025/admin/', admin.site.urls),
    
    # API Routes (actualites app)
    path('', include('actualites.urls')),
    
    # Reservations app
    path('', include('reservations.urls')),
    
    # Visiteurs app
    path('', include('visiteurs.urls')),
    
    # Panelistes app
    path('', include('panelistes.urls')),
    
    # Presse app
    path('', include('presse.urls')),
    
    # Contacts app
    path('', include('contacts.urls')),
    
    # Tombola app
    path('', include('tombola.urls')),
    
    # Pitch app
    path('', include('pitch.urls')),
    
    # Organisations app (partenaires, exposants, représentants)
    path('', include('organisations.urls')),
    
    # Custom Admin
    path('admin-custom/', include('custom_admin.urls')),
    
    # Pages statiques
    path('participer', TemplateView.as_view(template_name='participer.html'), name='participer'),
    path('exposer', TemplateView.as_view(template_name='exposer.html'), name='exposer'),
    path('apropos', TemplateView.as_view(template_name='apropos.html'), name='apropos'),
    path('logistique', TemplateView.as_view(template_name='logistique.html'), name='logistique'),
    path('sponsoriser', TemplateView.as_view(template_name='sponsoriser.html'), name='sponsoriser'),
]

# Servir les fichiers statiques et média en développement
if settings.DEBUG:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
