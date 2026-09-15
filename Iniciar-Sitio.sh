#!/usr/bin/env bash
# Linux: doble clic (si tu gestor de archivos lo permite) o `./Iniciar-Sitio.sh`
# desde una terminal, dentro de esta carpeta.
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "  DIAMANTE - Selected Meats"
echo "  Iniciando el sitio en modo desarrollo..."
echo "============================================"

if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias por primera vez, un momento..."
  npm install
fi

npm run dev &
DEV_PID=$!
trap 'kill $DEV_PID 2>/dev/null' EXIT

echo "Esperando a que el servidor este listo (puede tardar unos segundos)..."
if command -v curl >/dev/null 2>&1; then
  until [ "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:3000" 2>/dev/null)" = "200" ]; do
    sleep 1
  done
else
  until (exec 3<>/dev/tcp/localhost/3000) 2>/dev/null; do
    sleep 1
  done
  exec 3<&- 2>/dev/null
  exec 3>&- 2>/dev/null
  sleep 5
fi

echo "Listo! Abriendo el navegador..."
xdg-open "http://localhost:3000" 2>/dev/null || open "http://localhost:3000" 2>/dev/null || true

echo "Esta ventana debe quedar abierta mientras uses el sitio. Ciérrala (o Ctrl+C) para detenerlo."
wait $DEV_PID
