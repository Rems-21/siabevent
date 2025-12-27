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
            
            // Sur mobile, toujours col-12 pour un seul élément centré
            if (width < 768) {
                representativeItem.classList.add('col-12');
            } else if (width < 992) {
                representativeItem.classList.add('col-12', 'col-md-10', 'offset-md-1');
            } else if (width < 1200) {
                representativeItem.classList.add('col-12', 'col-lg-10', 'offset-lg-1');
            } else {
                representativeItem.classList.add('col-12', 'col-xl-10', 'offset-xl-1');
            }
            
            // S'assurer que l'élément est centré et ne déborde pas
            representativeItem.style.maxWidth = '100%';
            representativeItem.style.boxSizing = 'border-box';
            
            row.appendChild(representativeItem);
        }
        
        slide.appendChild(row);
        representativesCarouselInner.appendChild(slide);
    });
    
    // Fonction pour mettre à jour le carousel avec boucle infinie
    function updateCarousel(skipTransition = false) {
        const track = representativesCarouselInner;
        const maxIndex = totalRepresentatives - 1;
        
        // Boucle infinie : si on dépasse, on revient au début/fin
        if (currentIndex > maxIndex) {
            // Désactiver la transition pour le saut instantané
            track.style.transition = 'none';
            currentIndex = 0;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Réactiver la transition après un court délai
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    track.style.transition = '';
                });
            });
            return;
        }
        if (currentIndex < 0) {
            // Désactiver la transition pour le saut instantané
            track.style.transition = 'none';
            currentIndex = maxIndex;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Réactiver la transition après un court délai
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    track.style.transition = '';
                });
            });
            return;
        }
        
        // Réactiver la transition pour les animations normales
        if (!skipTransition) {
            track.style.transition = '';
        }
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Ne plus désactiver les boutons (boucle infinie)
        if (prevButton) {
            prevButton.disabled = false;
            prevButton.style.opacity = '0.8';
        }
        if (nextButton) {
            nextButton.disabled = false;
            nextButton.style.opacity = '0.8';
        }
    }
    
    // Afficher les boutons
    if (prevButton) {
        prevButton.style.display = 'flex';
        prevButton.classList.remove('d-none');
        prevButton.removeAttribute('data-bs-target');
        prevButton.removeAttribute('data-bs-slide');
        prevButton.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
            // Réinitialiser l'auto-slide
            resetAutoSlide();
        });
    }
    
    if (nextButton) {
        nextButton.style.display = 'flex';
        nextButton.classList.remove('d-none');
        nextButton.removeAttribute('data-bs-target');
        nextButton.removeAttribute('data-bs-slide');
        nextButton.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
            // Réinitialiser l'auto-slide
            resetAutoSlide();
        });
    }
    
    // Fonction pour réinitialiser l'auto-slide
    function resetAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        startAutoSlide();
    }
    
    // Fonction pour démarrer l'auto-slide avec boucle infinie
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentIndex++;
            updateCarousel();
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

// Countdown Timer for SIAB 2026 - 25 juin 2026 à 00:00:00 (heure locale de Bruxelles)
document.addEventListener('DOMContentLoaded', function() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.warn('Éléments du countdown non trouvés');
        return;
    }
    
    // Date cible : 25 juin 2026 à 00:00:00 heure locale de Bruxelles (UTC+2 en été)
    // Utiliser une date locale pour éviter les problèmes de timezone
    const targetDate = new Date(2026, 5, 25, 0, 0, 0, 0); // Mois 5 = juin (0-indexé)
    
    function updateCountdown() {
        const now = new Date();
        let diff = targetDate - now;
        
        if (diff < 0) {
            diff = 0;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        if (daysElement) daysElement.textContent = String(days).padStart(3, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    }
    
    // Mettre à jour immédiatement puis toutes les secondes
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// Statistics Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    if (statNumbers.length === 0) {
        console.warn('Aucun élément stat-number avec data-target trouvé');
        return;
    }
    
    // Observer pour déclencher l'animation quand les stats sont visibles
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const targetValue = statNumber.getAttribute('data-target');
                
                if (!targetValue) {
                    console.warn('data-target manquant pour', statNumber);
                    return;
                }
                
                const target = parseInt(targetValue);
                
                if (isNaN(target)) {
                    console.warn('Valeur data-target invalide:', targetValue);
                    return;
                }
                
                // Vérifier si l'animation n'a pas déjà été déclenchée
                if (statNumber.dataset.animated === 'true') {
                    return;
                }
                
                statNumber.dataset.animated = 'true';
                animateCounter(statNumber, target);
                statsObserver.unobserve(statNumber);
            }
        });
    }, {
        threshold: 0.3, // Déclencher plus tôt
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observer chaque stat-number
    statNumbers.forEach(statNumber => {
        statsObserver.observe(statNumber);
    });
    
    // Fonction pour animer le compteur
    function animateCounter(element, target) {
        if (!element || !target) {
            console.warn('Paramètres invalides pour animateCounter');
            return;
        }
        
        const duration = 2000; // 2 secondes
        const start = 0;
        const steps = 60; // Nombre de frames
        const increment = target / steps;
        let current = start;
        let frame = 0;
        
        const timer = setInterval(() => {
            frame++;
            current = (target / steps) * frame;
            
            if (current >= target || frame >= steps) {
                current = target;
                clearInterval(timer);
            }
            
            // Formater le nombre avec le préfixe "+"
            const formatted = target >= 1000 
                ? `+${Math.floor(current).toLocaleString('fr-FR')}` 
                : `+${Math.floor(current)}`;
            
            if (element) {
                element.textContent = formatted;
            }
        }, duration / steps);
    }
});
