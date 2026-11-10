@echo off
rem Publie le site sur enzoletocart.com (double-clic suffit)
cd /d "%~dp0"
echo Publication du site...
git add -A
git commit -q -m "Mise a jour du site"
git push -q origin main
rem Le dossier public/ devient la branche gh-pages (celle qui est en ligne)
for /f %%i in ('git subtree split -q --prefix public') do set SPLIT=%%i
git fetch -q origin gh-pages
for /f %%i in ('git commit-tree %SPLIT%: -p origin/gh-pages -m "Publication du site"') do set PUB=%%i
git push -q origin %PUB%:refs/heads/gh-pages
echo.
echo C'est publie. Le site sera a jour dans 1 a 2 minutes sur https://enzoletocart.com
pause
