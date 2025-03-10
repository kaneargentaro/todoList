// src/routes/user.routes.ts
import type Route from '../types/route';
import {compose} from '../middlewares/compose.ts';
import {authMiddleware} from "../middlewares/authentication.ts";
import {getUser} from '../controllers/user.controller.ts';

const userRoutes: Route[] = [
    {
        method: "GET",
        path: "/user",
        handler: compose([authMiddleware], getUser),
    },
];

export default userRoutes;
