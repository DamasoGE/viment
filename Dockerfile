#Imagen de partida
FROM node:latest

WORKDIR /app
# Instalar dependencias
COPY package*.json ./
RUN npm install
COPY . .
# Exponer el puerto
EXPOSE 5173
# Comando de inicio
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]