import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb } from '../helpers';

import app, { init } from 'app';

import { generateValidToken } from '../helpers';

beforeAll(async () => {
await init();
await cleanDb();
});

const server = supertest(app);

describe('Credentials', () => {
describe('POST /credentials', () => {
it('should respond with 400 if any of the credential camps are empty', async () => {
const token = await generateValidToken();
const emptyCredential = {
title: '',
url: '',
username: '',
password: '',
};
const response = await server
.post('/credentials')
.set('Authorization', `Bearer ${token}`)
.send(emptyCredential);

expect(response.status).toBe(httpStatus.BAD_REQUEST);
});

it('should respond with 400 if title already exists', async () => {
const token = await generateValidToken();
const credential1 = {
title: 'Titulo',
url: faker.internet.url(),
username: faker.internet.userName(),
password: faker.internet.password(),
};
await server
.post('/credentials')
.set('Authorization', `Bearer ${token}`)
.send(credential1);
const credential2 = {
title: 'Titulo',
url: faker.internet.url(),
username: faker.internet.userName(),
password: faker.internet.password(),
};
const response = await server
.post('/credentials')
.set('Authorization', `Bearer ${token}`)
.send(credential2);

expect(response.status).toBe(httpStatus.BAD_REQUEST);
});

it('should respond with 201 when credential is created', async () => {
const token = await generateValidToken();
const credential = {
title: faker.lorem.word(),
url: faker.internet.url(),
username: faker.internet.userName(),
password: faker.internet.password(),
};
const response = await server
.post('/credentials')
.set('Authorization', `Bearer ${token}`)
.send(credential);

expect(response.status).toBe(httpStatus.CREATED);
});
});
});
