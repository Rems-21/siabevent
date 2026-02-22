from django.db import models


class Paneliste(models.Model):
    # Informations personnelles
    nom = models.CharField(max_length=100, verbose_name="Nom")
    prenom = models.CharField(max_length=100, verbose_name="Prénom")
    photo = models.ImageField(upload_to='panelistes/', blank=True, null=True, verbose_name="Photo")
    pays_origine = models.CharField(max_length=100, verbose_name="Pays d'origine")
    telephone = models.CharField(max_length=50, verbose_name="Téléphone")
    email = models.EmailField(verbose_name="Email")
    
    # CV/Biographie
    cv_fichier = models.FileField(upload_to='cv_panelistes/', verbose_name="CV / Biographie", help_text="PDF ou Word")
    
    # Intervention
    theme = models.CharField(max_length=300, verbose_name="Thème à aborder")
    resume_presentation = models.TextField(verbose_name="Résumé de la présentation", default="")
    bio = models.TextField(verbose_name="Biographie", default="")

    # Planification (renseignée par l'admin après validation)
    date_presentation = models.DateField(blank=True, null=True, verbose_name="Date de la présentation")
    heure_presentation = models.TimeField(blank=True, null=True, verbose_name="Heure de la présentation")
    duree_presentation = models.PositiveIntegerField(blank=True, null=True, verbose_name="Durée (minutes)")
    
    # Informations administratives
    date_candidature = models.DateTimeField(auto_now_add=True, verbose_name="Date de candidature")
    statut = models.CharField(
        max_length=20,
        choices=[
            ('en_attente', 'En attente'),
            ('accepte', 'Accepté'),
            ('refuse', 'Refusé'),
        ],
        default='en_attente',
        verbose_name="Statut"
    )
    notes_internes = models.TextField(blank=True, verbose_name="Notes internes")
    
    class Meta:
        verbose_name = "Panéliste"
        verbose_name_plural = "Panélistes"
        ordering = ['-date_candidature']
    
    def __str__(self):
        return f"{self.prenom} {self.nom} - {self.theme}"

