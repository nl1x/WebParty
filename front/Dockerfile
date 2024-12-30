# Étape 1 : Construire les fichiers statiques
FROM node:22-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Servir avec NGINX
FROM nginx:stable-alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Exposer le port de NGINX
EXPOSE 80

# Lancer NGINX
CMD ["nginx", "-g", "daemon off;"]
