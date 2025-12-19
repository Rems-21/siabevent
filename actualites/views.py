from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Article

# Vue pour la page actualités publique
def actualites_page(request):
    return render(request, 'actualites.html')

# Vue pour le détail d'un article
def article_detail(request, article_id):
    article = get_object_or_404(Article, id=article_id)
    return render(request, 'article_detail.html', {'article': article})

# API publique : Récupérer tous les articles
@require_http_methods(["GET"])
def get_articles(request):
    articles = Article.objects.all().order_by('-date_creation')
    
    articles_data = []
    for article in articles:
        image_path = None
        if article.image:
            image_path = article.image.url
        
        articles_data.append({
            'id': article.id,
            'titre': article.titre,
            'resume': article.resume,
            'contenu': article.contenu,
            'image': image_path,
            'date_creation': article.date_creation.strftime('%d/%m/%Y')
        })
    
    return JsonResponse({'success': True, 'articles': articles_data})
