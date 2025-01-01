#FROM docker.io/library/node:22.12.0-alpine3.20 as build-client
#RUN corepack enable
#WORKDIR /usr/retro
#COPY . /usr/retro
#WORKDIR /usr/retro/client
#RUN yarn && yarn build

FROM docker.io/denoland/deno:alpine-2.1.3 as build-server
WORKDIR /usr/retro
COPY . /usr/retro
WORKDIR /usr/retro/server
RUN deno compile --output retro-server main.ts

FROM docker.io/library/nginx:1.27.3-alpine
RUN apk add libc6-compat libstdc++ --no-cache
RUN rm -rf /usr/share/nginx/html/*
COPY /nginx.conf /etc/nginx/nginx.conf
#COPY --from=build-client /usr/retro/client/dist/ngx-retro/browser /usr/share/nginx/html
COPY --from=build-server /usr/retro/server/retro-server /usr/local/bin/retro-server
RUN chmod +x /usr/local/bin/retro-server
RUN ls -l /usr/local/bin
EXPOSE 80 8080
#ENTRYPOINT ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["retro-server"]



#FROM docker.io/library/node:22.12.0-alpine3.20 as build-client
#RUN corepack enable
#WORKDIR /usr/retro
#COPY . /usr/retro
#WORKDIR /usr/retro/client
#RUN yarn && yarn build

#FROM docker.io/library/nginx:1.27.3-alpine-slim
#RUN apk add --no-cache curl
#RUN curl -fsSL https://deno.land/install.sh | sh
#RUN rm -rf /usr/share/nginx/html/*
#COPY /nginx.conf /etc/nginx/nginx.conf
#COPY . /usr/retro
#COPY --from=build-client /usr/retro/client/dist/ngx-retro/browser /usr/share/nginx/html
#EXPOSE 80 8080
#ENTRYPOINT ["nginx", "-g", "daemon off;"]
#ENTRYPOINT ["deno", "task", "start"]