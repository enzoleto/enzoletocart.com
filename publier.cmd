@echo off
rem Publie le site sur enzoletocart.com (double-clic suffit)
cd /d "%~dp0"
echo Publication du site...
git add -A
git commit -q -m "Mise a jour du site"
git push -q origin main
git subtree split -q --prefix public -b gh-pages
git push -q origin gh-pages
echo.
echo C'est publie. Le site sera a jour dans 1 a 2 minutes sur https://enzoletocart.com
pause
