# Sismika

## Initialization

This project uses pnpm.
```bash
npm install -g pnpm
```
Install [Docker](https://docs.docker.com/desktop/install/windows-install/)
Build docker.
```
docker build -t new-sismika .
```
Run docker.
```
docker run -p 3000:3000 new-sismika
```