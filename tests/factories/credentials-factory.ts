import { faker } from "@faker-js/faker";
import { Credential } from '@prisma/client';
import { prisma } from 'config/database'

export async function createCredential(userId: number): Promise<Credential> {
  const credentialData = {
    title: faker.lorem.word(),
    url: faker.internet.url(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    userId
  };

  const createdCredential = await prisma.credential.create({
    data: credentialData,
  });

  return createdCredential;
}