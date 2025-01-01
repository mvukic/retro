FROM docker.io/library/node:22.12.0-alpine3.20 as build-client
RUN corepack enable
WORKDIR /usr/retro
COPY . /usr/retro
WORKDIR /usr/retro/client
RUN yarn && yarn build

FROM docker.io/denoland/deno:alpine-2.1.3 as build-server
WORKDIR /usr/retro
COPY . /usr/retro
WORKDIR /usr/retro/server
RUN deno compile --allow-net main.ts

FROM docker.io/library/nginx:1.27.3-alpine-slim
RUN rm -rf /usr/share/nginx/html/*
COPY /nginx.conf /etc/nginx/nginx.conf
COPY --from=build-client /usr/retro/client/dist/ngx-retro /usr/share/nginx/html
COPY --from=build-server /usr/retro/server/server /usr/local/bin/retro-server
EXPOSE 80 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]