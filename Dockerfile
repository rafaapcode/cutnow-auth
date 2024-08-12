FROM node:latest

WORKDIR /usr/src/app

COPY . .

ENV PORT=8080

RUN npm install

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]