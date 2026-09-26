@echo off
cd /d "%~dp0"

echo ============================================
echo   DIAMANTE - Selected Meats
echo   Iniciando el sitio en Docker...
echo ============================================

where docker >nul 2>&1
if errorlevel 1 (
  echo No se encontro Docker. Instala Docker Desktop: https://www.docker.com/products/docker-desktop/
  pause
  exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
  echo Docker esta instalado pero no esta corriendo. Abre Docker Desktop y vuelve a intentar.
  pause
  exit /b 1
)

echo Construyendo e iniciando el contenedor (la primera vez tarda unos minutos)...
docker compose up -d --build
if errorlevel 1 (
  echo Hubo un error al iniciar el contenedor.
  pause
  exit /b 1
)

echo Esperando a que el sitio este listo...
:waitloop
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ne 200) { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  timeout /t 1 /nobreak >nul
  goto waitloop
)

echo Listo! Abriendo el navegador...
start "" http://localhost:3000
echo.
echo El sitio sigue corriendo en segundo plano. Para detenerlo: docker compose down
pause
