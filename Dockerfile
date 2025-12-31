# Stage 1: Build
FROM node:22-alpine AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build ứng dụng
COPY . .
RUN npm run build

# Stage 2: Serve với nginx
FROM nginx:stable-alpine

# Copy file cấu hình nginx tùy chọn (nếu có)
# COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Xóa nội dung mặc định của nginx và copy bản build từ stage 1
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
