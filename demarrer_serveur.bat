@echo off
echo ========================================
echo   Démarrage du serveur Django
echo ========================================
echo.

REM Activer l'environnement virtuel
call venv\Scripts\activate.bat

echo Démarrage du serveur Django...
echo.
echo Le serveur sera accessible sur : http://127.0.0.1:8000/
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

python manage.py runserver

pause

