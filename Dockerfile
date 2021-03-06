FROM node:10-alpine

RUN mkdir -p /var/www/app

WORKDIR /var/www/app

RUN npm install nodemon -g

COPY package.json .
COPY package-lock.json .

RUN npm install --quiet

COPY ./src ./src

COPY nodemon.json .
COPY tsconfig.json .

EXPOSE 3333

RUN npm run build

CMD ["npm", "run", "serve"]