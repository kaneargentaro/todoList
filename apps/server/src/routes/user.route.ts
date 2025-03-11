import {Hono} from 'hono';
import {authMiddleware} from '../middlewares/authentication';
import {getUser} from '../controllers/user.controller';
import type {AppEnv} from "../types/hono-env.ts";

const userRouter = new Hono<AppEnv>();

userRouter.get('/', authMiddleware, ...getUser);

export default userRouter;
