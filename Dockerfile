FROM nginx
SHELL ["bash", "-c"]
WORKDIR /usr/share/nginx
COPY public html
