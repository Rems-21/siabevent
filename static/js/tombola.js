// Scroll to Top functionality
window.addEventListener('scroll', function() {
    const scrollToTop = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollToTop.classList.add('show');
    } else {
        scrollToTop.classList.remove('show');
    }
});

// Smooth scroll to top
document.querySelector('.scroll-to-top').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission handler
document.querySelector('.tombola-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;
    const telephone = document.getElementById('telephone').value;
    const tickets = document.getElementById('tickets').value;
    
    // Basic validation
    if (!email || !prenom || !nom) {
        alert('Veuillez remplir tous les champs obligatoires (*)');
        return;
    }
    
    // Calculate total
    const total = parseInt(tickets) * 5;
    
    // Add your payment processing logic here
    console.log('Form submitted:', { email, prenom, nom, telephone, tickets, total });
    alert(`Total à payer: ${total} €\nRedirection vers le paiement...`);
});

