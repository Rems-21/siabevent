@echo off
echo ========================================
echo   Test Local - SIAB Events Django
echo ========================================
echo.

REM Vérifier si l'environnement virtuel existe
if not exist "venv" (
    echo [1/6] Création de l'environnement virtuel...
    python -m venv venv
    if errorlevel 1 (
        echo ERREUR: Impossible de créer l'environnement virtuel
        pause
        exit /b 1
    )
) else (
    echo [1/6] Environnement virtuel existe déjà
)

echo [2/6] Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo [3/6] Installation des dépendances...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERREUR: Impossible d'installer les dépendances
    pause
    exit /b 1
)

echo [4/6] Vérification du fichier .env...
if not exist ".env" (
    echo Création du fichier .env...
    python create_env.py
)

echo [5/6] Application des migrations...
python manage.py migrate
if errorlevel 1 (
    echo ERREUR: Impossible d'appliquer les migrations
    pause
    exit /b 1
)

echo [6/6] Collecte des fichiers statiques...
python manage.py collectstatic --noinput

echo.
echo ========================================
echo   ✅ Configuration terminée !
echo ========================================
echo.
echo Pour démarrer le serveur, exécutez :
echo   python manage.py runserver
echo.
echo Puis ouvrez votre navigateur sur :
echo   http://127.0.0.1:8000/
echo.
pause

