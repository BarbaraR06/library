# Etapa 1: build
FROM node:18-alpine AS builder

# Crea el directorio de la app
WORKDIR /app

# Copia package.json y lockfile
COPY package*.json ./
COPY prisma ./prisma
# Si usás pnpm:
# COPY pnpm-lock.yaml ./
# RUN npm install -g pnpm

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Genera el cliente de Prisma (necesario para build y runtime)
RUN npx prisma generate

# Construye el proyecto
RUN npm run build

# Etapa 2: run (contenedor liviano solo para correr)
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiamos solo lo necesario del builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma

# Exponemos el puerto
EXPOSE 3000

# Comando para correr la app
CMD ["npm", "start"]
