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
    // Add your download logic here
    console.log('Downloading file:', type);
    // Example: window.location.href = 'path/to/file.pdf';
    alert('Téléchargement du fichier ' + type + '...');
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
    const forms = document.querySelectorAll('.pitch-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (currentStep === 2) {
                alert('Votre candidature a été soumise avec succès !');
                closeForm();
                // Reset form
                this.reset();
                currentStep = 1;
                document.getElementById('step1').classList.add('active');
                document.getElementById('step2').classList.remove('active');
                document.querySelector('[data-step="1"]').classList.add('active');
                document.querySelector('[data-step="1"]').classList.remove('completed');
                document.querySelector('[data-step="2"]').classList.remove('active');
            }
        });
    });

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

