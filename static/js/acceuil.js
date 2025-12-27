// Representatives Carousel Management
// Attendre que le DOM et Bootstrap soient complètement chargés
(function() {
    function initCarousel() {
        // #region agent log
        console.log('[DEBUG] Initializing carousel script');
        fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:2',message:'initCarousel called',data:{timestamp:Date.now(),bootstrap:typeof bootstrap},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        const representativesCarousel = document.getElementById('representativesCarousel');
        const representativesCarouselInner = document.getElementById('representativesCarouselInner');
        const prevButton = document.querySelector('.representative-prev');
        const nextButton = document.querySelector('.representative-next');
        
        // #region agent log
        console.log('[DEBUG] Elements found:', {carousel:!!representativesCarousel,inner:!!representativesCarouselInner,prevBtn:!!prevButton,nextBtn:!!nextButton,bootstrap:typeof bootstrap});
        fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:8',message:'Elements found',data:{carousel:!!representativesCarousel,inner:!!representativesCarouselInner,prevBtn:!!prevButton,nextBtn:!!nextButton,bootstrap:typeof bootstrap},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
        // #endregion
        
        if (!representativesCarousel || !representativesCarouselInner) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:10',message:'Early return - elements missing',data:{carousel:!!representativesCarousel,inner:!!representativesCarouselInner},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            return;
        }
    
    // Stocker les éléments originaux
    const originalItems = [];
    // Chercher les éléments .representative-item dans toute la structure (même imbriqués)
    const representativeItems = representativesCarouselInner.querySelectorAll('.representative-item');
    
    // #region agent log
    console.log('[DEBUG] Finding representative items:', {found:representativeItems.length,innerHTML:representativesCarouselInner.innerHTML.substring(0,200)});
    fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:16',message:'Finding representative items',data:{found:representativeItems.length,innerHTML:representativesCarouselInner.innerHTML.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,F'})}).catch(()=>{});
    // #endregion
    
    // Si aucun élément n'est trouvé, peut-être que la structure est différente
    if (representativeItems.length === 0) {
        // Essayer de trouver les éléments dans les carousel-item existants
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
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:25',message:'Total representatives',data:{total:totalRepresentatives},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    if (totalRepresentatives === 0) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:27',message:'Early return - no representatives',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
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
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:44',message:'reorganizeCarousel called',data:{total:totalRepresentatives,width:window.innerWidth},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        
        if (!representativesCarouselInner || totalRepresentatives === 0) return;
        
        const width = window.innerWidth;
        const shouldUseSlider = needsSlider();
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:50',message:'Should use slider',data:{shouldUseSlider,width,total:totalRepresentatives},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        
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
            
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:90',message:'Slides created',data:{slidesCreated:representativesCarouselInner.querySelectorAll('.carousel-item').length,activeSlides:representativesCarouselInner.querySelectorAll('.carousel-item.active').length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            
            // Afficher les boutons de navigation
            if (prevButton) {
                prevButton.style.display = 'flex';
                prevButton.classList.remove('d-none');
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:93',message:'Prev button shown',data:{display:prevButton.style.display,hasTarget:prevButton.hasAttribute('data-bs-target')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
            }
            if (nextButton) {
                nextButton.style.display = 'flex';
                nextButton.classList.remove('d-none');
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:98',message:'Next button shown',data:{display:nextButton.style.display,hasTarget:nextButton.hasAttribute('data-bs-target')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
            }
            
            // Initialiser le carousel Bootstrap
            setTimeout(() => {
                // #region agent log
                console.log('[DEBUG] Initializing carousel:', {bootstrap:typeof bootstrap,existingInstance:!!window.representativesCarouselInstance,itemsCount:representativesCarouselInner.querySelectorAll('.carousel-item').length});
                fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:102',message:'Initializing carousel',data:{bootstrap:typeof bootstrap,existingInstance:!!window.representativesCarouselInstance,itemsCount:representativesCarouselInner.querySelectorAll('.carousel-item').length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,E'})}).catch(()=>{});
                // #endregion
                
                // Disposer l'ancienne instance si elle existe
                if (window.representativesCarouselInstance) {
                    try {
                        window.representativesCarouselInstance.dispose();
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:107',message:'Disposed old instance',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
                        // #endregion
                    } catch(e) {
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:110',message:'Error disposing instance',data:{error:e.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
                        // #endregion
                    }
                }
                
                // Créer une nouvelle instance - attendre que Bootstrap soit chargé
                const initCarousel = () => {
                    if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
                        try {
                            window.representativesCarouselInstance = new bootstrap.Carousel(representativesCarousel, {
                                interval: 5000, // 5 secondes pour une animation plus douce
                                wrap: true,
                                ride: 'carousel',
                                pause: 'hover',
                                touch: true,
                                keyboard: true
                            });
                            console.log('[DEBUG] Carousel instance created successfully');
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:120',message:'Carousel instance created',data:{instance:!!window.representativesCarouselInstance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                            // #endregion
                        } catch(e) {
                            console.error('[DEBUG] Error creating carousel:', e);
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:123',message:'Error creating carousel',data:{error:e.message,stack:e.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                            // #endregion
                        }
                    } else {
                        console.warn('[DEBUG] Bootstrap not available, retrying...');
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/b90a0f08-a095-42f8-9eb5-ca1541377b4b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'acceuil.js:127',message:'Bootstrap not available',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                        // #endregion
                        // Réessayer après un court délai
                        setTimeout(initCarousel, 100);
                    }
                };
                
                initCarousel();
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
    }
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        // DOM déjà chargé, mais attendre que Bootstrap soit disponible
        if (typeof bootstrap !== 'undefined') {
            initCarousel();
        } else {
            // Attendre que Bootstrap soit chargé
            const checkBootstrap = setInterval(() => {
                if (typeof bootstrap !== 'undefined') {
                    clearInterval(checkBootstrap);
                    initCarousel();
                }
            }, 50);
            // Timeout de sécurité après 5 secondes
            setTimeout(() => {
                clearInterval(checkBootstrap);
                if (typeof bootstrap === 'undefined') {
                    console.error('[DEBUG] Bootstrap not loaded after 5 seconds');
                }
            }, 5000);
        }
    }
})();
