// ============================================
// TOMBOLA PAGE - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const ticketsInput = document.getElementById('tickets');
    const decreaseBtn = document.getElementById('decreaseTickets');
    const increaseBtn = document.getElementById('increaseTickets');
    const totalAmount = document.getElementById('totalAmount');
    const form = document.getElementById('tombolaForm');
    
    const PRICE_PER_TICKET = 5;
    
    // Update total amount
    function updateTotal() {
        const tickets = parseInt(ticketsInput.value) || 1;
        const total = tickets * PRICE_PER_TICKET;
        totalAmount.textContent = total + ' €';
    }
    
    // Decrease tickets
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(ticketsInput.value) || 1;
            if (currentValue > 1) {
                ticketsInput.value = currentValue - 1;
                updateTotal();
            }
        });
    }
    
    // Increase tickets
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(ticketsInput.value) || 1;
            if (currentValue < 100) {
                ticketsInput.value = currentValue + 1;
                updateTotal();
            }
        });
    }
    
    // Update total when input changes manually
    if (ticketsInput) {
        ticketsInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 1;
            if (value < 1) value = 1;
            if (value > 100) value = 100;
            this.value = value;
            updateTotal();
        });
    }
    
    // Initialize total
    updateTotal();
    
    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value.trim();
            const prenom = document.getElementById('prenom').value.trim();
            const nom = document.getElementById('nom').value.trim();
            const telephone = document.getElementById('telephone').value.trim();
            const tickets = parseInt(document.getElementById('tickets').value) || 1;
            
            // Basic validation
            if (!email || !prenom || !nom) {
                alert('Veuillez remplir tous les champs obligatoires (*)');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Veuillez entrer une adresse email valide');
                return;
            }
            
            // Calculate total
            const total = tickets * PRICE_PER_TICKET;
            
            // Disable submit button
            const submitBtn = form.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Traitement en cours...</span>';
            }
            
            // Here you would typically send the data to your backend
            // For now, we'll just log it
            console.log('Form submitted:', { 
                email, 
                prenom, 
                nom, 
                telephone, 
                tickets, 
                total 
            });
            
            // Simulate API call (replace with actual payment processing)
            setTimeout(() => {
                alert(`Total à payer: ${total} €\nRedirection vers le paiement...`);
                
                // Re-enable button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Payer maintenant</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
                }
            }, 1000);
        });
    }
});
