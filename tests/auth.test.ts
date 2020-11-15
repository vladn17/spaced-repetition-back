import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters/fastify-adapter';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { seedData } from './utils/seedTestData';
import { LOGIN, SIGNUP } from './utils/graphqlOperations';

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

test('sign up works', async () => {
  const data = {
    query: SIGNUP,
    operationName: 'signUp',
    variables: { email: 'newUser@mail.com', password: 'password123' },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send(data);
  expect(response.status).toEqual(200);
  expect(response.body.data).toHaveProperty('signUp', 'success');
});

test('sign up throws error if email already exist', async () => {
  const data = {
    query: SIGNUP,
    operationName: 'signUp',
    variables: { email: 'test@mail.com', password: 'newpassword' },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send(data);
  expect(response.body.errors[0].extensions.code).toEqual('BAD_USER_INPUT');
  expect(response.body.errors[0].message).toEqual('This email already exists');
});

test('auth works', async () => {
  const data = {
    query: LOGIN,
    operationName: 'login',
    variables: { email: 'test@mail.com', password: 'vladuser' },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send(data);
  expect(response.status).toEqual(200);
  expect(response.body.data.login).toBeTruthy();
});

test('login throws error if incorrect email provided', async () => {
  const data = {
    query: LOGIN,
    operationName: 'login',
    variables: { email: 'wrong@mail.com', password: 'vladuser' },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send(data);
  expect(response.body.errors[0].extensions.code).toEqual('BAD_USER_INPUT');
  expect(response.body.errors[0].message).toEqual(
    'Incorrect email or password'
  );
});

test('login throws error if incorrect password provided', async () => {
  const data = {
    query: LOGIN,
    operationName: 'login',
    variables: { email: 'test@mail.com', password: 'incorrect password' },
  };
  const response = await request(app.getHttpServer())
    .post('/graphql')
    .send(data);
  expect(response.body.errors[0].extensions.code).toEqual('BAD_USER_INPUT');
  expect(response.body.errors[0].message).toEqual(
    'Incorrect email or password'
  );
});
