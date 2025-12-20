// Charger les articles au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
    initScrollToTop();
});

function loadArticles() {
    fetch('/api/get_articles.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Articles chargés:', data.articles);
                // Debug: afficher les chemins d'images
                data.articles.forEach(article => {
                    if (article.image) {
                        console.log('Image pour', article.titre + ':', article.image);
                    }
                });
                displayArticles(data.articles);
            } else {
                console.error('Erreur API:', data.error);
                displayError();
            }
        })
        .catch(error => {
            console.error('Erreur fetch:', error);
            displayError();
        });
}

function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    
    if (articles.length === 0) {
        container.innerHTML = `
            <div class="no-articles">
                <h3>Aucun article pour le moment</h3>
                <p>Revenez bientôt pour découvrir les dernières actualités du SIAB 2026.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = articles.map(article => {
        let imageHtml = '<div class="article-image"></div>';
        if (article.image && article.image.trim() !== '' && article.image !== 'null') {
            // Construire le chemin depuis l'URL actuelle
            let imageSrc = article.image;
            
            // Si le chemin ne commence pas par / ou http, c'est un chemin relatif
            if (!imageSrc.startsWith('/') && !imageSrc.startsWith('http')) {
                // C'est un chemin relatif depuis actualites.html
                // Obtenir le chemin de base depuis l'URL actuelle
                const currentPath = window.location.pathname;
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                // Construire le chemin complet
                imageSrc = basePath + '/' + imageSrc;
            }
            
            console.log('Chemin image final:', imageSrc);
            imageHtml = `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(article.titre)}" class="article-image" onerror="console.error('Image non trouvée:', this.src); this.style.display='none';">`;
        }
        
        return `
        <div class="article-card" onclick="viewArticle(${article.id})">
            ${imageHtml}
            <div class="article-content">
                <div class="article-date">${article.date_creation}</div>
                <h3 class="article-title">${escapeHtml(article.titre)}</h3>
                <p class="article-resume">${escapeHtml(article.resume)}</p>
                <a href="#" class="article-link" onclick="event.stopPropagation(); viewArticle(${article.id}); return false;">
                    Lire la suite <span>→</span>
                </a>
            </div>
        </div>
        `;
    }).join('');
}

function viewArticle(id) {
    // Rediriger vers la page de détail de l'article
    window.location.href = `/article/${id}/`;
}

function displayError() {
    const container = document.getElementById('articles-container');
    container.innerHTML = `
        <div class="no-articles">
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Scroll to Top functionality is now handled by scroll-to-top.js
function initScrollToTop() {
    // Function kept for compatibility but functionality moved to scroll-to-top.js
}

