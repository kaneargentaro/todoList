import {withValidation} from "../middlewares/validate.ts";
import type {JTDDataType} from "ajv/dist/types/jtd-schema";
import prisma from "../utils/prisma";

// Define the schema for login payloads.
const loginSchema = {
    properties: {
        email: {type: "string", format: "email"},
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

        const {email, password} = payload;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
                password: password
            }
        });

        if (!user) {
            return new Response(JSON.stringify({
                    message: "Unauthorized",
                }), {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        }

        // TODO: create JWT

        return new Response(
            JSON.stringify({
                message: "Login successful",
            }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
);

export default {getLogin, postLogin};