from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    # Admin Django
    path('admin/', admin.site.urls),
    
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
    
    # Pages statiques
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('index.html', TemplateView.as_view(template_name='index.html'), name='index'),
    path('participer.html', TemplateView.as_view(template_name='participer.html'), name='participer'),
    path('exposer.html', TemplateView.as_view(template_name='exposer.html'), name='exposer'),
    path('apropos.html', TemplateView.as_view(template_name='apropos.html'), name='apropos'),
    path('logistique.html', TemplateView.as_view(template_name='logistique.html'), name='logistique'),
    path('sponsoriser.html', TemplateView.as_view(template_name='sponsoriser.html'), name='sponsoriser'),
]

# Servir les fichiers statiques et média en développement
if settings.DEBUG:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
