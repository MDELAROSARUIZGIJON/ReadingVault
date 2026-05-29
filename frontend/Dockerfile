# Cambia esta parte de tu Dockerfile
FROM node:18-alpine

# En lugar de /app, le decimos que trabaje en la raíz del contenedor
WORKDIR /app

# Como tu Dockerfile está DENTRO de /frontend, necesitamos copiar todo 
# lo que hay en /frontend al /app del contenedor
COPY . .

# Ahora sí, instalamos y construimos
RUN npm install
RUN npm run build

# Servimos
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]