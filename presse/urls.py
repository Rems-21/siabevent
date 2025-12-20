from django.urls import path
from . import views

urlpatterns = [
    path('presse', views.presse_page, name='presse'),
    path('api/submit_badge_presse/', views.submit_badge_presse, name='submit_badge_presse'),
    path('presse-success', views.presse_success, name='presse_success'),
]

