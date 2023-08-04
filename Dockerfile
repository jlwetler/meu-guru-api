FROM node:18

WORKDIR /usr/src

COPY . .

COPY package*.json ./

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod" ]