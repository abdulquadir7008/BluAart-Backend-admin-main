FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7082

CMD ["node", "src/Serverlogs.js"]