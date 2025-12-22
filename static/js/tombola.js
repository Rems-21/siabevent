// ============================================
// TOMBOLA PAGE - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const ticketsInput = document.getElementById('tickets');
    const decreaseBtn = document.getElementById('decreaseTickets');
    const increaseBtn = document.getElementById('increaseTickets');
    const totalAmount = document.getElementById('totalAmount');
    const headerPrice = document.getElementById('headerPrice');
    const lotSelect = document.getElementById('lot');
    const form = document.getElementById('tombolaForm');
    
    let PRICE_PER_TICKET = 5;
    
    // Update price based on lot selection
    function updatePrice() {
        if (lotSelect) {
            const selectedOption = lotSelect.options[lotSelect.selectedIndex];
            PRICE_PER_TICKET = parseFloat(selectedOption.getAttribute('data-price')) || 5;
            if (headerPrice) {
                headerPrice.textContent = PRICE_PER_TICKET + ' €';
            }
            updateTotal();
        }
    }
    
    // Update total amount
    function updateTotal() {
        const tickets = parseInt(ticketsInput.value) || 1;
        const total = tickets * PRICE_PER_TICKET;
        if (totalAmount) {
            totalAmount.textContent = total + ' €';
        }
    }
    
    // Listen to lot selection change
    if (lotSelect) {
        lotSelect.addEventListener('change', updatePrice);
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
    
    // Initialize price and total
    updatePrice();
    updateTotal();
    
    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value.trim();
            const prenom = document.getElementById('prenom').value.trim();
            const nom = document.getElementById('nom').value.trim();
            const telephone = document.getElementById('telephone').value.trim();
            const pays = document.getElementById('pays').value.trim();
            const lot = lotSelect ? lotSelect.value : 'lot1';
            const tickets = parseInt(document.getElementById('tickets').value) || 1;
            
            // Basic validation
            if (!email || !prenom || !nom || !telephone || !pays) {
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
            
            // Send data to backend
            const formData = new FormData();
            formData.append('email', email);
            formData.append('prenom', prenom);
            formData.append('nom', nom);
            formData.append('telephone', telephone);
            formData.append('pays', pays);
            formData.append('lot', lot);
            formData.append('nombre_tickets', tickets);
            
            fetch('/api/create-tombola-checkout/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.checkout_url) {
                    window.location.href = data.checkout_url;
                } else {
                    alert(data.message || 'Une erreur est survenue. Veuillez réessayer.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span>Payer maintenant</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Payer maintenant</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
                }
            });
        });
    }
});
