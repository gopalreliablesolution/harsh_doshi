@echo off
echo Adding Mailchimp newsletter script to all pages...

REM Add script before closing body tag in each file
powershell -Command "(Get-Content 'Love Mirage.html') -replace '</body>', '  <script src=\"mailchimp-newsletter.js\"></script>$([Environment]::NewLine)</body>' | Set-Content 'Love Mirage.html'"
powershell -Command "(Get-Content 'products.html') -replace '</body>', '  <script src=\"mailchimp-newsletter.js\"></script>$([Environment]::NewLine)</body>' | Set-Content 'products.html'"
powershell -Command "(Get-Content 'OUR FILMS.html') -replace '</body>', '  <script src=\"mailchimp-newsletter.js\"></script>$([Environment]::NewLine)</body>' | Set-Content 'OUR FILMS.html'"
powershell -Command "(Get-Content 'WORLD OF HARSSH DOSHI.html') -replace '</body>', '  <script src=\"mailchimp-newsletter.js\"></script>$([Environment]::NewLine)</body>' | Set-Content 'WORLD OF HARSSH DOSHI.html'"
powershell -Command "(Get-Content 'New_world_of_harsh_doshi.html') -replace '</body>', '  <script src=\"mailchimp-newsletter.js\"></script>$([Environment]::NewLine)</body>' | Set-Content 'New_world_of_harsh_doshi.html'"
powershell -Command "(Get-Content 'test1.html') -replace '</body>', '  <script src=\"mailchimp-newsletter.js\"></script>$([Environment]::NewLine)</body>' | Set-Content 'test1.html'"

echo Done! Mailchimp newsletter integration added to all pages.
pause
