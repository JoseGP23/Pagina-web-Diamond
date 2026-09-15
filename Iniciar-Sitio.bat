@echo off
cd /d "%~dp0"

echo ============================================
echo   DIAMANTE - Selected Meats
echo   Iniciando el sitio en modo desarrollo...
echo ============================================

if not exist "node_modules" (
  echo Instalando dependencias por primera vez, un momento...
  call npm install
)

echo Abriendo el servidor en una ventana aparte...
start "Diamante - servidor (no cerrar)" cmd /k npm run dev

echo Esperando a que el servidor este listo (puede tardar unos segundos)...
:waitloop
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ne 200) { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  timeout /t 1 /nobreak >nul
  goto waitloop
)

echo Listo! Abriendo el navegador...
start "" http://localhost:3000
