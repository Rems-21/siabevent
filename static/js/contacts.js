// Scroll to Top functionality is now handled by scroll-to-top.js

// Form submission handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('.btn-submit-form');
    const originalButtonText = submitButton.innerHTML;
    
    // Get form values
    const nom = document.getElementById('form-nom').value.trim();
    const prenom = document.getElementById('form-prenom').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const telephone = document.getElementById('form-telephone').value.trim();
    const pays = document.getElementById('form-pays').value;
    const sujet = document.getElementById('form-sujet').value;
    const message = document.getElementById('form-message').value.trim();
    const consent = document.getElementById('form-consent').checked;
    
    // Basic validation
    if (!nom || !prenom || !email || !telephone || !sujet || !message || !consent) {
        alert('Veuillez remplir tous les champs obligatoires et accepter les conditions.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }
    
    // Disable submit button and show loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 24 24" class="submit-icon rotating"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg> Envoi en cours...';
    
    // Prepare form data
    const formData = new FormData(this);
    
    // Send data to server
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            alert(data.message);
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Show error message
            alert(data.message || 'Une erreur est survenue lors de l\'envoi du formulaire.');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    })
    .finally(() => {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    });
});

// Smooth scroll functionality
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

