import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import { createUser } from '../factories/users-factory';
import supertest from 'supertest';
import { cleanDb } from '../helpers';
import { prisma } from 'config/database'
import app, { init } from 'app';

import { generateValidToken } from '../helpers';
import { createCredential } from '../factories/credentials-factory';

beforeAll(async () => {
await init();
await cleanDb();
});

const server = supertest(app);

describe('Credentials', () => {
describe('POST /credentials', () => {
    const generateValidCredential = () => ({
        title: faker.lorem.word(),
        url: faker.internet.url(),
        username: faker.internet.email(),
        password: faker.internet.password()
      });
    
it('should respond with 400 if any of the credential camps are empty', async () => {
    const validToken = await generateValidToken();
    const credentialEmpty = {
        title:'',
        url:'',
        username:'',
        password:''
    }
    const response = await server.post('/credentials').set('Authorization', `Bearer ${validToken}`).send(credentialEmpty);
    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
}
);
it('should respond with 400 if title already exists', async () => {
    const user = await createUser();
    const userId = user.id;
    const validToken = await generateValidToken(user);
    
    const credential = await createCredential(userId);

    const response = await server.post('/credentials').set('Authorization', `Bearer ${validToken}`).send(credential);
    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
})


});
});
