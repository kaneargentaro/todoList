import type Route from '../types/route';
import loginController from "../controllers/login.controller";

const loginRoutes: Route[] = [
    {
        method: "GET",
        path: "/login",
        handler: loginController.getLogin,
    },
    {
        method: "POST",
        path: "/login",
        handler: loginController.postLogin,
    },
];

export default loginRoutes;