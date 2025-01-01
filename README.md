# Client
```shell
 yarn start
```

# Server
```shell
deno task dev
```

# Container
```shell
podman build --tag retro:1.0 -f Dockerfile
podman run -p 8080:80 retro:1.0
```