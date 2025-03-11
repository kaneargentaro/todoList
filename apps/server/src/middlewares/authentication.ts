import {JWT_SECRET} from "../constants/auth";
import type {Context, MiddlewareHandler} from "hono";
import {verify} from "hono/jwt";
import {createFactory} from "hono/factory";
import type {AppEnv} from "../types/hono-env.ts";

const factory = createFactory<AppEnv>();

// Define the shape of the decoded JWT payload.
export interface JwtPayload {
    userId: string;
    email: string;
}

export const authMiddleware: MiddlewareHandler<AppEnv> = factory.createMiddleware(
    async (c: Context<AppEnv>, next) => {
        const authHeader = c.req.header("Authorization");
        if (!authHeader) {
            return c.json({error: "Missing Authorization header"}, 401);
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return c.json({error: "Invalid Authorization header format"}, 401);
        }

        const token = parts[1];

        try {
            // Verify and attach the decoded token to the context.
            const payload = await verify(token, JWT_SECRET) as unknown as JwtPayload;
            c.set("auth", payload);
            return next();
        } catch (err) {
            return c.json({error: "Invalid token"}, 401);
        }
    }
);
