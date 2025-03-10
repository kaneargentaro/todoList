// src/routes/note.routes.ts
import type Route from "../types/route";
import {compose} from "../middlewares/compose.ts";
import {authMiddleware} from "../middlewares/authentication.ts";
import {validationMiddleware} from "../middlewares/validation.ts";
import {getNotes, postNote, noteSchema} from "../controllers/note.controller.ts";

const noteRoutes: Route[] = [
    {
        method: "GET",
        path: "/notes",
        handler: compose([authMiddleware], getNotes),
    },
    {
        method: "POST",
        path: "/notes",
        handler: compose(
            [authMiddleware, validationMiddleware(noteSchema)],
            postNote
        ),
    },
];

export default noteRoutes;
