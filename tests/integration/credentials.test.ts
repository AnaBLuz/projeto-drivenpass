import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import { createUser } from '../factories/users-factory';
import supertest from 'supertest';
import { cleanDb } from '../helpers';
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

it('should respond with 201 when credential is created', async () => {
    const user = await createUser();
    const validToken = await generateValidToken(user);

    const credential = generateValidCredential();

    const response = await server.post('/credentials').set('Authorization', `Bearer ${validToken}`).send(credential);
    expect(response.status).toEqual(httpStatus.CREATED);
});

});

describe('GET /credentials', () => {

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/credentials');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 if can get user credentials', async () => {
        const user = await createUser();
        const userId = user.id;
        const validToken = await generateValidToken(user);
    
        const credential = await createCredential(userId);
        const response = await server.get('/credentials').set('Authorization', `Bearer ${validToken}`);


        expect(response.status).toBe(httpStatus.OK);
    });

});

describe('GET /credential/:id', () => {

    it('should responde with status 200 when getting credential sucessfully', async () => {
        const user = await createUser();
        const userId = user.id;
        const validToken = await generateValidToken(user);
        const credential = await createCredential(userId);

        const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(httpStatus.OK);
    });

    it('should respond with status 401 when user does not own the credential', async () => {
        const user = await createUser();
        const validToken = await generateValidToken(user);
        const invalidIdcredential = "2";

        const response = await server.get(`/credentials/${invalidIdcredential}`).set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
});

describe('DELETE /credentials/:id', () => {

    it('should responde with status 204 when deleting credential sucessfully', async () => {
        const user = await createUser();
        const userId = user.id;
        const validToken = await generateValidToken(user);
    
        const credential = await createCredential(userId);

        const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(httpStatus.NO_CONTENT);
    });

    it('should respond with status 401 when user does not own the credential', async () => {
        const user = await createUser();
        const validToken = await generateValidToken(user);
        const invalidIdcredential = "2";

        const response = await server.delete(`/credentials/${invalidIdcredential}`).set('Authorization', `Bearer ${validToken}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
});

});
