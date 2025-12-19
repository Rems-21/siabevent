from django.db import models

class Contact(models.Model):
    """Modèle pour stocker les messages de contact"""
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    pays = models.CharField(max_length=100, blank=True)
    sujet = models.CharField(max_length=100)
    message = models.TextField()
    consent = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    traite = models.BooleanField(default=False, verbose_name="Traité")
    
    class Meta:
        ordering = ['-date_creation']
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
    
    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.sujet}"
