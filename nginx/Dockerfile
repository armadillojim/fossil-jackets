FROM nginx:1.13-alpine

ARG API_PORT
ARG CLIENT_PORT
ARG DOMAIN

COPY nginx.conf /etc/nginx/
RUN sed -i "s/\${API_PORT}/$API_PORT/;s/\${CLIENT_PORT}/$CLIENT_PORT/;s/\${DOMAIN}/$DOMAIN/" /etc/nginx/nginx.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log
