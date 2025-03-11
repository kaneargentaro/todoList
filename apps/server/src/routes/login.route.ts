import {Hono} from "hono";
import loginController from "../controllers/login.controller";
import {authMiddleware} from "../middlewares/authentication";
import type {JSONSchemaType} from "ajv";
import type {AppEnv} from "../types/hono-env";
import {validationMiddleware} from "../middlewares/validation.ts";

// Define the interface for the login payload
export interface LoginPayload {
    email: string;
    password: string;
}

// JSON Schema for login payload
const loginJsonSchema: JSONSchemaType<LoginPayload> = {
    type: "object",
    properties: {
        email: {type: "string", format: "email"},
        password: {type: "string"},
    },
    required: ["email", "password"],
    additionalProperties: false,
};

const router = new Hono<AppEnv>();

router.get("/", authMiddleware, ...loginController.getLogin);
router.post(
    "/",
    validationMiddleware(loginJsonSchema),
    ...loginController.postLogin
);

export default router;
