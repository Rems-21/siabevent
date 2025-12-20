from django.urls import path
from . import views

urlpatterns = [
    path('visiter', views.visiter_page, name='visiter'),
    path('api/submit_badge/', views.submit_badge, name='submit_badge'),
    path('badge-success', views.badge_success, name='badge_success'),
]

