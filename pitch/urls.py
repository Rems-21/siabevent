from django.urls import path
from . import views

urlpatterns = [
    path('pitch.html', views.pitch_page, name='pitch'),
    path('api/submit-pitch/', views.submit_pitch, name='submit_pitch'),
    path('api/stripe-webhook-pitch/', views.stripe_webhook_pitch, name='stripe_webhook_pitch'),
    path('pitch-success.html', views.pitch_success, name='pitch_success'),
]

