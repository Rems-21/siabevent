from django.db import models
from django.utils import timezone
import random
import string

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
    
    # Numéros de tickets (générés à l'inscription)
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
    
    def generer_numeros_tickets(self):
        """Générer les numéros de tickets uniques"""
        if not self.numeros_tickets:
            self.numeros_tickets = ','.join([
                ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
                for _ in range(self.nombre_tickets)
            ])

    def save(self, *args, **kwargs):
        """Générer les numéros de tickets SEULEMENT si le statut passe à 'paid'"""
        # Vérifier si c'est une mise à jour (l'objet existe déjà)
        if self.pk:
            # Récupérer l'instance précédente
            old_instance = ParticipationTombola.objects.get(pk=self.pk)
            
            # Si le statut passe de 'pending' à 'paid', générer les tickets
            if old_instance.statut == 'pending' and self.statut == 'paid':
                if not self.numeros_tickets:  # Générer seulement s'ils n'existent pas
                    self.generer_numeros_tickets()
        
        super().save(*args, **kwargs)
    
    def generer_numeros_tickets(self):
        """Génère les numéros de tickets aléatoires"""
        tickets = []
        for _ in range(self.nombre_tickets):
            ticket = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            tickets.append(ticket)
        self.numeros_tickets = ','.join(tickets)
