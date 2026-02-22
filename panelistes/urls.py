from django.urls import path
from . import views

urlpatterns = [
    path('paneliste', views.paneliste_page, name='paneliste'),
    path('api/submit_paneliste/', views.submit_paneliste, name='submit_paneliste'),
    path('paneliste-success', views.paneliste_success, name='paneliste_success'),
    path('conferencier/<int:pk>', views.conferencier_detail, name='conferencier_detail'),
]

