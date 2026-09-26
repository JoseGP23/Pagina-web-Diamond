# Imagen de producción de Diamante — Selected Meats.
# Construir:  docker build -t diamante-web .
# Ejecutar:   docker run -p 3000:3000 diamante-web   ->  http://localhost:3000

# ---- 1) Dependencias ----
FROM node:20-alpine AS deps
# libc6-compat: algunos binarios nativos (p. ej. el compilador SWC de Next) lo necesitan en Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2) Compilación ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Nota: next/font descarga las tipografías de Google Fonts en este paso,
# así que el build necesita conexión a internet (el contenedor final no).
RUN npm run build

# ---- 3) Imagen final (solo lo necesario para servir el sitio) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Usuario sin privilegios: el servidor no corre como root.
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1

CMD ["node", "server.js"]
