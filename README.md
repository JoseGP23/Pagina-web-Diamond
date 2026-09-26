# DIAMANTE — Selected Meats

Landing page premium en una sola página (scrollytelling) para Diamante Selected Meats.

**Sitio en línea:** https://diamante-web.yellowglacier-a4d4342f.brazilsouth.azurecontainerapps.io

## Despliegue en Azure

El sitio corre en **Azure Container Apps** (grupo de recursos `diamante-rg`, región `brazilsouth`) con la imagen Docker que publica GitHub:

1. Cada `git push` a `main` ejecuta el workflow [`.github/workflows/docker-image.yml`](.github/workflows/docker-image.yml). Ese workflow construye la imagen y la publica en `ghcr.io/josegp23/pagina-web-diamond`, con las etiquetas `latest` y el SHA del commit. La imagen se construye en GitHub porque la suscripción Azure for Students no permite construir imágenes dentro de Azure.
2. Cuando el workflow termine (se ve en la pestaña **Actions** del repo), actualiza Azure con la nueva imagen:

```bash
az containerapp update --name diamante-web --resource-group diamante-rg --image ghcr.io/josegp23/pagina-web-diamond:<SHA-del-commit>
```

Usa el SHA del commit (`git rev-parse HEAD`) en vez de `latest`: así Azure crea una revisión nueva y descarga la imagen actualizada.

- **Costo:** la app escala a 0 réplicas cuando nadie la visita, por eso consume muy poco crédito. La primera visita después de un rato sin tráfico tarda unos segundos más (arranque en frío). Para evitarlo: `az containerapp update -n diamante-web -g diamante-rg --min-replicas 1`, aunque eso sí consume crédito todo el tiempo.
- **Apagarlo todo** (borra el sitio y sus recursos): `az group delete --name diamante-rg`

## Clonar y ejecutar (cualquier sistema operativo)

