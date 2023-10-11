import { Router } from 'express';
import { validateBody } from '../middlewares/validation-middleware';
import { createUserSchema } from '../schemas/users-schemas';
import { usersPost } from '../controllers/index';


const usersRouter = Router();

usersRouter.post('/user', validateBody(createUserSchema), usersPost);

export default usersRouter;
