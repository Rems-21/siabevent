from django.db import models


class Reservation(models.Model):
    # Choix pour le type de stand
    STAND_CHOICES = [
        ('6m2', 'Stand 6m² - Standard'),
        ('9m2', 'Stand 9m² - Populaire'),
        ('12m2', 'Stand 12m² - Premium'),
        ('18m2', 'Stand 18m² - VIP'),
    ]
    
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirmee', 'Confirmée'),
        ('annulee', 'Annulée'),
    ]
    
    # Informations de l'entreprise
    nom_entreprise = models.CharField(max_length=200, verbose_name="Nom de l'entreprise")
    secteur_activite = models.CharField(max_length=200, verbose_name="Secteur d'activité")
    adresse = models.TextField(verbose_name="Adresse complète")
    ville = models.CharField(max_length=100, verbose_name="Ville")
    pays = models.CharField(max_length=100, verbose_name="Pays")
    telephone = models.CharField(max_length=50, verbose_name="Téléphone")
    email = models.EmailField(verbose_name="Email")
    site_web = models.URLField(blank=True, null=True, verbose_name="Site web")
    
    # Contact principal
    nom_contact = models.CharField(max_length=200, verbose_name="Nom du contact")
    fonction_contact = models.CharField(max_length=200, verbose_name="Fonction du contact")
    telephone_contact = models.CharField(max_length=50, verbose_name="Téléphone du contact")
    email_contact = models.EmailField(verbose_name="Email du contact")
    
    # Informations sur le stand
    type_stand = models.CharField(max_length=10, choices=STAND_CHOICES, verbose_name="Type de stand")
    nombre_stands = models.PositiveIntegerField(default=1, verbose_name="Nombre de stands")
    
    # Options supplémentaires
    mobilier_supplementaire = models.BooleanField(default=False, verbose_name="Mobilier supplémentaire")
    eclairage_supplementaire = models.BooleanField(default=False, verbose_name="Éclairage supplémentaire")
    branchement_electrique = models.BooleanField(default=False, verbose_name="Branchement électrique")
    connexion_internet = models.BooleanField(default=False, verbose_name="Connexion Internet")
    
    # Commentaires et besoins spécifiques
    besoins_specifiques = models.TextField(blank=True, verbose_name="Besoins spécifiques / Commentaires")
    
    # Informations administratives
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente', verbose_name="Statut")
    date_reservation = models.DateTimeField(auto_now_add=True, verbose_name="Date de réservation")
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Réservation"
        verbose_name_plural = "Réservations"
        ordering = ['-date_reservation']
    
    def __str__(self):
        return f"{self.nom_entreprise} - {self.get_type_stand_display()} ({self.statut})"
