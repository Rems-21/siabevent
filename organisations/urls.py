from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_page, name='home'),
    path('index.html', views.index_page, name='index'),
]

