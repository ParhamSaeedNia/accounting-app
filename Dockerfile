FROM node:24 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24 AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "run", "start:prod"]
