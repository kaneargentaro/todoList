import prisma from "@db";
import {JWT_SECRET} from "../constants/auth";
import type {Context} from "hono";
import {HTTPException} from "hono/http-exception";
import {sign} from "hono/jwt";
import {createFactory} from "hono/factory";
import type {AppEnv} from '../types/hono-env.ts';

// Using Hono's factory for handler creation keeps consistency across controllers.
const factory = createFactory<AppEnv>();

// Define the LoginPayload type using your JSON schema shape.
export interface LoginPayload {
    email: string;
    password: string;
}

const getLogin = factory.createHandlers(
    async (c: Context<AppEnv>) => {
        // Retrieve the authenticated user's data from the context.
        const {email} = c.get("auth") || {};
        if (!email) {
            throw new HTTPException(401, {message: "Not authenticated"});
        }

        return c.json({message: `${email} is logged in`});
    }
);

const postLogin = factory.createHandlers(
    async (c: Context<AppEnv>) => {
        // Parse and validate JSON payload (assuming validation middleware or inline validation)
        const {email, password} = await c.req.json<LoginPayload>();

        // Find the user by email and password.
        const user = await prisma.user.findUnique({
            where: {email, password},
        });

        if (!user) {
            throw new HTTPException(401, {message: "Unauthorized"});
        }

        // Sign a JWT token with user details.
        const token = await sign(
            {userId: user.id, email: user.email},
            JWT_SECRET
        );

        return c.json({message: "Login successful", token});
    }
);

export default {getLogin, postLogin};
