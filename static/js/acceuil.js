// Countdown Timer for SIAB 2026
document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer - SIAB 2026: 25 juin 2026
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (daysElement && hoursElement && minutesElement && secondsElement) {
        const targetDate = new Date('2026-06-25T00:00:00');
        
        function updateCountdown() {
            const now = new Date();
            let diff = targetDate - now;
            
            if (diff < 0) {
                // L'événement est passé
                daysElement.textContent = '000';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            daysElement.textContent = String(days).padStart(3, '0');
            hoursElement.textContent = String(hours).padStart(2, '0');
            minutesElement.textContent = String(minutes).padStart(2, '0');
            secondsElement.textContent = String(seconds).padStart(2, '0');
        }
        
        // Mettre à jour immédiatement
        updateCountdown();
        
        // Mettre à jour toutes les secondes
        setInterval(updateCountdown, 1000);
    }
    
    // Statistics Counter Animation
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        if (statNumbers.length === 0) {
            return;
        }
        
        function animateCounter(element, target, duration = 2000) {
            const start = 0;
            const startTime = performance.now();
            const prefix = element.textContent.includes('+') ? '+' : '';
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (target - start) * easeOutQuart);
                
                element.textContent = prefix + current;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = prefix + target;
                }
            }
            
            requestAnimationFrame(updateCounter);
        }
        
        // Observer pour déclencher l'animation quand les stats sont visibles
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    if (!isNaN(target) && target > 0) {
                        animateCounter(entry.target, target);
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '100px'
        });
        
        // Observer chaque stat
        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
        
        // Vérifier aussi si la section est déjà visible au chargement
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Si la section est visible, vérifier les stats qui ne sont pas encore comptées
                        statNumbers.forEach(stat => {
                            if (!stat.classList.contains('counted')) {
                                const rect = stat.getBoundingClientRect();
                                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                                if (isVisible) {
                                    stat.classList.add('counted');
                                    const target = parseInt(stat.getAttribute('data-target'));
                                    if (!isNaN(target) && target > 0) {
                                        setTimeout(() => {
                                            animateCounter(stat, target);
                                        }, 200);
                                    }
                                }
                            }
                        });
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            sectionObserver.observe(countdownSection);
        }
    }
    
    // Initialiser le compteur des stats après un court délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
        initStatsCounter();
    }, 100);
});

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
    
    // Fonction pour mettre à jour le carousel avec boucle
    function updateCarousel() {
        const track = representativesCarouselInner;
        const maxIndex = totalRepresentatives - 1;
        
        // Boucle infinie : si on dépasse, on revient au début/fin
        if (currentIndex > maxIndex) {
            currentIndex = 0;
        }
        if (currentIndex < 0) {
            currentIndex = maxIndex;
        }
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Les boutons sont toujours actifs car on boucle
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
    
    // Fonction pour démarrer l'auto-slide avec boucle
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
