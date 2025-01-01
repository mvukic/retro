# Client
```shell
 yarn start
```

# Server
```shell
deno task start
```

# Container - WIP
```shell
podman build --tag retro:1.0 -f Dockerfile
podman run -p 8080:80 retro:1.0
```

# Features:
- [x] Login - user is remembered in the browser using local storage
- [x] Rename user
- [x] Add board
- [x] Delete board
- [x] Rename board
- [x] Add board item
- [x] Delete board item
- [x] Rename board item
- [x] Vote board item - each user has one vote per board item
- [x] Export board in multiple formats: JSON, CSV, text
- [ ] Dynamically set the number of votes per user
- [ ] Save boards into database and not in memory