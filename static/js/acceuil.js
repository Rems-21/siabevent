// Script pour la page d'accueil SIIMEA

document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top functionality
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        // Afficher/masquer le bouton selon le scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 400) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Scroll smooth vers le haut
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Video autoplay handling
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.play().catch(function(error) {
            console.log('Video autoplay prevented:', error);
        });
    }

    // Countdown Timer
    function updateCountdown() {
        // Date cible : 25 Juin 2026
        const targetDate = new Date('2026-06-25T00:00:00').getTime();
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Si la date est passée, réinitialiser pour l'année suivante
            const nextYear = new Date().getFullYear() + 1;
            const newTargetDate = new Date(`${nextYear}-06-25T00:00:00`).getTime();
            const newDistance = newTargetDate - now;
            updateDisplay(newDistance);
        } else {
            updateDisplay(distance);
        }
    }

    function updateDisplay(distance) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Initialiser le countdown
    updateCountdown();
    
    // Mettre à jour toutes les secondes
    setInterval(updateCountdown, 1000);

    // Animate Statistics Counter
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = '+' + Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = '+' + target;
            }
        };

        updateCounter();
    }

    // Observer pour déclencher l'animation quand la section est visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number[data-target]');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    if (target && !stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat, target, 2000);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const countdownSection = document.querySelector('.countdown-section');
    if (countdownSection) {
        statsObserver.observe(countdownSection);
    }

    // Initialize carousels with proper settings
    const partnersCarousel = document.querySelector('#partnersCarousel');
    const representativesCarousel = document.querySelector('#representativesCarousel');

    if (partnersCarousel) {
        const partnersCarouselInstance = new bootstrap.Carousel(partnersCarousel, {
            interval: 3000,
            wrap: true,
            ride: 'carousel',
            pause: 'hover'
        });
    }

    if (representativesCarousel) {
        const representativesCarouselInner = document.querySelector('#representativesCarouselInner');
        const prevButton = document.querySelector('.representative-prev');
        const nextButton = document.querySelector('.representative-next');
        
        // Stocker les éléments originaux avant toute modification
        const originalItems = Array.from(document.querySelectorAll('.representative-item')).map(item => ({
            html: item.outerHTML,
            dataId: item.getAttribute('data-representant-id')
        }));
        const totalRepresentatives = originalItems.length;

        // Fonction pour déterminer le nombre d'éléments par slide selon la taille d'écran
        function getItemsPerSlide() {
            const width = window.innerWidth;
            if (width < 576) { // Mobile
                return 1;
            } else if (width < 768) { // Tablet small
                return 2;
            } else if (width < 992) { // Tablet
                return 3;
            } else if (width < 1200) { // Desktop small
                return 4;
            } else { // Desktop large
                return 5;
            }
        }

        // Fonction pour réorganiser les slides selon la taille d'écran
        function reorganizeCarousel() {
            if (!representativesCarouselInner || totalRepresentatives === 0) return;

            const itemsPerSlide = getItemsPerSlide();
            const width = window.innerWidth;
            
            // Déterminer si on doit activer le slider
            // Desktop: slider à partir de 5 éléments
            // Mobile: slider à partir de 2 éléments
            let needsSlider = false;
            if (width < 768) {
                // Mobile/Tablet: slider à partir de 2 éléments
                needsSlider = totalRepresentatives >= 2;
            } else {
                // Desktop: slider à partir de 5 éléments
                needsSlider = totalRepresentatives >= 5;
            }
            
            const totalSlides = needsSlider ? Math.ceil(totalRepresentatives / itemsPerSlide) : 1;
            
            console.log('Reorganizing carousel:', {
                totalRepresentatives,
                itemsPerSlide,
                totalSlides,
                needsSlider,
                width
            });
            
            // Vider le contenu actuel
            representativesCarouselInner.innerHTML = '';
            
            if (needsSlider) {
                // Créer de nouveaux slides pour le carousel
                for (let i = 0; i < totalSlides; i++) {
                    const carouselItem = document.createElement('div');
                    carouselItem.className = `carousel-item ${i === 0 ? 'active' : ''}`;
                    
                    const row = document.createElement('div');
                    row.className = 'row justify-content-center align-items-center';
                    
                    const startIndex = i * itemsPerSlide;
                    const endIndex = Math.min(startIndex + itemsPerSlide, totalRepresentatives);
                    
                    for (let j = startIndex; j < endIndex; j++) {
                        if (originalItems[j]) {
                            // Créer un élément temporaire pour parser le HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = originalItems[j].html;
                            const representativeItem = tempDiv.firstElementChild;
                            if (representativeItem) {
                                // S'assurer que les classes Bootstrap sont correctes
                                representativeItem.className = representativeItem.className.replace(/col-\w+-\d+/g, '').trim();
                                // Ajouter les classes appropriées selon la taille d'écran
                                if (width < 576) {
                                    representativeItem.classList.add('col-12');
                                } else if (width < 768) {
                                    representativeItem.classList.add('col-6');
                                } else if (width < 992) {
                                    representativeItem.classList.add('col-4');
                                } else if (width < 1200) {
                                    representativeItem.classList.add('col-3');
                                } else {
                                    representativeItem.classList.add('col-lg-2', 'col-md-4');
                                }
                                row.appendChild(representativeItem);
                            }
                        }
                    }
                    
                    carouselItem.appendChild(row);
                    representativesCarouselInner.appendChild(carouselItem);
                }
            } else {
                // Afficher tous les éléments sans carousel
                const row = document.createElement('div');
                row.className = 'row justify-content-center align-items-center';
                
                for (let j = 0; j < totalRepresentatives; j++) {
                    if (originalItems[j]) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = originalItems[j].html;
                        const representativeItem = tempDiv.firstElementChild;
                        if (representativeItem) {
                            representativeItem.className = representativeItem.className.replace(/col-\w+-\d+/g, '').trim();
                            if (width < 576) {
                                representativeItem.classList.add('col-12');
                            } else if (width < 768) {
                                representativeItem.classList.add('col-6');
                            } else if (width < 992) {
                                representativeItem.classList.add('col-4');
                            } else if (width < 1200) {
                                representativeItem.classList.add('col-3');
                            } else {
                                representativeItem.classList.add('col-lg-2', 'col-md-4');
                            }
                            row.appendChild(representativeItem);
                        }
                    }
                }
                
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item active';
                carouselItem.appendChild(row);
                representativesCarouselInner.appendChild(carouselItem);
            }

            // Afficher/masquer les contrôles et activer le slider selon le nombre de slides
            
            if (needsSlider) {
                // Afficher les contrôles
                if (prevButton) {
                    prevButton.style.display = 'flex';
                    prevButton.classList.remove('d-none');
                }
                if (nextButton) {
                    nextButton.style.display = 'flex';
                    nextButton.classList.remove('d-none');
                }

                // Réinitialiser le carousel seulement s'il y a plus d'un slide
                if (window.representativesCarouselInstance) {
                    try {
                        window.representativesCarouselInstance.dispose();
                    } catch(e) {
                        console.log('Error disposing carousel:', e);
                    }
                }
                
                // Attendre un peu pour que le DOM soit mis à jour
                setTimeout(() => {
                    try {
                        // Vérifier que Bootstrap est disponible
                        if (typeof bootstrap === 'undefined') {
                            console.error('Bootstrap is not loaded');
                            return;
                        }
                        
                        // Arrêter l'ancien intervalle si il existe
                        if (window.representativesCarouselInterval) {
                            clearInterval(window.representativesCarouselInterval);
                            window.representativesCarouselInterval = null;
                        }
                        
                        window.representativesCarouselInstance = new bootstrap.Carousel(representativesCarousel, {
                            interval: 4000,
                            wrap: true,
                            ride: false, // On va démarrer manuellement
                            pause: 'hover',
                            touch: true // Activer le swipe sur mobile
                        });
                        
                        // Forcer le démarrage du carousel
                        if (window.representativesCarouselInstance && totalSlides > 1) {
                            // S'assurer que le premier slide est actif
                            const items = representativesCarouselInner.querySelectorAll('.carousel-item');
                            items.forEach((item, index) => {
                                item.classList.remove('active');
                                if (index === 0) {
                                    item.classList.add('active');
                                }
                            });
                            
                            // Démarrer le cycle manuellement
                            window.representativesCarouselInstance.cycle();
                            console.log('Carousel initialized and cycling with', totalSlides, 'slides');
                            
                            // Mécanisme de secours : forcer le défilement toutes les 4 secondes
                            let currentSlideIndex = 0;
                            window.representativesCarouselInterval = setInterval(() => {
                                if (window.representativesCarouselInstance && totalSlides > 1) {
                                    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
                                    window.representativesCarouselInstance.to(currentSlideIndex);
                                }
                            }, 4000);
                        }
                    } catch(error) {
                        console.error('Error initializing carousel:', error);
                    }
                }, 300);
            } else {
                // Masquer les contrôles si un seul slide
                if (prevButton) {
                    prevButton.style.display = 'none';
                    prevButton.classList.add('d-none');
                }
                if (nextButton) {
                    nextButton.style.display = 'none';
                    nextButton.classList.add('d-none');
                }
                
                // Désactiver le carousel s'il n'y a qu'un seul slide
                if (window.representativesCarouselInstance) {
                    try {
                        window.representativesCarouselInstance.pause();
                        window.representativesCarouselInstance.dispose();
                    } catch(e) {
                        console.log('Error disposing carousel:', e);
                    }
                    window.representativesCarouselInstance = null;
                }
                
                // Arrêter l'intervalle de secours
                if (window.representativesCarouselInterval) {
                    clearInterval(window.representativesCarouselInterval);
                    window.representativesCarouselInterval = null;
                }
            }
        }

        // Initialiser le carousel
        reorganizeCarousel();

        // Réorganiser lors du redimensionnement de la fenêtre
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                reorganizeCarousel();
            }, 250);
        });
    }
});

