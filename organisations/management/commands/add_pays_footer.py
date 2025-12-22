from django.core.management.base import BaseCommand
from organisations.models import Pays


class Command(BaseCommand):
    help = 'Ajoute les pays affichés dans le footer du site'

    def handle(self, *args, **options):
        # Liste des 14 pays du footer avec leurs codes ISO
        pays_data = [
            {'code': 'cm', 'nom': 'Cameroun', 'code_drapeau': 'cm'},
            {'code': 'ga', 'nom': 'Gabon', 'code_drapeau': 'ga'},
            {'code': 'cd', 'nom': 'République démocratique du Congo', 'code_drapeau': 'cd'},
            {'code': 'ci', 'nom': 'Côte d\'Ivoire', 'code_drapeau': 'ci'},
            {'code': 'tg', 'nom': 'Togo', 'code_drapeau': 'tg'},
            {'code': 'rw', 'nom': 'Rwanda', 'code_drapeau': 'rw'},
            {'code': 'cf', 'nom': 'République centrafricaine', 'code_drapeau': 'cf'},
            {'code': 'bj', 'nom': 'Bénin', 'code_drapeau': 'bj'},
            {'code': 'sn', 'nom': 'Sénégal', 'code_drapeau': 'sn'},
            {'code': 'gn', 'nom': 'Guinée', 'code_drapeau': 'gn'},
            {'code': 'bf', 'nom': 'Burkina Faso', 'code_drapeau': 'bf'},
            {'code': 'ml', 'nom': 'Mali', 'code_drapeau': 'ml'},
            {'code': 'bi', 'nom': 'Burundi', 'code_drapeau': 'bi'},
            {'code': 'sl', 'nom': 'Sierra Leone', 'code_drapeau': 'sl'},
        ]

        created_count = 0
        updated_count = 0

        for pays_info in pays_data:
            pays, created = Pays.objects.update_or_create(
                code=pays_info['code'],
                defaults={
                    'nom': pays_info['nom'],
                    'code_drapeau': pays_info['code_drapeau']
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'[+] Cree: {pays.nom} ({pays.code})')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'[~] Mis a jour: {pays.nom} ({pays.code})')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nTermine ! {created_count} pays crees, {updated_count} pays mis a jour.'
            )
        )

