@echo off
echo ========================================
echo   Démarrage de ngrok
echo ========================================
echo.
echo Assurez-vous que Django tourne sur le port 8000
echo.

REM Modifier le chemin selon votre installation de ngrok
set NGROK_PATH=C:\ngrok\ngrok.exe

if not exist "%NGROK_PATH%" (
    echo ERREUR: ngrok.exe introuvable à %NGROK_PATH%
    echo.
    echo Veuillez modifier le chemin dans ce fichier (.bat)
    echo ou installer ngrok depuis https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

echo Démarrage de ngrok...
echo L'URL publique sera affichée ci-dessous
echo.

"%NGROK_PATH%" http 8000

pause

