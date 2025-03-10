import prisma from "@db";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../constants/auth.ts";
import type {Context} from "../types/context";
import type {JTDDataType} from "ajv/dist/types/jtd-schema";

// Schema used for typing; the actual JSONSchema will be defined in the route.
const loginSchema = {
    properties: {
        email: {type: "string", format: "email"},
        password: {type: "string"},
    },
} as const;
export type LoginPayload = JTDDataType<typeof loginSchema>;

export const getLogin = async (ctx: Context): Promise<Response> => {
    const {email} = ctx.locals.auth || {};
    if (!email) {
        return new Response(JSON.stringify({error: "Not authenticated"}), {
            status: 401,
            headers: {"Content-Type": "application/json"},
        });
    }
    return new Response(
        JSON.stringify({message: `${email} is logged in`}),
        {status: 200, headers: {"Content-Type": "application/json"}}
    );
};

export const postLogin = async (ctx: Context): Promise<Response> => {
    const payload = ctx.locals.validatedBody as LoginPayload;
    const {email, password} = payload;

    const user = await prisma.user.findUnique({
        where: {email, password},
    });

    if (!user) {
        return new Response(JSON.stringify({message: "Unauthorized"}), {
            status: 401,
            headers: {"Content-Type": "application/json"},
        });
    }

    const token = jwt.sign(
        {userId: user.id, email: user.email},
        JWT_SECRET,
        {expiresIn: "1h"}
    );

    return new Response(
        JSON.stringify({message: "Login successful", token}),
        {headers: {"Content-Type": "application/json"}}
    );
};
