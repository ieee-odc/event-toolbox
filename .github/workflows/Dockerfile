FROM node:17-alpine
WORKDIR /app
EXPOSE 8000

COPY backend/package.json backend/package-lock.json ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/

RUN npm install

COPY backend ./backend
COPY frontend ./frontend

CMD ["npm", "start"]

