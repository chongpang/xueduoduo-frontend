FROM node:6.9.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install
RUN npm install -g bower 
RUN bower install --allow-root
RUN npm run build:prod -s
RUN npm install -g pm2

EXPOSE 8082

