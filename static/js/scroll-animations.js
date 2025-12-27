// Scroll Animations System - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    // Create Intersection Observer with better performance
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animation type mapping for different elements
    const animationMap = {
        '.section-title': 'fade-down',
        '.content-box': 'fade-up',
        '.stat-box': 'scale',
        '.countdown-box': 'fade-up',
        '.exhibitor-logo-box': 'fade-up',
        '.representative-card': 'fade-left',
        '.contact-card': 'fade-right',
        '.logistique-card': 'fade-up',
        '.participation-card': 'scale',
        '.thematic-card': 'fade-up',
        '.target-card': 'fade-up',
        '.tombola-card': 'fade-up',
        '.form-container': 'fade-up',
        '.disclaimer-box': 'fade-up',
        'h1': 'fade-down',
        'h2': 'fade-down',
        'h3': 'fade-down',
        '.btn': 'scale',
        '.btn-submit-form': 'scale',
        'img': 'fade-up',
        '.card': 'fade-up',
        '.row > div': 'fade-up',
        '.col-lg-3': 'fade-up',
        '.col-lg-4': 'fade-up',
        '.col-lg-6': 'fade-up',
        '.col-md-6': 'fade-up',
        '.col-12': 'fade-up'
    };

    // Function to add animations to elements
    function addAnimations(selector, animationType) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            // Skip if already has animation class or no-animate flag
            if (el.classList.contains('no-animate') || el.classList.contains('scroll-animate')) return;
            
            // Skip header and footer elements
            if (el.closest('header') || el.closest('footer')) return;
            
            // Pour stat-box et countdown-box, ne pas ajouter les classes génériques
            // car ils ont leurs propres animations spécifiques (bounce-in et fade-up-countdown)
            if (el.classList.contains('stat-box') || el.classList.contains('countdown-box')) {
                el.classList.add('scroll-animate');
                // Observer directement sans ajouter animate-scale ou animate-fade-up
            } else {
                // Add base animation class
                el.classList.add('scroll-animate');
                
                // Add specific animation type
                el.classList.add(`animate-${animationType}`);
            }
            
            // Add staggered delay for children in same container
            const parent = el.parentElement;
            const siblings = Array.from(parent.children).filter(child => 
                child.classList.contains('scroll-animate') || child === el
            );
            const siblingIndex = siblings.indexOf(el);
            const delay = siblingIndex * 100;
            el.style.setProperty('--animation-delay', `${delay}ms`);
            
            observer.observe(el);
        });
    }

    // Apply animations based on mapping
    Object.keys(animationMap).forEach(selector => {
        addAnimations(selector, animationMap[selector]);
    });

    // Animate rows and columns with staggered effect
    document.querySelectorAll('.row').forEach((row, rowIndex) => {
        const children = Array.from(row.children).filter(child => 
            !child.classList.contains('no-animate') && 
            !child.closest('header') && 
            !child.closest('footer')
        );
        
        children.forEach((child, childIndex) => {
            if (!child.classList.contains('scroll-animate')) {
                child.classList.add('scroll-animate');
                const animationTypes = ['fade-up', 'fade-left', 'fade-right', 'scale'];
                const animType = animationTypes[childIndex % animationTypes.length];
                child.classList.add(`animate-${animType}`);
                child.style.setProperty('--animation-delay', `${childIndex * 150}ms`);
                observer.observe(child);
            }
        });
    });

    // Animate sections
    document.querySelectorAll('section').forEach((section, index) => {
        if (section.classList.contains('no-animate') || section.classList.contains('hero-section')) return;
        
        const directChildren = Array.from(section.children).filter(child => 
            !child.classList.contains('scroll-animate') &&
            !child.classList.contains('no-animate')
        );
        
        directChildren.forEach((child, childIndex) => {
            child.classList.add('scroll-animate');
            child.classList.add('animate-fade-up');
            child.style.setProperty('--animation-delay', `${childIndex * 100}ms`);
            observer.observe(child);
        });
    });
});

