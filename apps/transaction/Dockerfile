# Usa una imagen de Node.js como base
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json desde la carpeta principal
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el archivo tsconfig.json y el código del microservicio
COPY tsconfig.json ./
COPY ./apps/transaction ./apps/transaction

# Compilar la aplicación NestJS
# RUN npm run build

# Exponer el puerto en el que la aplicación escucha (3000 por defecto en NestJS)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]