#!/usr/bin/env bash
# macOS / Linux: `./Iniciar-Docker.sh` desde una terminal en esta carpeta.
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "  DIAMANTE - Selected Meats"
echo "  Iniciando el sitio en Docker..."
echo "============================================"

if ! command -v docker >/dev/null 2>&1; then
  echo "No se encontró Docker. Instálalo: https://docs.docker.com/get-docker/"
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "Docker está instalado pero no está corriendo. Inícialo y vuelve a intentar."
  exit 1
fi

echo "Construyendo e iniciando el contenedor (la primera vez tarda unos minutos)..."
docker compose up -d --build

echo "Esperando a que el sitio esté listo..."
until [ "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:3000" 2>/dev/null)" = "200" ]; do
  sleep 1
done

echo "Listo! Abriendo el navegador..."
open "http://localhost:3000" 2>/dev/null || xdg-open "http://localhost:3000" 2>/dev/null || true
echo "El sitio sigue corriendo en segundo plano. Para detenerlo: docker compose down"
