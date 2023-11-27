# Alles Labs Interview Assignment

## Project Structure

```sh
-- src
---- core
-------- project api
-------- workflow api
-------- task api
---- main.ts
```

## Task

- [x] Column (workflow) included Name, and Order
- [x] Card (task) included Name, Description, Created At, Archive (status open & closed), Order
- [x] User can create new workflow
- [x] User can modify workflow name
- [x] User can delete workflow if it's empty
- [x] User can add task to workflow with name & description
- [x] User can modify task details
- [x] User can modify task status
- [x] User can reordering workflow and task
- [x] Multiple boards
- [ ] Test codes

## Project Setup

### Step 1

Copy `.env` from `.env.example`

```sh
cp .env.example .env
```

### Step 2

```sh
yarn install
```

## Database Setup

### Step 1

Initialize database with Docker

```sh
docker-compose -f docker-compose-db.dev.yaml up --build
```

### Step 2

Run database migration file

```sh
yarn pg:migration:run
```

## Running Project

### Local

```sh
yarn start:dev
```

### Docker

```sh
docker-compose -f docker-compose.dev.yaml up --build
```

## Build

```sh
yarn build
```
