FROM node:16-alpine

WORKDIR /gpt-tbot

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "start"]
