import { credentialController } from '../controllers/credentials-controller';
import { Router } from 'express';
import { validateBody } from '../middlewares/validation-middleware';
import { credentialSchema } from '../schemas/credentials-schemas';
import { authenticateToken } from '../middlewares/authentication-middleware';

const credentialRouter = Router();

credentialRouter.post('/credentials', authenticateToken, validateBody(credentialSchema), credentialController.createCredential);
credentialRouter.get('/credentials', authenticateToken, credentialController.getCredentials);
credentialRouter.get('/credentials/:id', authenticateToken, credentialController.getCredentialById);
credentialRouter.delete('/credentials/:id', authenticateToken, credentialController.deleteCredential);

export default credentialRouter;