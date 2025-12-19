from django.db import models
from django.utils import timezone

class Article(models.Model):
    titre = models.CharField(max_length=255, verbose_name="Titre")
    resume = models.TextField(verbose_name="Résumé")
    contenu = models.TextField(verbose_name="Contenu")
    image = models.ImageField(upload_to='uploads/', blank=True, null=True, verbose_name="Image")
    date_creation = models.DateTimeField(default=timezone.now, verbose_name="Date de création")
    
    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"
        ordering = ['-date_creation']
    
    def __str__(self):
        return self.titre
