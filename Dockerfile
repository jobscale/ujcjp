FROM nginx
SHELL ["bash", "-c"]
WORKDIR /usr/share/nginx
RUN apt-get update && apt-get install -y openssl
COPY . .
RUN rm -fr html \
 && ln -sfn public html \
 && cp default.conf /etc/nginx/conf.d \
 && . ssl-keygen \
 && openssl dhparam 2048 > tls/dhparam.pem
EXPOSE 443 80
