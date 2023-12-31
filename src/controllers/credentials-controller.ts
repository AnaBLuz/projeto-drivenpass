import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from 'middlewares/authentication-middleware';
import { credentialService } from '../services/credentials-service';

async function createCredential(req: AuthenticatedRequest, res: Response) {
  
  const { userId } = req;

  const credential = await credentialService.createCredential({
    ...req.body,
    userId,
  });

  return res.status(httpStatus.CREATED).send(credential);
}


async function getCredentials(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const credentials = await credentialService.getCredentials(userId);
  
  return res.status(httpStatus.OK).send(credentials);
}

async function getCredentialById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { userId } = req;
  const credential = await credentialService.getCredentialById(Number(id), userId);
  return res.status(httpStatus.OK).send(credential);
}

async function deleteCredential(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { userId } = req;
  await credentialService.deleteCredential(Number(id), Number(userId));
  return res.sendStatus(httpStatus.NO_CONTENT);
}

export const credentialController = {
  createCredential,
  getCredentials,
  getCredentialById,
  deleteCredential,
};