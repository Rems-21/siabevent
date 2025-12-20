from django.urls import path
from . import views

urlpatterns = [
    path('reservation', views.reservation_page, name='reservation'),
    path('api/submit_reservation/', views.submit_reservation, name='submit_reservation'),
    path('reservation-success', views.reservation_success, name='reservation_success'),
]
