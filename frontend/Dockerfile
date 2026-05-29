FROM node:18-alpine

# Definimos el directorio de trabajo donde está tu código
WORKDIR /app

# Copiamos solo el package.json de la carpeta frontend a la raíz del contenedor
COPY frontend/package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos todo lo demás de la carpeta frontend
COPY frontend/ .

# Construimos
RUN npm run build

# Instalamos serve y exponemos
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]