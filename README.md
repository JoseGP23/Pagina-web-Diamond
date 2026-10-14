# DIAMANTE — Selected Meats

Landing page premium en una sola página (scrollytelling) para Diamante Selected Meats.

**Sitio en línea:** https://diamante-web.yellowglacier-a4d4342f.brazilsouth.azurecontainerapps.io

## Despliegue en Azure

El sitio corre en **Azure Container Apps** (grupo de recursos `diamante-rg`, región `brazilsouth`) con la imagen Docker que publica GitHub:

1. Cada `git push` a `main` ejecuta el workflow [`.github/workflows/docker-image.yml`](.github/workflows/docker-image.yml). Ese workflow construye la imagen y la publica en `ghcr.io/josegp23/pagina-web-diamond`, con las etiquetas `latest` y el SHA del commit. La imagen se construye en GitHub porque la suscripción Azure for Students no permite construir imágenes dentro de Azure.
2. Después, el mismo workflow actualiza Azure con esa imagen (paso `deploy`). No hace falta hacer nada a mano: en 4 o 6 minutos el sitio en línea ya tiene los cambios. El progreso se ve en la pestaña **Actions** del repo.

   El paso `deploy` inicia sesión en Azure sin contraseñas, con OIDC y la identidad administrada `diamante-github-deployer`. Esa identidad solo tiene permisos sobre el grupo `diamante-rg` y Azure solo la acepta desde la rama `main` de este repo.

Para desplegar a mano una versión concreta (por ejemplo, para volver a una anterior):

```bash
az containerapp update --name diamante-web --resource-group diamante-rg --image ghcr.io/josegp23/pagina-web-diamond:<SHA-del-commit>
```

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
  SmokeParticles.tsx      Sistema de partículas (humo/chispas), 100% CSS
  LenisProvider.tsx       Scroll suave global
  MotionProvider.tsx      Carga diferida de Framer Motion (LazyMotion)
lib/
  images.ts              Mapa centralizado de imágenes (locales y de stock)
  heroFrames.ts          Secuencia de fotogramas del Hero (cantidad y rutas)
  useFrameSequence.ts    Dibuja en un canvas el fotograma que toca según el scroll
  cuts.ts                Cortes del carrusel "Fire Selection" (nombre, foto, video opcional)
  motion.ts               Curvas y variantes de animación compartidas
  useMediaQuery.ts        Hooks de responsive / prefers-reduced-motion
media/
  hero.mp4               Video original del Hero (fuente de los fotogramas, no se publica)
public/
  hero-frames/           Fotogramas del Hero: desktop/ (horizontal) y mobile/ (vertical)
  images/                Fotografías reales de Diamante
  videos/                Videos de los cortes de Fire Selection
```

## Cómo funciona el Hero

El Hero se queda fijo mientras bajas y el scroll mueve la "cámara" del video: plano abierto con el titular, acercamiento a las llamas y cierre con la firma DIAMANTE. No es un `<video>`: son 61 fotogramas WebP que se dibujan en un `<canvas>` según la posición del scroll, mezclando dos fotogramas vecinos para que se vea fluido. Adelantar un video con el scroll se traba en muchos navegadores, sobre todo en iPhone.

- El primer fotograma está en el HTML, así que se ve de inmediato. Los demás se descargan en orden "de grueso a fino": primero el inicial y el final, luego el del medio, y así. El scroll funciona desde los primeros KB.
- En celular se usan fotogramas verticales más livianos (`mobile/`, ~1.9 MB en total; escritorio ~3.1 MB).
- Con movimiento reducido activado, el Hero es una pantalla fija con el primer fotograma y el titular.
- Los tramos de cada capítulo están al inicio de [`components/scenes/Hero.tsx`](components/scenes/Hero.tsx) (`CHAPTER_1`, `CHAPTER_2`, `CHAPTER_3_START`). La altura del recorrido está en la clase `h-[320svh] md:h-[400svh]` de la misma sección.

## Compras por WhatsApp

Todos los botones de compra abren un chat de WhatsApp Business con un mensaje ya escrito:

- **Comprar por WhatsApp** en el Hero y en el botón flotante (abajo a la derecha, visible en todo el sitio).
- **Pedir {corte}** en cada diapositiva de Fire Selection; el mensaje incluye el nombre del corte.
- El enlace de WhatsApp del footer.

El número y los mensajes están en [`lib/whatsapp.ts`](lib/whatsapp.ts): cambia `WHATSAPP_NUMBER` (solo dígitos con código de país, ej. `573001234567`) y `WHATSAPP_DISPLAY` (cómo se muestra en el footer).

## Reemplazar imágenes y videos

Todo el contenido visual se controla desde estos archivos, no hace falta tocar los componentes:

- **Imágenes generales:** agrega el archivo a `public/images/` y actualiza su `url` en [`lib/images.ts`](lib/images.ts) (ej. `url: '/images/mi-foto.jpg'`).
- **Video del Hero:** reemplaza `media/hero.mp4` y regenera los fotogramas con [ffmpeg](https://ffmpeg.org) desde la carpeta del proyecto (borra antes el contenido de `public/hero-frames/desktop` y `public/hero-frames/mobile`):

  ```bash
  ffmpeg -i media/hero.mp4 -vf "fps=12,crop=1764:1040:0:0,eq=contrast=1.08:saturation=1.12:brightness=-0.02,scale=1280:-2:flags=lanczos" -c:v libwebp -quality 62 -compression_level 6 public/hero-frames/desktop/%03d.webp
  ffmpeg -i media/hero.mp4 -vf "fps=12,crop=600:1040:582:0,eq=contrast=1.08:saturation=1.12:brightness=-0.02" -c:v libwebp -quality 52 -compression_level 6 public/hero-frames/mobile/%03d.webp
  ```

  Los valores de `crop` son para un video de 1764×1176: recortan la marca de agua de abajo y, en celular, toman la franja central vertical. Ajústalos si el video nuevo mide distinto. Si cambia la cantidad de fotogramas, actualiza `FRAME_COUNT` en [`lib/heroFrames.ts`](lib/heroFrames.ts).
- **Cortes del carrusel "Fire Selection"** (nombre, descripción, foto y video opcional de cada corte): edita [`lib/cuts.ts`](lib/cuts.ts).

Recomendaciones para videos de fondo: formato `.mp4` (H.264), sin audio o silenciado, idealmente menor a 8-10 MB para que cargue rápido.

## Si las animaciones se sienten lentas en un dispositivo real

- Revisa que los videos de los cortes no pesen demasiado (compresión con HandBrake o similar, apuntando a 720p/1080p y bitrate moderado).
- Si el Hero tarda en suavizarse con conexiones lentas, baja la calidad de los fotogramas (`-quality` en los comandos de ffmpeg de arriba) o usa `fps=10`.
- En `lib/motion.ts`, ajusta las curvas o duraciones; el rango de parallax está dentro de cada escena en `components/scenes/` (`yDesktop` / `yMobile`).
- En `components/SmokeParticles.tsx`, baja el número de partículas (`COUNTS`).
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
