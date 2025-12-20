from django.core.management.base import BaseCommand
from organisations.models import Pays


class Command(BaseCommand):
    help = 'Ajoute les pays affichés dans le footer du site'

    def handle(self, *args, **options):
        # Liste des pays du footer avec leurs codes
        pays_data = [
            {'code': 'ie', 'nom': 'Irlande', 'code_drapeau': 'ie'},
            {'code': 'bj', 'nom': 'Bénin', 'code_drapeau': 'bj'},
            {'code': 'ml', 'nom': 'Mali', 'code_drapeau': 'ml'},
            {'code': 'sn', 'nom': 'Sénégal', 'code_drapeau': 'sn'},
            {'code': 'tg', 'nom': 'Togo', 'code_drapeau': 'tg'},
            {'code': 'cd', 'nom': 'République démocratique du Congo', 'code_drapeau': 'cd'},
            {'code': 'ci', 'nom': 'Côte d\'Ivoire', 'code_drapeau': 'ci'},
            {'code': 'cg', 'nom': 'Congo', 'code_drapeau': 'cg'},
            {'code': 'gn', 'nom': 'Guinée', 'code_drapeau': 'gn'},
            {'code': 'ma', 'nom': 'Maroc', 'code_drapeau': 'ma'},
            {'code': 'tn', 'nom': 'Tunisie', 'code_drapeau': 'tn'},
            {'code': 'bf', 'nom': 'Burkina Faso', 'code_drapeau': 'bf'},
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

