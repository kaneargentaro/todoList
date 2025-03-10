import jwt from "jsonwebtoken";
import type {Middleware} from "./compose";
import {JWT_SECRET} from "../constants/auth.ts";

// This interface represents the shape of the decoded token payload.
export interface JwtPayload {
    id: string;
    email: string;
}

export const authMiddleware: Middleware = async (ctx, next) => {
    const authHeader = ctx.req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({error: "Missing Authorization header"}), {
            status: 401,
            headers: {"Content-Type": "application/json"},
        });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return new Response(JSON.stringify({error: "Invalid Authorization header format"}), {
            status: 401,
            headers: {"Content-Type": "application/json"},
        });
    }
    const token = parts[1];
    try {
        ctx.locals.auth = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return next();
    } catch (err) {
        return new Response(JSON.stringify({error: "Invalid token"}), {
            status: 401,
            headers: {"Content-Type": "application/json"},
        });
    }
};