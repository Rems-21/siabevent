from django.urls import path
from . import views

urlpatterns = [
    path('contacts', views.contacts_page, name='contacts'),
    path('api/submit_contact/', views.submit_contact, name='submit_contact'),
]

