FROM node:18-slim
WORKDIR /app

# Instalar dependencias (incluye dev para ts-node)
COPY package*.json ./
RUN npm install && npm install -g ts-node typescript

# Copiar el código fuente
COPY . .

ENV NODE_ENV=production
EXPOSE 8080

# Ejecutar TS sin compilar usando ts-node via require hook
CMD ["npm", "start"]

