# =============================
# Etapa 1: Build
# =============================
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm ci

RUN npm install sharp
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY tsconfig.json ./

# Copiar el resto del proyecto
COPY . .

# Variables dummy para evitar errores de build
ENV NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
ENV SUPABASE_SERVICE_ROLE_KEY="placeholder-service-role"

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN echo "Building with NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"

# Compilar proyecto (generará .next/standalone y .next/static)
RUN npm run build

# =============================
# Etapa 2: Runtime (ligero)
# =============================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copiar la app ya compilada desde builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 8080

# Comando de arranque (usa el servidor de Next compilado)
CMD ["node", "server.js"]
