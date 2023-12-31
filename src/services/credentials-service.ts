import Cryptr from 'cryptr';
import { credentialRepository } from '../repositories/index';
import {  CreateCredential } from 'protocols';
import { notFoundError, unauthorizedError, validationError } from '../errors/index';

const cryptr = new Cryptr(process.env.CRYPTO_SECRET);

async function createCredential(credential: CreateCredential) {
  const { title, url, username, password, userId } = credential;
  
  
  if (!title || !url || !username || !password || !userId) {
    throw validationError();
  }
  const credentialAlreadyExists = await credentialRepository.findByTitle(title, Number(userId));
  if (credentialAlreadyExists) throw validationError();
  const encryptedPassword = cryptr.encrypt(password);
  const newCredential = await credentialRepository.create({
    title,
    url,
    username,
    password: encryptedPassword,
    userId,
  });
  return newCredential;
}

async function getCredentials(userId: number) {
  if (!userId) {
    throw unauthorizedError();
  }
  const credentials = await credentialRepository.findAll(userId);
  
  if (!credentials || credentials.length === 0) throw notFoundError();
  
  const credentialsWithDecryptedPassword = credentials.map((credential) => {
		const { password } = credential;
		const decryptedPassword = cryptr.decrypt(password);
		return { ...credential, password: decryptedPassword };
	});
  return credentialsWithDecryptedPassword;
}

async function getCredentialById(id: number, userId: number) {
  if (!userId) throw unauthorizedError();
  
  const credential = await credentialRepository.findById(id, userId);
  if (!credential) throw unauthorizedError();
  
  const { password } = credential;
  const decryptedPassword = cryptr.decrypt(password);
  const newCredential = { ...credential, password: decryptedPassword };
  return newCredential;
}

async function deleteCredential(id: number, userId: number) {
  if (!userId) throw unauthorizedError();

  const credential = await credentialRepository.findById(id, userId);
  if (!credential) throw unauthorizedError();
  
  if (credential.userId !== userId) throw unauthorizedError();
  
  await credentialRepository.deleteCredential(id);
  return credential;
}

export const credentialService = {
  createCredential,
  getCredentials,
  getCredentialById,
  deleteCredential,
};