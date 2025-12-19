from django.urls import path
from . import views

urlpatterns = [
    path('reservation.html', views.reservation_page, name='reservation'),
    path('api/submit_reservation/', views.submit_reservation, name='submit_reservation'),
    path('reservation-success.html', views.reservation_success, name='reservation_success'),
]
