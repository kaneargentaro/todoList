// src/controllers/user.controller.ts
import prisma from "../utils/prisma.ts";
import type {JwtPayload} from "../middlewares/authentication.ts";
import type {Context} from "../types/context";

export async function getUser(ctx: Context): Promise<Response> {
    const auth = ctx.locals.auth as JwtPayload | undefined;
    if (!auth) {
        return new Response(JSON.stringify({error: "Unauthorized"}), {
            status: 401,
            headers: {"Content-Type": "application/json"},
        });
    }

    const {id, email} = auth;

    const user = await prisma.user.findUnique({
        where: {
            id,
            email,
        },
    });

    return new Response(JSON.stringify(user), {
        status: 200,
        headers: {"Content-Type": "application/json"},
    });
}
