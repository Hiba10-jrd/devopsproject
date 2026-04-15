FROM node:18

WORKDIR /app

# Copier package.json
COPY package*.json ./

RUN npm install

# Copier tout le code backend
COPY . .

# build TypeScript (si tu utilises tsc)
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]