from django.db import models
from django.core.validators import URLValidator

class Partenaire(models.Model):
    """Modèle pour les partenaires SIAB"""
    nom = models.CharField(max_length=200, verbose_name="Nom du partenaire")
    logo = models.ImageField(upload_to='partenaires/', blank=True, null=True, verbose_name="Logo")
    site_web = models.URLField(blank=True, null=True, verbose_name="Site web")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    ordre_affichage = models.IntegerField(default=0, verbose_name="Ordre d'affichage")
    actif = models.BooleanField(default=True, verbose_name="Actif")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['ordre_affichage', 'nom']
        verbose_name = "Partenaire"
        verbose_name_plural = "Partenaires"
    
    def __str__(self):
        return self.nom


class Exposant(models.Model):
    """Modèle pour les exposants SIAB"""
    nom = models.CharField(max_length=200, verbose_name="Nom de l'exposant")
    logo = models.ImageField(upload_to='exposants/', blank=True, null=True, verbose_name="Logo")
    site_web = models.URLField(blank=True, null=True, verbose_name="Site web")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    secteur = models.CharField(max_length=200, blank=True, null=True, verbose_name="Secteur d'activité")
    ordre_affichage = models.IntegerField(default=0, verbose_name="Ordre d'affichage")
    actif = models.BooleanField(default=True, verbose_name="Actif")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['ordre_affichage', 'nom']
        verbose_name = "Exposant"
        verbose_name_plural = "Exposants"
    
    def __str__(self):
        return self.nom


class Representant(models.Model):
    """Modèle pour les représentants SIAB par pays"""
    nom = models.CharField(max_length=200, verbose_name="Nom complet")
    titre = models.CharField(max_length=200, default="Représentant SIAB", verbose_name="Titre")
    photo = models.ImageField(upload_to='representants/', blank=True, null=True, verbose_name="Photo")
    pays = models.ManyToManyField('Pays', related_name='representants', verbose_name="Pays représentés")
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    telephone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")
    ordre_affichage = models.IntegerField(default=0, verbose_name="Ordre d'affichage")
    actif = models.BooleanField(default=True, verbose_name="Actif")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['ordre_affichage', 'nom']
        verbose_name = "Représentant"
        verbose_name_plural = "Représentants"
    
    def __str__(self):
        return f"{self.nom} - {self.titre}"


class Pays(models.Model):
    """Modèle pour les pays (utilisé pour les représentants)"""
    code = models.CharField(max_length=2, unique=True, verbose_name="Code pays (ISO)")
    nom = models.CharField(max_length=100, verbose_name="Nom du pays")
    code_drapeau = models.CharField(max_length=2, blank=True, null=True, verbose_name="Code pour drapeau (flagcdn)")
    
    class Meta:
        ordering = ['nom']
        verbose_name = "Pays"
        verbose_name_plural = "Pays"
    
    def __str__(self):
        return self.nom
    
    def get_flag_url(self, size='w40'):
        """Retourne l'URL du drapeau depuis flagcdn
        
        Args:
            size: Taille du drapeau (w20, w40, w60, w80, etc.)
        """
        code = self.code_drapeau or self.code.lower()
        return f"https://flagcdn.com/{size}/{code}.png"
