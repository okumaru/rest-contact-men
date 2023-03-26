FROM node:19-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY *.json /usr/app

RUN npm install

EXPOSE 8000

CMD npm run dev