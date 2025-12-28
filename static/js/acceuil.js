// Representatives Carousel Management - Simple transform-based carousel
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
    
    // Si aucun élément trouvé directement, chercher dans les carousel-item existants
    if (representativeItems.length === 0) {
        const existingCarouselItems = representativesCarouselInner.querySelectorAll('.carousel-item');
        existingCarouselItems.forEach((carouselItem) => {
            const items = carouselItem.querySelectorAll('.representative-item');
            items.forEach((item) => {
                originalItems.push({
                    html: item.outerHTML,
                    element: item
                });
            });
        });
    } else {
        representativeItems.forEach((item) => {
            originalItems.push({
                html: item.outerHTML,
                element: item
            });
        });
    }
    
    const totalRepresentatives = originalItems.length;
    
    if (totalRepresentatives === 0) {
        return;
    }
    
    // Toujours activer le slider, peu importe le nombre d'éléments
    let currentIndex = 0;
    let autoSlideInterval = null;
    
    // Créer la structure du carousel avec track
    representativesCarouselInner.innerHTML = '';
    representativesCarouselInner.className = 'carousel-track';
    
    // Créer un slide pour chaque représentant (1 élément par slide)
    originalItems.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        const row = document.createElement('div');
        row.className = 'row justify-content-center align-items-center';
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.html;
        const representativeItem = tempDiv.firstElementChild;
        
        if (representativeItem) {
            representativeItem.className = representativeItem.className.replace(/col-\w+-\d+/g, '').trim();
            const width = window.innerWidth;
            
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
        
        slide.appendChild(row);
        representativesCarouselInner.appendChild(slide);
    });
    
    // Fonction pour mettre à jour le carousel
    function updateCarousel() {
        const track = representativesCarouselInner;
        const maxIndex = totalRepresentatives - 1;
        
        // Limiter l'index pour ne pas dépasser (un seul sens)
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Désactiver les boutons aux extrémités
        if (prevButton) {
            prevButton.disabled = currentIndex === 0;
            prevButton.style.opacity = currentIndex === 0 ? '0.3' : '0.8';
        }
        if (nextButton) {
            nextButton.disabled = currentIndex >= maxIndex;
            nextButton.style.opacity = currentIndex >= maxIndex ? '0.3' : '0.8';
        }
    }
    
    // Afficher les boutons
    if (prevButton) {
        prevButton.style.display = 'flex';
        prevButton.classList.remove('d-none');
        prevButton.removeAttribute('data-bs-target');
        prevButton.removeAttribute('data-bs-slide');
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
                // Réinitialiser l'auto-slide
                resetAutoSlide();
            }
        });
    }
    
    if (nextButton) {
        nextButton.style.display = 'flex';
        nextButton.classList.remove('d-none');
        nextButton.removeAttribute('data-bs-target');
        nextButton.removeAttribute('data-bs-slide');
        nextButton.addEventListener('click', () => {
            const maxIndex = totalRepresentatives - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
                // Réinitialiser l'auto-slide
                resetAutoSlide();
            }
        });
    }
    
    // Fonction pour réinitialiser l'auto-slide
    function resetAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        startAutoSlide();
    }
    
    // Fonction pour démarrer l'auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const maxIndex = totalRepresentatives - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            } else {
                // Arrêter à la fin (un seul sens)
                clearInterval(autoSlideInterval);
            }
        }, 5000);
    }
    
    // Initialiser
    updateCarousel();
    
    // Démarrer l'auto-slide seulement s'il y a plus d'un élément
    if (totalRepresentatives > 1) {
        startAutoSlide();
    }
    
    // Pause au survol
    representativesCarousel.addEventListener('mouseenter', () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    });
    
    representativesCarousel.addEventListener('mouseleave', () => {
        if (totalRepresentatives > 1) {
            startAutoSlide();
        }
    });
    
    // Réorganiser lors du redimensionnement (juste mettre à jour l'affichage)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            updateCarousel();
        }, 250);
    });
});
