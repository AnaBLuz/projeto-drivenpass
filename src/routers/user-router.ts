import { Router } from 'express';
import { validateBody } from '../middlewares/validation-middleware';
import { createUserSchema, signInSchema } from '../schemas/users-schemas';
import { singInPost, usersPost } from '../controllers/index';


const usersRouter = Router();

usersRouter.post('/user', validateBody(createUserSchema), usersPost);
usersRouter.post('/sign-in', validateBody(signInSchema), singInPost);

export default usersRouter;
