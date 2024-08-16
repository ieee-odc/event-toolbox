FROM node:20-alpine
WORKDIR /app/frontend
# EXPOSE 5173

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run","build"]