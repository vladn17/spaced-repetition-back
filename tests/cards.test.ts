import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters/fastify-adapter';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  CREATE_CARD,
  DELETE_CARD,
  EDIT_CARD,
  GET_CARDS,
  GET_DECKS,
  LOGIN,
  SCHEDULE_CARD,
} from './utils/graphqlOperations';
import { seedData } from './utils/seedTestData';

let app: INestApplication;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication(new FastifyAdapter());
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  await seedData();
});

afterEach(async () => {
  await app.close();
});

const authQuery = {
  query: LOGIN,
  operationName: 'login',
  variables: { email: 'test@mail.com', password: 'vladuser' },
};

const decksQuery = {
  query: GET_DECKS,
  operationName: 'getDecks',
};

test('returns cards', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const {
    body: {
      data: { getDecks },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(decksQuery);
  const data = {
    query: GET_CARDS,
    operationName: 'getCards',
    variables: { input: { deckId: getDecks[0].id } },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(data);
  expect(response.status).toEqual(200);
  expect(response.body.data.getCards).toHaveLength(3);
  expect(response.body.data.getCards[0]).toHaveProperty('id');
  expect(response.body.data.getCards[0]).toHaveProperty('date');
  expect(response.body.data.getCards[0]).toHaveProperty('interval');
});

test('throws error if incorrect deckId provided', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const data = {
    query: GET_CARDS,
    operationName: 'getCards',
    variables: { input: { deckId: '9999' } },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(data);
  expect(response.body.errors[0].extensions.code).toEqual('BAD_USER_INPUT');
  expect(response.body.errors[0].message).toEqual('Incorrect input');
});

test('creates new card', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const {
    body: {
      data: { getDecks },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(decksQuery);
  const createCard = {
    query: CREATE_CARD,
    operationName: 'createCard',
    variables: {
      input: {
        question: 'new word',
        answer: 'translation',
        date: String(Date.now()),
        deckId: getDecks[0].id,
      },
    },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(createCard);
  expect(response.status).toEqual(200);
  expect(response.body.data.createCard).toHaveProperty('question', 'new word');
  expect(response.body.data.createCard).toHaveProperty('id');
  expect(response.body.data.createCard).toHaveProperty('repetition', 1);
  expect(response.body.data.createCard).toHaveProperty('interval', '0');
  expect(response.body.data.createCard).toHaveProperty('factor', 2.5);
});

test('edites card', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const {
    body: {
      data: { getDecks },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(decksQuery);
  const createCard = {
    query: CREATE_CARD,
    operationName: 'createCard',
    variables: {
      input: {
        question: 'new word',
        answer: 'translation',
        date: String(Date.now()),
        deckId: getDecks[0].id,
      },
    },
  };
  const {
    body: {
      data: { createCard: cardId },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(createCard);
  const editedCard = {
    id: cardId.id,
    question: 'updated question',
    answer: 'new answer',
  };
  const editCard = {
    variables: { input: editedCard },
    query: EDIT_CARD,
    operationName: 'editCard',
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(editCard);
  expect(response.status).toEqual(200);
  expect(response.body.data.editCard).toMatchObject(editedCard);
});

test('deletes card', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const {
    body: {
      data: { getDecks },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(decksQuery);
  const createCard = {
    query: CREATE_CARD,
    operationName: 'createCard',
    variables: {
      input: {
        question: 'new word',
        answer: 'translation',
        date: String(Date.now()),
        deckId: getDecks[0].id,
      },
    },
  };
  const {
    body: {
      data: { createCard: card },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(createCard);
  const deleteCard = {
    query: DELETE_CARD,
    operationName: 'deleteCard',
    variables: { input: { id: card.id } },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(deleteCard);
  expect(response.status).toEqual(200);
  expect(response.body.data.deleteCard).toEqual(card.id);
});

test('schedules card', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const {
    body: {
      data: { getDecks },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(decksQuery);
  const createCard = {
    query: CREATE_CARD,
    operationName: 'createCard',
    variables: {
      input: {
        question: 'new word',
        answer: 'translation',
        date: String(Date.now()),
        deckId: getDecks[0].id,
      },
    },
  };
  const {
    body: {
      data: { createCard: cardId },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(createCard);

  const input = {
    id: cardId.id,
    date: String(Date.now()),
    repetition: 4,
    interval: String(Date.now()),
    factor: 1.8,
  };

  const scheduleCard = {
    query: SCHEDULE_CARD,
    variables: { input: input },
    operationName: 'scheduleCard',
  };

  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(scheduleCard);
  expect(response.status).toEqual(200);
  expect(response.body.data.scheduleCard).toMatchObject(input);
});
