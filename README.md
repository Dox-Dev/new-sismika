# new-sismika

An interactive Earthquake event visualizer utilizing modern web apps.

## Pre-requisites

Latest nodejs.
[pnpm](https://pnpm.io/installation)
[MongoDB](https://www.mongodb.com/try/download/community)
[MongoAtlas](https://www.mongodb.com/atlas/database)
[Mongosh](https://www.mongodb.com/docs/mongodb-shell/install/)
[Docker](https://www.docker.com/products/docker-desktop/)

## Development environment

```bash
pnpm install #install deps
pnpm run dev --open #run build
pnpm run build #build
```

## Environment Keys

```bash
GOOGLE_ID #google id from oauth
GOOGLE_SECRET #google secret from oauth
OAUTH_REDIRECT #oauth redirect from google
MONGODB_URI #uri for mongodb
MONGODB_USER #username for mongodb database
MONGODB_PASS #password for monogdb database
```
