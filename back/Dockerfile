# Utiliser une image de base officielle de Node.js
FROM node:22

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "serve"]