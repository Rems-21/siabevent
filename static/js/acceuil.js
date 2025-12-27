// Representatives Carousel Management
document.addEventListener('DOMContentLoaded', function() {
    const representativesCarousel = document.getElementById('representativesCarousel');
    const representativesCarouselInner = document.getElementById('representativesCarouselInner');
    const prevButton = document.querySelector('.representative-prev');
    const nextButton = document.querySelector('.representative-next');
    
    if (!representativesCarousel || !representativesCarouselInner) {
        return;
    }
    
    // Stocker les éléments originaux
    const originalItems = [];
    const representativeItems = representativesCarouselInner.querySelectorAll('.representative-item');
    
    representativeItems.forEach((item) => {
        originalItems.push({
            html: item.outerHTML,
            element: item
        });
    });
    
    const totalRepresentatives = originalItems.length;
    
    if (totalRepresentatives === 0) {
        return;
    }
    
    // Fonction pour déterminer si le slider est nécessaire
    function needsSlider() {
        const width = window.innerWidth;
        if (width < 768) {
            // Mobile: slider à partir de 2 éléments
            return totalRepresentatives >= 2;
        } else {
            // Desktop: slider à partir de 5 éléments
            return totalRepresentatives >= 5;
        }
    }
    
    // Fonction pour réorganiser le carousel
    function reorganizeCarousel() {
        if (!representativesCarouselInner || totalRepresentatives === 0) return;
        
        const width = window.innerWidth;
        const shouldUseSlider = needsSlider();
        
        // Vider le contenu actuel
        representativesCarouselInner.innerHTML = '';
        
        if (shouldUseSlider) {
            // Créer un slide pour chaque représentant (1 par slide)
            for (let i = 0; i < totalRepresentatives; i++) {
                const carouselItem = document.createElement('div');
                carouselItem.className = `carousel-item ${i === 0 ? 'active' : ''}`;
                
                const row = document.createElement('div');
                row.className = 'row justify-content-center align-items-center';
                
                // Créer un élément temporaire pour parser le HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = originalItems[i].html;
                const representativeItem = tempDiv.firstElementChild;
                
                if (representativeItem) {
                    // Nettoyer les classes Bootstrap existantes
                    representativeItem.className = representativeItem.className.replace(/col-\w+-\d+/g, '').trim();
                    
                    // Ajouter les classes appropriées pour centrer l'élément
                    if (width < 576) {
                        representativeItem.classList.add('col-12');
                    } else if (width < 768) {
                        representativeItem.classList.add('col-12', 'col-sm-10', 'col-md-8');
                    } else if (width < 992) {
                        representativeItem.classList.add('col-12', 'col-md-8', 'col-lg-6');
                    } else if (width < 1200) {
                        representativeItem.classList.add('col-12', 'col-lg-8', 'col-xl-6');
                    } else {
                        representativeItem.classList.add('col-12', 'col-xl-8', 'col-xxl-6');
                    }
                    
                    row.appendChild(representativeItem);
                }
                
                carouselItem.appendChild(row);
                representativesCarouselInner.appendChild(carouselItem);
            }
            
            // Afficher les boutons de navigation
            if (prevButton) {
                prevButton.style.display = 'flex';
                prevButton.classList.remove('d-none');
            }
            if (nextButton) {
                nextButton.style.display = 'flex';
                nextButton.classList.remove('d-none');
            }
            
            // Initialiser le carousel Bootstrap
            setTimeout(() => {
                // Disposer l'ancienne instance si elle existe
                if (window.representativesCarouselInstance) {
                    try {
                        window.representativesCarouselInstance.dispose();
                    } catch(e) {
                        // Ignorer les erreurs
                    }
                }
                
                // Créer une nouvelle instance
                if (typeof bootstrap !== 'undefined') {
                    window.representativesCarouselInstance = new bootstrap.Carousel(representativesCarousel, {
                        interval: 5000, // 5 secondes pour une animation plus douce
                        wrap: true,
                        ride: 'carousel',
                        pause: 'hover',
                        touch: true,
                        keyboard: true
                    });
                }
            }, 100);
        } else {
            // Afficher tous les éléments sans slider
            const row = document.createElement('div');
            row.className = 'row justify-content-center align-items-center';
            
            for (let i = 0; i < totalRepresentatives; i++) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = originalItems[i].html;
                const representativeItem = tempDiv.firstElementChild;
                
                if (representativeItem) {
                    representativeItem.className = representativeItem.className.replace(/col-\w+-\d+/g, '').trim();
                    
                    if (width < 576) {
                        representativeItem.classList.add('col-12');
                    } else if (width < 768) {
                        representativeItem.classList.add('col-12', 'col-sm-10', 'col-md-8');
                    } else if (width < 992) {
                        representativeItem.classList.add('col-12', 'col-md-8', 'col-lg-6');
                    } else if (width < 1200) {
                        representativeItem.classList.add('col-12', 'col-lg-8', 'col-xl-6');
                    } else {
                        representativeItem.classList.add('col-12', 'col-xl-8', 'col-xxl-6');
                    }
                    
                    row.appendChild(representativeItem);
                }
            }
            
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item active';
            carouselItem.appendChild(row);
            representativesCarouselInner.appendChild(carouselItem);
            
            // Masquer les boutons de navigation
            if (prevButton) {
                prevButton.style.display = 'none';
                prevButton.classList.add('d-none');
            }
            if (nextButton) {
                nextButton.style.display = 'none';
                nextButton.classList.add('d-none');
            }
            
            // Désactiver le carousel
            if (window.representativesCarouselInstance) {
                try {
                    window.representativesCarouselInstance.pause();
                    window.representativesCarouselInstance.dispose();
                } catch(e) {
                    // Ignorer les erreurs
                }
                window.representativesCarouselInstance = null;
            }
        }
    }
    
    // Initialiser le carousel
    reorganizeCarousel();
    
    // Réorganiser lors du redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            reorganizeCarousel();
        }, 250);
    });
});
