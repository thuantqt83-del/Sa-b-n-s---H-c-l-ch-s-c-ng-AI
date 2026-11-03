@echo off
rem Mo app "Hoc Lich su cung AI bang sa ban so" (uu tien Microsoft Edge de co giong ke nu mien Bac du phong)
cd /d "%~dp0"
where msedge >nul 2>nul
if %errorlevel%==0 (
  start "" msedge "%~dp0index.html"
) else (
  start "" "%~dp0index.html"
)
