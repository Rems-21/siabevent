from django.db import models

class ParticipationTombola(models.Model):
    """Modèle pour les participations à la tombola"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('paid', 'Payé'),
        ('cancelled', 'Annulé'),
    ]
    
    # Informations personnelles
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    pays = models.CharField(max_length=100)
    
    # Informations de paiement
    LOT_CHOICES = [
        ('lot1', 'Lot 1 - Billet d\'avion (5€)'),
        ('lot2', 'Lot 2 - Terrain 300 m² (10€)'),
    ]
    lot = models.CharField(max_length=10, choices=LOT_CHOICES, default='lot1', verbose_name="Lot choisi")
    nombre_tickets = models.IntegerField(default=1, verbose_name="Nombre de tickets")
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2, default=5.00, verbose_name="Prix unitaire (€)")
    montant_total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Montant total (€)")
    
    # Statut et paiement Stripe
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True, null=True)
    
    # Numéros de tickets (générés après paiement)
    numeros_tickets = models.TextField(blank=True, help_text="Numéros de tickets séparés par des virgules")
    
    # Métadonnées
    date_inscription = models.DateTimeField(auto_now_add=True)
    date_paiement = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-date_inscription']
        verbose_name = "Participation Tombola"
        verbose_name_plural = "Participations Tombola"
    
    def __str__(self):
        lot_display = self.get_lot_display()
        return f"{self.nom} {self.prenom} - {lot_display} - {self.nombre_tickets} ticket(s) - {self.statut}"
    
    def save(self, *args, **kwargs):
        # Calculer le montant total
        self.montant_total = self.nombre_tickets * self.prix_unitaire
        super().save(*args, **kwargs)
