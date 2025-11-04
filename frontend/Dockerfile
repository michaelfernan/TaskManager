FROM node:20-alpine

# 1) diretório de trabalho
WORKDIR /app

# 2) copiar arquivos de dependência
COPY package*.json ./

# 3) corrigir dependências legadas e instalar
#    (remove o pacote antigo e instala tudo de novo com cache)
RUN npm remove apollo-angular-link-http --force || true \
 && npm ci --legacy-peer-deps

# 4) copiar o restante do código (necessário pro ng serve)
COPY . .

# 5) expor porta usada pelo Angular CLI
EXPOSE 4200

# 6) comando padrão: servir aplicação dev acessível de fora do container
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]
