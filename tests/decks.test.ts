import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters/fastify-adapter';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  CREATE_DECK,
  DELETE_DECK,
  GET_DECKS,
  LOGIN,
  UPDATE_DECK,
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

const createDeck = {
  query: CREATE_DECK,
  operationName: 'createDeck',
  variables: { input: { name: 'Newest deck' } },
};

test('returns decks', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const data = {
    query: GET_DECKS,
    operationName: 'getDecks',
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(data);
  expect(response.status).toEqual(200);
  expect(response.body.data.getDecks).toHaveLength(3);
});

test('creates new deck', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(createDeck);
  expect(response.status).toEqual(200);
  expect(response.body.data.createDeck).toHaveProperty('name', 'Newest deck');
  expect(response.body.data.createDeck).toHaveProperty('id');
});

test('updates deck', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const {
    body: {
      data: { createDeck: deck },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(createDeck);
  const updateDeck = {
    query: UPDATE_DECK,
    operationName: 'updateDeck',
    variables: { input: { deckId: deck.id, name: 'Updated deck' } },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(updateDeck);
  expect(response.status).toEqual(200);
  expect(response.body.data.updateDeck).toHaveProperty('name', 'Updated deck');
  expect(response.body.data.updateDeck).toHaveProperty('id', deck.id);
});

test('deletes deck', async () => {
  const {
    body: {
      data: { login },
    },
  } = await request(app.getHttpServer()).post('/graphql').send(authQuery);
  const {
    body: {
      data: { createDeck: deck },
    },
  } = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(createDeck);
  const deleteDeck = {
    query: DELETE_DECK,
    operationName: 'deleteDeck',
    variables: { input: { deckId: deck.id } },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .set('Authorization', `Bearer ${login}`)
    .send(deleteDeck);
  expect(response.status).toEqual(200);
  expect(response.body.data.deleteDeck).toEqual(deck.id);
});
