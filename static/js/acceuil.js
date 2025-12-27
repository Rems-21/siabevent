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
        // Les éléments se déplacent un par un sur tous les écrans
        function getItemsPerSlide() {
            // Toujours 1 élément par slide pour un défilement un par un
            return 1;
        }

        // Fonction pour réorganiser les slides selon la taille d'écran
        function reorganizeCarousel() {
            if (!representativesCarouselInner || totalRepresentatives === 0) return;

            const itemsPerSlide = getItemsPerSlide();
            const width = window.innerWidth;
            
            // Déterminer si on doit activer le slider
            // Desktop: slider à partir de 5 éléments
            // Mobile: slider à partir de 2 éléments
            // Avec 1 élément par slide, on a besoin de plus d'un élément pour activer le slider
            let needsSlider = false;
            if (width < 768) {
                // Mobile/Tablet: slider à partir de 2 éléments
                needsSlider = totalRepresentatives >= 2;
            } else {
                // Desktop: slider à partir de 5 éléments
                needsSlider = totalRepresentatives >= 5;
            }
            
            // Calculer le nombre de slides (1 élément par slide)
            const totalSlides = needsSlider ? totalRepresentatives : 1;
            
            // Vérifier que le slider est vraiment nécessaire (plus d'un slide)
            if (needsSlider && totalSlides <= 1) {
                needsSlider = false;
            }
            
            console.log('Reorganizing carousel:', {
                totalRepresentatives,
                itemsPerSlide,
                totalSlides,
                needsSlider,
                width,
                isMobile: width < 768
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
                                // Puisqu'on affiche un seul élément par slide, on centre et on utilise une largeur appropriée
                                if (width < 576) {
                                    representativeItem.classList.add('col-12');
                                } else if (width < 768) {
                                    representativeItem.classList.add('col-12', 'col-sm-10', 'col-md-8');
                                } else if (width < 992) {
                                    representativeItem.classList.add('col-12', 'col-md-8', 'col-lg-6');
                                } else if (width < 1200) {
                                    representativeItem.classList.add('col-12', 'col-lg-8', 'col-xl-6');
                                } else {
                                    // Pour écrans > 1200px, centrer avec une largeur fixe
                                    representativeItem.classList.add('col-12', 'col-xl-8', 'col-xxl-6');
                                }
                                row.appendChild(representativeItem);
                            }
                        }
                    }
                    
                    carouselItem.appendChild(row);
                    representativesCarouselInner.appendChild(carouselItem);
                    
                    // Log pour vérifier la création des slides
                    if (width >= 1200) {
                        console.log(`Desktop slide ${i + 1} created with ${endIndex - startIndex} items`);
                    }
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
                        
                        // Vérifier qu'on a vraiment plusieurs slides
                        const items = representativesCarouselInner.querySelectorAll('.carousel-item');
                        const actualSlides = items.length;
                        
                        console.log('Carousel check:', {
                            totalSlides,
                            actualSlides,
                            needsSlider,
                            isMobile: width < 768
                        });
                        
                        if (actualSlides > 1) {
                            // S'assurer que le premier slide est actif
                            items.forEach((item, index) => {
                                item.classList.remove('active');
                                if (index === 0) {
                                    item.classList.add('active');
                                }
                            });
                            
                            console.log('Carousel initialized with', actualSlides, 'slides on', width < 768 ? 'mobile' : 'desktop');
                            
                            // Mécanisme de secours : forcer le défilement toutes les 4 secondes
                            // Ce mécanisme fonctionne sur mobile ET desktop
                            let currentSlideIndex = 0;
                            
                            // Arrêter l'ancien intervalle s'il existe
                            if (window.representativesCarouselInterval) {
                                clearInterval(window.representativesCarouselInterval);
                                window.representativesCarouselInterval = null;
                            }
                            
                            // Fonction pour changer de slide
                            const changeSlide = () => {
                                const currentItems = representativesCarouselInner.querySelectorAll('.carousel-item');
                                const actualTotalSlides = currentItems.length;
                                
                                if (actualTotalSlides > 1) {
                                    currentSlideIndex = (currentSlideIndex + 1) % actualTotalSlides;
                                    console.log('🔄 Moving to slide', currentSlideIndex + 1, 'of', actualTotalSlides, 'on', width < 768 ? 'mobile' : 'desktop');
                                    
                                    // Changer manuellement les classes active
                                    currentItems.forEach((item, idx) => {
                                        item.classList.remove('active');
                                        // S'assurer que l'item est visible
                                        item.style.display = 'none';
                                        if (idx === currentSlideIndex) {
                                            item.classList.add('active');
                                            item.style.display = 'block';
                                        }
                                    });
                                    
                                    // Essayer aussi avec Bootstrap si disponible
                                    if (window.representativesCarouselInstance) {
                                        try {
                                            window.representativesCarouselInstance.to(currentSlideIndex);
                                        } catch(e) {
                                            console.log('Bootstrap to() failed, using manual class change');
                                        }
                                    }
                                } else {
                                    console.log('⚠️ Only one slide, stopping interval');
                                    if (window.representativesCarouselInterval) {
                                        clearInterval(window.representativesCarouselInterval);
                                        window.representativesCarouselInterval = null;
                                    }
                                }
                            };
                            
                            // Démarrer l'intervalle immédiatement
                            window.representativesCarouselInterval = setInterval(changeSlide, 4000);
                            
                            // S'assurer que le premier slide est visible
                            const firstItem = representativesCarouselInner.querySelector('.carousel-item.active');
                            if (firstItem) {
                                firstItem.style.display = 'block';
                            }
                            console.log('✅ Carousel interval started, will change slide every 4 seconds');
                            
                            // Démarrer le cycle Bootstrap (peut ne pas fonctionner, d'où le mécanisme de secours)
                            if (window.representativesCarouselInstance) {
                                try {
                                    window.representativesCarouselInstance.cycle();
                                    console.log('✅ Bootstrap cycle() started');
                                } catch(e) {
                                    console.log('⚠️ Bootstrap cycle() not working, using manual interval only');
                                }
                            }
                        } else {
                            console.log('❌ Not enough slides for carousel:', actualSlides);
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

