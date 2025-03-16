import prisma from "@db";
import {createFactory} from "hono/factory";
import type {Context} from "hono";
import type {AppEnv} from "../types/hono-env";
import type {JwtPayload} from "../middlewares/authentication";

const factory = createFactory<AppEnv>();

export const getUser = factory.createHandlers(
    async (c: Context<AppEnv>): Promise<Response> => {
        // Retrieve authentication information from context.
        const {userId, email} = c.get("auth") as JwtPayload;
        if (!userId || !email) {
            return c.json({error: "Unauthorized"}, 401);
        }

        // Query the database for the user.
        const user = await prisma.user.findUnique({
            where: {id: userId, email},
        });

        if (!user) {
            return c.json({error: "User not found"}, 404);
        }

        c.var.logger.info(`${email} fetched their data`);

        return c.json(user, 200);
    }
);
