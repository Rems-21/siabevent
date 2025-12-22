from django.urls import path
from . import views

app_name = 'custom_admin'

urlpatterns = [
    path('', views.admin_dashboard, name='dashboard'),
    path('<str:model_name>/', views.model_list, name='model_list'),
    path('<str:model_name>/export-pdf/', views.export_pdf, name='export_pdf'),
]

