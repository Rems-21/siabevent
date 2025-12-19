// Script pour la page Participer

document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top functionality
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
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

    // Countdown SIAB 2026 - 25 juin 2026
    const countdownNumbers = document.querySelectorAll('.count-number');
    const targetDate = new Date('2026-06-25T00:00:00Z');

    function updateCountdown() {
        const now = new Date();
        let diff = targetDate - now;
        if (diff < 0) diff = 0;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const values = { days, hours, minutes, seconds };
        countdownNumbers.forEach(el => {
            const unit = el.getAttribute('data-count-unit');
            const value = values[unit] ?? 0;
            const formatted = unit === 'days'
                ? String(value).padStart(3, '0')
                : String(value).padStart(2, '0');
            el.textContent = formatted;
        });
    }

    if (countdownNumbers.length) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});

