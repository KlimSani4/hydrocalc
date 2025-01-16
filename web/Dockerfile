# Production Dockerfile для HydroCalc Web
# Multi-stage build: Node.js для сборки, nginx для раздачи

# Этап 1: Сборка React приложения
FROM node:20-alpine as builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./

# Устанавливаем зависимости
RUN npm ci --silent

# Копируем исходный код
COPY . .

# Аргументы сборки (можно переопределить при docker build)
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Собираем production-версию
RUN npm run build


# Этап 2: Production образ с nginx
FROM nginx:1.25-alpine

# Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Создаем непривилегированного пользователя
RUN adduser -D -H -u 1001 -s /sbin/nologin nginx-user && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# Порт
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/health || exit 1

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
