document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       1. COUNTDOWN TIMER – SIAB 2026
    ===================================================== */
    (function initCountdown() {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        // Date cible en UTC pour éviter les problèmes de fuseau horaire
        const targetDate = new Date(Date.UTC(2026, 5, 25, 0, 0, 0));
        let countdownInterval;

        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                daysEl.textContent = '000';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            daysEl.textContent = String(days).padStart(3, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    })();


    /* =====================================================
       2. STATISTICS COUNTER (IntersectionObserver)
    ===================================================== */
    (function initStatsCounter() {
        const stats = document.querySelectorAll('.stat-number[data-target]');
        if (!stats.length) return;

        function animateCounter(el, target, duration = 2000) {
            const startTime = performance.now();
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';

            function update(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const value = Math.floor(progress * target);
                el.textContent = `${prefix}${value}${suffix}`;

                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = `${prefix}${target}${suffix}`;
            }

            requestAnimationFrame(update);
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.dataset.target, 10);
                    if (!isNaN(target)) animateCounter(entry.target, target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    })();


    /* =====================================================
       3. REPRESENTATIVES CAROUSEL (Infinite Loop)
    ===================================================== */
    (function initRepresentativesCarousel() {
        const carousel = document.getElementById('representativesCarousel');
        const track = document.getElementById('representativesCarouselInner');
        const prevBtn = document.querySelector('.representative-prev');
        const nextBtn = document.querySelector('.representative-next');

        if (!carousel || !track) return;

        const items = Array.from(track.querySelectorAll('.representative-item'));
        if (!items.length) return;

        let currentIndex = 1;
        let autoSlideTimer;
        const AUTO_SLIDE_DELAY = 5000;

        // Construction du carousel infini
        track.innerHTML = '';
        track.classList.add('carousel-track');

        const slides = [];

        function createSlide(item) {
            const slide = document.createElement('div');
            slide.className = 'slide';

            const row = document.createElement('div');
            row.className = 'row justify-content-center';

            const clone = item.cloneNode(true);
            clone.className = 'representative-item col-12 col-md-8 col-lg-6';

            row.appendChild(clone);
            slide.appendChild(row);
            return slide;
        }

        slides.push(createSlide(items[items.length - 1])); // clone last
        items.forEach(item => slides.push(createSlide(item)));
        slides.push(createSlide(items[0])); // clone first

        slides.forEach(slide => track.appendChild(slide));

        function updateCarousel(animate = true) {
            track.style.transition = animate ? 'transform 0.5s ease' : 'none';
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function next() {
            currentIndex++;
            updateCarousel();
            resetAutoSlide();
        }

        function prev() {
            currentIndex--;
            updateCarousel();
            resetAutoSlide();
        }

        track.addEventListener('transitionend', () => {
            if (currentIndex === slides.length - 1) {
                currentIndex = 1;
                updateCarousel(false);
            }
            if (currentIndex === 0) {
                currentIndex = slides.length - 2;
                updateCarousel(false);
            }
        });

        function startAutoSlide() {
            autoSlideTimer = setInterval(next, AUTO_SLIDE_DELAY);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideTimer);
            startAutoSlide();
        }

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        carousel.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
        carousel.addEventListener('mouseleave', startAutoSlide);

        updateCarousel(false);
        startAutoSlide();
    })();

});
