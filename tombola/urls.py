from django.urls import path
from . import views

urlpatterns = [
    path('tombola.html', views.tombola_page, name='tombola'),
    path('api/create-tombola-checkout/', views.create_tombola_checkout, name='create_tombola_checkout'),
    path('api/stripe-webhook-tombola/', views.stripe_webhook_tombola, name='stripe_webhook_tombola'),
    path('tombola-success.html', views.tombola_success, name='tombola_success'),
]

