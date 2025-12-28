from django.urls import path
from . import views

urlpatterns = [
    path('prix', views.pitch_page, name='prix'),
    path('api/submit-prix/', views.submit_pitch, name='submit_prix'),
    path('api/stripe-webhook-prix/', views.stripe_webhook_pitch, name='stripe_webhook_prix'),
    path('prix-success', views.pitch_success, name='prix_success'),
]

