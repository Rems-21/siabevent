#!/usr/bin/env python
"""
Script pour créer le fichier .env à partir du modèle .env.example
"""
import secrets
import os

def generate_secret_key():
    """Génère une SECRET_KEY Django sécurisée"""
    return secrets.token_urlsafe(50)

def create_env_file():
    """Crée le fichier .env avec une SECRET_KEY générée"""
    
    # Vérifier si .env existe déjà
    if os.path.exists('.env'):
        response = input("Le fichier .env existe déjà. Voulez-vous le remplacer ? (o/n): ")
        if response.lower() != 'o':
            print("Opération annulée.")
            return
    
    # Lire le modèle .env.example
    if not os.path.exists('.env.example'):
        print("Erreur: Le fichier .env.example n'existe pas.")
        return
    
    with open('.env.example', 'r', encoding='utf-8') as f:
        template = f.read()
    
    # Générer une nouvelle SECRET_KEY
    secret_key = generate_secret_key()
    
    # Remplacer la SECRET_KEY dans le template
    env_content = template.replace(
        'SECRET_KEY=votre_secret_key_unique_et_longue_générée_avec_secrets_token_urlsafe',
        f'SECRET_KEY={secret_key}'
    )
    
    # Écrire le fichier .env
    with open('.env', 'w', encoding='utf-8') as f:
        f.write(env_content)
    
    print("✅ Fichier .env créé avec succès !")
    print(f"📝 SECRET_KEY générée: {secret_key[:20]}...")
    print("\n⚠️  Important:")
    print("   - Le fichier .env est dans .gitignore et ne sera pas commité")
    print("   - Personnalisez les autres variables selon vos besoins")
    print("   - En production, utilisez des valeurs sécurisées")

if __name__ == '__main__':
    create_env_file()

