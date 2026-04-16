FROM node:18

WORKDIR /app

COPY server/package*.json ./

RUN npm install
RUN npm install -g typescript

COPY server ./

RUN tsc

EXPOSE 5000

CMD ["npm", "start"]