Requiere tener [Node.js](https://nodejs.org) 18.18 o superior instalado (`node --version` para revisar).

```bash
git clone <URL-del-repositorio>
cd diamante-selected-meats
npm install
npm run dev
```

Abre `http://localhost:3000` en tu navegador. Los cambios en el código se reflejan solos (hot reload). Para detener el servidor, presiona `Ctrl + C` en la terminal.

## Ejecutar con Docker (sin instalar Node ni dependencias)

El contenedor ya trae todo lo necesario: Node, las dependencias y el sitio compilado en modo producción. Solo necesitas [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows y macOS) o Docker Engine (Linux).

**Atajo de doble clic:** [`Iniciar-Docker.bat`](Iniciar-Docker.bat) en Windows, o `./Iniciar-Docker.sh` en macOS y Linux. Construye la imagen, arranca el contenedor y abre el navegador cuando el sitio ya responde.

**Manual:**

```bash
docker compose up -d --build
```

Abre `http://localhost:3000`. Para detenerlo: `docker compose down`.

Sin Compose:

```bash
docker build -t diamante-web .
docker run -d -p 3000:3000 --name diamante-web diamante-web
```

- La primera construcción tarda unos minutos y necesita internet, porque descarga dependencias y tipografías. Después, el contenedor funciona sin conexión, salvo las imágenes de stock de Unsplash y Picsum.
- Para usar otro puerto, por ejemplo el 8080: `docker run -p 8080:3000 diamante-web`.
- Si cambias el código, fotos o videos, vuelve a ejecutar `docker compose up -d --build` para regenerar la imagen.
- Para desplegar en un servidor (VPS, Render, Railway, Fly.io, etc.), usa el mismo `Dockerfile`: la imagen escucha en el puerto `3000` (se puede cambiar con la variable `PORT`).

## Cómo ejecutarlo (atajos de doble clic)

Instalan las dependencias la primera vez (si hace falta), esperan a que el servidor esté realmente listo y **recién entonces** abren el navegador — así se evita ver una página en blanco por abrir demasiado pronto.

| Sistema | Archivo |
|---|---|
| Windows | [`Iniciar-Sitio.bat`](Iniciar-Sitio.bat) — doble clic |
| macOS | [`Iniciar-Sitio.command`](Iniciar-Sitio.command) — doble clic. La primera vez macOS puede bloquearlo ("desarrollador no identificado"): clic derecho → **Abrir** → **Abrir**, una sola vez. |
| Linux | [`Iniciar-Sitio.sh`](Iniciar-Sitio.sh) — doble clic si tu gestor de archivos lo permite, o `./Iniciar-Sitio.sh` desde una terminal en esta carpeta |

Todos dejan una ventana de terminal abierta con el servidor corriendo — ciérrala (o `Ctrl+C`) para detener el sitio.

**Desde VS Code (cualquier sistema, recomendado si vas a editar):**
1. Abre esta carpeta en VS Code (`Archivo → Abrir carpeta...`).
2. Abre una terminal integrada (`` Ctrl + ` `` o `Terminal → Nueva terminal`).
3. La primera vez, instala dependencias: `npm install`
4. Arranca el sitio: `npm run dev`
5. Abre `http://localhost:3000` en tu navegador.

> Nota técnica: el sitio es una app Next.js/React (no un archivo `.html` suelto) porque usa animaciones avanzadas (Framer Motion, GSAP, scroll suave con Lenis) que requieren un proceso de compilación. Por eso se ejecuta con `npm run dev` en lugar de abrirse con doble clic directamente — pero una vez corriendo, se ve y se comporta exactamente igual que cualquier página web en el navegador.

## Estructura del proyecto

```
app/                     Páginas y layout raíz de Next.js
components/
  scenes/                Una escena por sección de la página (Hero, Historia, Fire Selection, ...)
  Icons.tsx, Logo.tsx     Iconos e isotipo en SVG
  IconFeatureRow.tsx      Fila de iconos reutilizable
  SmokeParticles.tsx      Sistema de partículas (humo/chispas)
  LenisProvider.tsx       Scroll suave global
lib/
  images.ts              Mapa centralizado de imágenes (locales y de stock)
  videos.ts              Video de fondo del Hero
  cuts.ts                Cortes del carrusel "Fire Selection" (nombre, foto, video opcional)
  motion.ts               Constantes y helpers de animación (Framer Motion)
  useMediaQuery.ts        Hooks de responsive / prefers-reduced-motion
public/
  images/                Fotografías reales de Diamante
  videos/                Videos reales de Diamante (Hero y cortes de Fire Selection)
```

## Reemplazar imágenes y videos

Todo el contenido visual se controla desde estos archivos, no hace falta tocar los componentes:

- **Imágenes generales:** agrega el archivo a `public/images/` y actualiza su `url` en [`lib/images.ts`](lib/images.ts) (ej. `url: '/images/mi-foto.jpg'`).
- **Video del Hero:** agrega el archivo a `public/videos/` y actualiza su `src` en [`lib/videos.ts`](lib/videos.ts).
- **Cortes del carrusel "Fire Selection"** (nombre, descripción, foto y video opcional de cada corte): edita [`lib/cuts.ts`](lib/cuts.ts).

Recomendaciones para videos de fondo: formato `.mp4` (H.264), sin audio o silenciado, idealmente menor a 8-10 MB para que cargue rápido.

## Si las animaciones se sienten lentas en un dispositivo real

- Revisa que el video no pese demasiado (compresión con HandBrake o similar, apuntando a 720p/1080p y bitrate moderado).
- En `lib/motion.ts`, reduce `CINEMATIC_EASE`/duraciones o el rango de parallax en cada escena (`parallaxRange` dentro de cada archivo en `components/scenes/`).
- En `components/SmokeParticles.tsx`, baja el número de partículas (`intensity`).
- Confirma que `prefers-reduced-motion` esté simplificando correctamente la escena afectada (ya está implementado en todas).
- El sitio ya reduce automáticamente la complejidad en pantallas ≤768px (`useIsMobile`) — si sigue lento en un celular real, considera bajar aún más esos umbrales.

## Auditoría de performance (Lighthouse)

Con el sitio corriendo en `http://localhost:3000`:

```
npm run build && npm run start
```

y en otra terminal:

```
npx lighthouse http://localhost:3000 --view
```

(o usa las DevTools de Chrome → pestaña "Lighthouse" → Analyze page load, apuntando siempre a la build de producción, no a `next dev`).
