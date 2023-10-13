import { Router } from "express"
import usersRouter from './user-router';
import credentialRouter from "./credential-router";

const router = Router()

router.use(usersRouter)
router.use(credentialRouter)

export default router