// src/routes/login.routes.ts
import type Route from "../types/route";
import * as loginController from "../controllers/login.controller.ts";
import {compose} from "../middlewares/compose.ts";
import {authMiddleware} from "../middlewares/authentication.ts";
import {validationMiddleware} from "../middlewares/validation.ts";
import type {JSONSchemaType} from "ajv";
import type {LoginPayload} from "../controllers/login.controller.ts";

// Define the JSON schema for the payload using JSON Schema syntax.
const loginJsonSchema: JSONSchemaType<LoginPayload> = {
    type: "object",
    properties: {
        email: {type: "string", format: "email"},
        password: {type: "string"},
    },
    required: ["email", "password"],
    additionalProperties: false,
};

// Compose the GET /login route: chain the auth middleware first.
const getLoginHandler = compose([authMiddleware], loginController.getLogin);

// Compose the POST /login route: chain the validation middleware.
const postLoginHandler = compose(
    [validationMiddleware(loginJsonSchema)],
    loginController.postLogin
);

const loginRoutes: Route[] = [
    {
        method: "GET",
        path: "/login",
        handler: getLoginHandler,
    },
    {
        method: "POST",
        path: "/login",
        handler: postLoginHandler,
    },
];

export default loginRoutes;
