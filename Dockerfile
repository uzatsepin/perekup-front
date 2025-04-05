# Этап сборки
FROM node:22-alpine AS build

# Установка зависимостей
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Копирование и сборка приложения
COPY . .
RUN npm run build

# Этап продакшена
FROM nginx:stable-alpine AS production

# Копирование собранных файлов
COPY --from=build /app/dist /usr/share/nginx/html

# Копирование конфигурации Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Открытие порта
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
