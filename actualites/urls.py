from django.urls import path
from . import views

urlpatterns = [
    # Page publique des actualités
    path('actualites.html', views.actualites_page, name='actualites'),
    
    # Page de détail d'un article
    path('article/<int:article_id>/', views.article_detail, name='article_detail'),
    
    # API publique pour récupérer les articles
    path('api/get_articles.php', views.get_articles, name='get_articles'),
]

