import {withValidation} from "../../middlewares/validate.ts";
import type {JTDDataType} from "ajv/dist/types/jtd-schema";

// Define the schema for login payloads.
const loginSchema = {
    properties: {
        username: {type: "string", format: "email"},
        password: {type: "string"}
    }
} as const;

// Define the TypeScript type for the validated payload.
// type LoginPayload = {
//     username: string;
//     password: string;
// };

type LoginPayload = JTDDataType<typeof loginSchema>;

async function getLogin(req: Request): Promise<Response> {
    // For example purposes, we throw an error to indicate that GET is not supported.
    throw new Error("LOGIN_0001: GET not supported");
}

// Wrap your login logic with the validation middleware.
const postLogin = withValidation<LoginPayload>(
    loginSchema,
    async (payload, req) => {
        // Your business logic here. For instance, authenticate the user.
        // In this example, we simply return a success message.
        return new Response(
            JSON.stringify({message: "Login successful", username: payload.username}),
            {headers: {"Content-Type": "application/json"}}
        );
    }
);

export default {getLogin, postLogin};