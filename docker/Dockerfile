FROM registry-intl.ap-southeast-1.aliyuncs.com/gigrt-arch/base_nginx:1.0.0
MAINTAINER WhaleCloud-Bright Summit-Team

WORKDIR /

COPY ./dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT nginx -g "daemon off;"
