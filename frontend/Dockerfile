# =============================
# Etapa 1: Build
# =============================
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Variables dummy para que el build no falle
ENV NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
ENV SUPABASE_SERVICE_ROLE_KEY="placeholder-service-role"

# Compilar el proyecto
RUN npm run build

# =============================
# Etapa 2: Runtime
# =============================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copiar solo lo necesario desde el builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080
CMD ["npm", "start"]
