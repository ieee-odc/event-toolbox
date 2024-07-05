FROM node:17-alpine
WORKDIR /app
EXPOSE 8000

COPY backend/package.json backend/package-lock.json ./backend
COPY frontend/package.json frontend/package-lock.json ./frontend

RUN cd frontend && npm install
RUN cd backend && npm install


RUN npm install

COPY . .

CMD ["sh", "-c", "cd frontend && npm run dev & cd backend && npm run dev"]

