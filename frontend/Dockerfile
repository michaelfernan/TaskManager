FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Angular: garantir host aberto
EXPOSE 4200

# O "npm start" do compose vai rodar aqui
CMD ["npm", "start"]
