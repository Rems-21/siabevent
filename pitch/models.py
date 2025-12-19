from django.db import models

class CandidaturePitch(models.Model):
    """Modèle pour les candidatures au concours de pitch"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('paid', 'Payé'),
        ('selected', 'Sélectionné'),
        ('rejected', 'Rejeté'),
        ('cancelled', 'Annulé'),
    ]
    
    # Informations du porteur de projet
    nom_porteur = models.CharField(max_length=100, verbose_name="Nom du porteur")
    prenom_porteur = models.CharField(max_length=100, verbose_name="Prénom du porteur")
    email = models.EmailField()
    indicatif_pays = models.CharField(max_length=10, verbose_name="Indicatif téléphonique")
    telephone = models.CharField(max_length=20)
    pays_residence = models.CharField(max_length=100, verbose_name="Pays de résidence")
    pays_origine = models.CharField(max_length=100, verbose_name="Pays d'origine")
    pays_impact = models.CharField(max_length=100, verbose_name="Pays d'impact du projet")
    
    # Informations du projet
    nom_projet = models.CharField(max_length=200, verbose_name="Nom du projet/entreprise")
    domaine_activite = models.CharField(max_length=200, verbose_name="Domaine d'activité")
    resume_executif = models.TextField(max_length=500, verbose_name="Résumé exécutif (pitch)")
    
    # Financement et documents
    financement_recherche = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Financement recherché (EUR)")
    lien_video = models.URLField(blank=True, verbose_name="Lien vidéo de présentation")
    
    # Documents (stockés en tant que fichiers)
    document_pitch = models.FileField(upload_to='pitch_documents/', verbose_name="Document de Pitch")
    business_plan = models.FileField(upload_to='pitch_documents/', verbose_name="Business Plan")
    
    # Acceptation
    declaration_acceptee = models.BooleanField(default=False, verbose_name="Déclaration acceptée")
    
    # Paiement (frais de dossier)
    frais_dossier = models.DecimalField(max_digits=10, decimal_places=2, default=50.00, verbose_name="Frais de dossier (€)")
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True, null=True)
    
    # Évaluation (admin)
    note_evaluation = models.TextField(blank=True, verbose_name="Notes d'évaluation")
    score = models.IntegerField(blank=True, null=True, verbose_name="Score /100")
    
    # Métadonnées
    date_soumission = models.DateTimeField(auto_now_add=True)
    date_paiement = models.DateTimeField(blank=True, null=True)
    date_evaluation = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-date_soumission']
        verbose_name = "Candidature Pitch"
        verbose_name_plural = "Candidatures Pitch"
    
    def __str__(self):
        return f"{self.nom_projet} - {self.nom_porteur} {self.prenom_porteur} - {self.statut}"
