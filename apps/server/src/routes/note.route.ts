import {Hono} from 'hono';
import {authMiddleware} from '../middlewares/authentication';
import {validationMiddleware} from '../middlewares/validation';
import {getNotes, postNote, noteSchema} from '../controllers/note.controller';
import type {AppEnv} from "../types/hono-env.ts";

const noteRouter = new Hono<AppEnv>();

noteRouter.get('/', authMiddleware, ...getNotes);
noteRouter.post('/', authMiddleware, validationMiddleware(noteSchema), ...postNote);

export default noteRouter;
