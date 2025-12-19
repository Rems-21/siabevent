from django.db import models


class BadgeVisiteur(models.Model):
    # Informations du visiteur
    prenom = models.CharField(max_length=100, verbose_name="Prénom")
    nom = models.CharField(max_length=100, verbose_name="Nom")
    email = models.EmailField(verbose_name="Email")
    code_pays = models.CharField(max_length=100, verbose_name="Code Pays")
    telephone = models.CharField(max_length=50, blank=True, verbose_name="Téléphone")
    message = models.TextField(blank=True, verbose_name="Message")
    
    # Informations administratives
    date_inscription = models.DateTimeField(auto_now_add=True, verbose_name="Date d'inscription")
    badge_envoye = models.BooleanField(default=False, verbose_name="Badge envoyé")
    
    class Meta:
        verbose_name = "Badge Visiteur"
        verbose_name_plural = "Badges Visiteurs"
        ordering = ['-date_inscription']
    
    def __str__(self):
        return f"{self.prenom} {self.nom} - {self.code_pays}"

