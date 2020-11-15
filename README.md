# Spaced Repetition app backend

Backend consists of Nest server and PostgreSQL database

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dev

# production
$ npm run start
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
