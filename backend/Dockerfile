FROM node:17-alpine
WORKDIR /app/backend
EXPOSE 6001


COPY package.json package-lock.json .

RUN npm install 

COPY . .

RUN npm install -g nodemon

CMD ["npm", "run","dev"]