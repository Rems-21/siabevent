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

// Countdown Timer for SIAB 2026 - 25 juin 2026
document.addEventListener('DOMContentLoaded', function() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
    }
    
    const targetDate = new Date('2026-06-25T00:00:00');
    
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
        
        daysElement.textContent = String(days).padStart(3, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
    }
    
    // Mettre à jour immédiatement puis toutes les secondes
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// Statistics Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    console.log('[STATS DEBUG] Script de statistiques chargé');
    
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    console.log('[STATS DEBUG] Nombre d\'éléments stat-number trouvés:', statNumbers.length);
    
    if (statNumbers.length === 0) {
        console.warn('[STATS DEBUG] Aucun élément .stat-number[data-target] trouvé dans le DOM');
        // Essayer de trouver tous les stat-number sans data-target
        const allStatNumbers = document.querySelectorAll('.stat-number');
        console.log('[STATS DEBUG] Nombre total d\'éléments .stat-number:', allStatNumbers.length);
        allStatNumbers.forEach((el, index) => {
            console.log(`[STATS DEBUG] Élément ${index}:`, {
                text: el.textContent,
                hasDataTarget: el.hasAttribute('data-target'),
                dataTarget: el.getAttribute('data-target'),
                classes: el.className
            });
        });
        return;
    }
    
    // Afficher les détails de chaque élément trouvé
    statNumbers.forEach((statNumber, index) => {
        const target = statNumber.getAttribute('data-target');
        console.log(`[STATS DEBUG] Élément ${index}:`, {
            text: statNumber.textContent,
            dataTarget: target,
            parsedTarget: parseInt(target),
            isVisible: statNumber.offsetParent !== null,
            rect: statNumber.getBoundingClientRect()
        });
    });
    
    // Observer pour déclencher l'animation quand les stats sont visibles
    const statsObserver = new IntersectionObserver(function(entries) {
        console.log('[STATS DEBUG] IntersectionObserver déclenché, entrées:', entries.length);
        entries.forEach(entry => {
            console.log('[STATS DEBUG] Entry:', {
                isIntersecting: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio,
                target: entry.target,
                targetText: entry.target.textContent,
                targetDataTarget: entry.target.getAttribute('data-target')
            });
            
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const targetValue = statNumber.getAttribute('data-target');
                const target = parseInt(targetValue);
                
                console.log('[STATS DEBUG] Élément intersecté:', {
                    element: statNumber,
                    dataTarget: targetValue,
                    parsedTarget: target,
                    isNaN: isNaN(target),
                    alreadyAnimated: statNumber.dataset.animated === 'true'
                });
                
                if (isNaN(target)) {
                    console.warn('[STATS DEBUG] Valeur data-target invalide pour', statNumber, 'Valeur:', targetValue);
                    return;
                }
                
                // Vérifier si l'animation n'a pas déjà été déclenchée
                if (statNumber.dataset.animated === 'true') {
                    console.log('[STATS DEBUG] Animation déjà déclenchée pour', statNumber);
                    return;
                }
                
                console.log('[STATS DEBUG] Démarrage de l\'animation pour', statNumber, 'avec target:', target);
                statNumber.dataset.animated = 'true';
                animateCounter(statNumber, target);
                statsObserver.unobserve(statNumber);
            }
        });
    }, {
        threshold: 0.1, // Déclencher plus tôt (10% visible)
        rootMargin: '0px 0px -100px 0px' // Déclencher 100px avant que l'élément soit visible
    });
    
    console.log('[STATS DEBUG] Configuration de l\'observer:', {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observer chaque stat-number
    statNumbers.forEach((statNumber, index) => {
        // Vérifier si l'élément est déjà visible au chargement
        const rect = statNumber.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        console.log(`[STATS DEBUG] Vérification élément ${index}:`, {
            element: statNumber,
            rect: rect,
            isVisible: isVisible,
            windowHeight: window.innerHeight
        });
        
        if (isVisible) {
            // Si déjà visible, déclencher l'animation immédiatement
            const targetValue = statNumber.getAttribute('data-target');
            const target = parseInt(targetValue);
            
            console.log(`[STATS DEBUG] Élément ${index} déjà visible, déclenchement immédiat:`, {
                targetValue: targetValue,
                target: target,
                isNaN: isNaN(target)
            });
            
            if (!isNaN(target)) {
                statNumber.dataset.animated = 'true';
                console.log(`[STATS DEBUG] Démarrage animation immédiate pour élément ${index}`);
                animateCounter(statNumber, target);
            } else {
                console.warn(`[STATS DEBUG] Target invalide pour élément ${index}:`, targetValue);
            }
        } else {
            // Sinon, observer pour déclencher quand il devient visible
            console.log(`[STATS DEBUG] Élément ${index} pas encore visible, ajout à l'observer`);
            statsObserver.observe(statNumber);
        }
    });
    
    // Fonction pour animer le compteur
    function animateCounter(element, target) {
        console.log('[STATS DEBUG] animateCounter appelé:', {
            element: element,
            target: target,
            currentText: element.textContent
        });
        
        if (!element || !target || target <= 0) {
            console.error('[STATS DEBUG] Paramètres invalides pour animateCounter:', {
                element: element,
                target: target
            });
            return;
        }
        
        const duration = 2000; // 2 secondes
        const start = 0;
        const increment = target / (duration / 16); // ~60fps
        let current = start;
        let frameCount = 0;
        
        console.log('[STATS DEBUG] Paramètres animation:', {
            duration: duration,
            increment: increment,
            target: target
        });
        
        const timer = setInterval(() => {
            frameCount++;
            current += increment;
            
            if (current >= target) {
                current = target;
                console.log('[STATS DEBUG] Animation terminée après', frameCount, 'frames');
                clearInterval(timer);
            }
            
            // Formater le nombre avec le préfixe "+"
            const formatted = target >= 1000 
                ? `+${Math.floor(current).toLocaleString()}` 
                : `+${Math.floor(current)}`;
            
            if (element) {
                element.textContent = formatted;
                
                // Log tous les 10 frames pour ne pas surcharger
                if (frameCount % 10 === 0) {
                    console.log('[STATS DEBUG] Frame', frameCount, ':', formatted);
                }
            } else {
                console.error('[STATS DEBUG] Élément null pendant l\'animation');
                clearInterval(timer);
            }
        }, 16);
        
        console.log('[STATS DEBUG] Timer créé, animation démarrée');
    }
});
