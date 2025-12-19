from django.urls import path
from . import views

urlpatterns = [
    path('paneliste.html', views.paneliste_page, name='paneliste'),
    path('api/submit_paneliste/', views.submit_paneliste, name='submit_paneliste'),
    path('paneliste-success.html', views.paneliste_success, name='paneliste_success'),
]

