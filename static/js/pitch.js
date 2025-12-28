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

// Download file function
function downloadFile(type) {
    // Déterminer le chemin du fichier selon le type
    // Utiliser le chemin de base des fichiers statiques (défini dans le template)
    const staticBase = window.STATIC_URL || '/static/';
    let filePath = '';
    let fileName = '';
    
    switch(type) {
        case 'reglement':
            filePath = staticBase + 'documents/reglement.pdf';
            fileName = 'Reglement_Interieur_Pitch_SIAB_2026.pdf';
            break;
        case 'modele-dossier':
            filePath = staticBase + 'documents/modele-dossier.pdf';
            fileName = 'Modele_Dossier_Pitch_SIAB_2026.pdf';
            break;
        case 'guide':
            filePath = staticBase + 'documents/guide.pdf';
            fileName = 'Guide_Pitch_SIAB_2026.pdf';
            break;
        default:
            console.error('Type de fichier non reconnu:', type);
            alert('Fichier non disponible');
            return;
    }
    
    // Créer un lien temporaire pour télécharger le fichier
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    
    // Ajouter le lien au DOM, cliquer dessus, puis le retirer
    document.body.appendChild(link);
    link.click();
    
    // Retirer le lien après un court délai
    setTimeout(() => {
        if (document.body.contains(link)) {
            document.body.removeChild(link);
        }
    }, 100);
    
    console.log('Téléchargement du fichier:', fileName, 'depuis', filePath);
}

// Form Modal Functions
function openForm() {
    const modal = document.getElementById('formModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    
    // Force le modal au-dessus de tout
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.zIndex = '999999';
}

function closeForm() {
    const modal = document.getElementById('formModal');
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
}

// Form Steps Navigation
let currentStep = 1;

function nextStep() {
    if (currentStep < 2) {
        document.getElementById('step' + currentStep).classList.remove('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('completed');
        
        currentStep++;
        document.getElementById('step' + currentStep).classList.add('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
    }
}

function previousStep() {
    if (currentStep > 1) {
        document.getElementById('step' + currentStep).classList.remove('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep--;
        document.getElementById('step' + currentStep).classList.add('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('completed');
    }
}

// Character counter for textarea
document.addEventListener('DOMContentLoaded', function() {
    const resumeTextarea = document.getElementById('resume');
    const charCount = document.getElementById('charCount');
    
    if (resumeTextarea && charCount) {
        resumeTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    // File input handlers
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.nextElementSibling.nextElementSibling;
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = 'Aucun fichier choisi';
            }
        });
    });

    // Form submission
    const step2Form = document.querySelector('#step2 .pitch-form');
    if (step2Form) {
        step2Form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données des deux étapes
            const step1Form = document.querySelector('#step1 .pitch-form');
            const formData = new FormData();
            
            // Données de l'étape 1
            if (step1Form) {
                const step1Inputs = step1Form.querySelectorAll('input, select, textarea');
                step1Inputs.forEach(input => {
                    if (input.name && input.value) {
                        formData.append(input.name, input.value);
                    }
                });
            }
            
            // Données de l'étape 2
            const step2Inputs = this.querySelectorAll('input, select, textarea');
            step2Inputs.forEach(input => {
                if (input.type === 'file' && input.files.length > 0) {
                    formData.append(input.name, input.files[0]);
                } else if (input.type === 'checkbox') {
                    if (input.checked) {
                        formData.append(input.name, 'on');
                    }
                } else if (input.name && input.value) {
                    formData.append(input.name, input.value);
                }
            });
            
            // Désactiver le bouton de soumission
            const submitBtn = this.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Traitement en cours...</span>';
            }
            
            // Fonction pour récupérer le token CSRF
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
            
            // Envoyer les données au backend
            fetch('/api/submit-prix/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.checkout_url) {
                    // Rediriger vers Stripe Checkout
                    window.location.href = data.checkout_url;
                } else {
                    alert(data.message || 'Une erreur est survenue. Veuillez réessayer.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Envoyer votre Candidature';
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Envoyer votre Candidature';
                }
            });
        });
    }

    // Close modal on outside click
    const modal = document.getElementById('formModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeForm();
            }
        });
    }
});

