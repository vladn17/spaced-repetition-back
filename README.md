# Spaced Repetition app backend

Backend consists of Nest server and PostgreSQL database  
- [Frontend source code](https://github.com/vladn17/spaced-repetition-front)  
- [Deployed demo project](https://spacedrepeat.surge.sh/)  

## Installation

```bash
$ npm install
```

## Database setup

```bash
# Start postgres database
$ npm run db:up

# Stop
$ npm run db:stop

# Remove
$ npm run db:remove
```

## Running the app

```bash
# development
$ npm run start:dev

# production
$ npm run start:prod
```



## Test

```bash
# tests
$ npm run test

# test coverage
$ npm run test:cov
```

### Enviroment variables

| .env                | Description                 |
| :------------------ | :-------------------------- |
| `PORT`              | Port server is listening on |
| `SECRET_KEY`        | Key for token encryption    |
| `DATABASE_URL`      | Database url                |
| `TEST_DATABASE_URL` | Database url for tests      |
