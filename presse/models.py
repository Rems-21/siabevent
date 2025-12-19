from django.db import models


class BadgePresse(models.Model):
    TYPE_MEDIA_CHOICES = [
        ('presse_ecrite', 'Presse écrite'),
        ('presse_en_ligne', 'Presse en ligne'),
        ('media_tv', 'Média TV'),
        ('radio', 'Radio'),
    ]
    
    # Informations personnelles
    prenom = models.CharField(max_length=100, verbose_name="Prénom")
    nom = models.CharField(max_length=100, verbose_name="Nom")
    nom_media = models.CharField(max_length=200, verbose_name="Nom du média")
    type_media = models.CharField(max_length=20, choices=TYPE_MEDIA_CHOICES, verbose_name="Type de média")
    pays_origine_media = models.CharField(max_length=100, verbose_name="Pays d'origine du média")
    code_pays = models.CharField(max_length=100, verbose_name="Code Pays")
    telephone = models.CharField(max_length=50, verbose_name="Téléphone")
    email = models.EmailField(verbose_name="Email")
    message = models.TextField(blank=True, verbose_name="Votre message")
    
    # Collaborateurs
    emails_collaborateurs = models.TextField(blank=True, verbose_name="Emails des collaborateurs", help_text="Un email par ligne")
    
    # Informations administratives
    date_demande = models.DateTimeField(auto_now_add=True, verbose_name="Date de demande")
    badge_delivre = models.BooleanField(default=False, verbose_name="Badge délivré")
    
    class Meta:
        verbose_name = "Badge Presse"
        verbose_name_plural = "Badges Presse"
        ordering = ['-date_demande']
    
    def __str__(self):
        return f"{self.prenom} {self.nom} - {self.nom_media}"
    
    def get_collaborateurs_list(self):
        """Retourne la liste des emails collaborateurs"""
        if self.emails_collaborateurs:
            return [email.strip() for email in self.emails_collaborateurs.split('\n') if email.strip()]
        return []

