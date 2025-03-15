import {Hono, type Context} from "hono";
import {cors} from "hono/cors";
import loginRoutes from "./routes/login.route";
import userRoutes from './routes/user.route';
import noteRoutes from './routes/note.route';
import {authMiddleware} from "./middlewares/authentication";
import {HTTPException} from "hono/http-exception";
import type {AppEnv} from "./types/hono-env.ts";
import {requestId} from 'hono/request-id';
import {pino} from 'pino';
import {pinoHttp} from 'pino-http';
import logger from "./utils/logger.ts";

declare module 'hono' {
    interface ContextVariableMap {
        logger: pino.Logger;
    }
}

const app = new Hono<AppEnv>();

app.use(requestId());

// https://getpino.io/#/docs/web?id=pino-with-hono
app.use(async (c, next) => {
    // Ensure the environment objects exist.
    if (!c.env.incoming) c.env.incoming = {} as any;

    // Create a stub outgoing object with an `on` method to satisfy pino-http.
    if (!c.env.outgoing) c.env.outgoing = {
        on: () => {
        }
    } as any;

    // Pass Hono's requestId to pino‑http.
    c.env.incoming.id = c.var.requestId;

    // Wrap pinoHttp in a Promise to await its execution.
    await new Promise<void>((resolve) =>
        pinoHttp(logger)(c.env.incoming, c.env.outgoing, () => resolve())
    );

    // Set the logger from pino‑http (attached to incoming.log) into Hono's context.
    c.set("logger", c.env.incoming.log);

    await next();
});

// Global CORS middleware with secure defaults
app.use(
    "*",
    cors({
        origin: "*", // Consider restricting to known origins in production
        allowHeaders: ["Content-Type", "Authorization"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    })
);
// Mount public routes first (e.g. /login)
app.route("/login", loginRoutes);

// For all other routes, require authentication
app.use("/*", authMiddleware);

app.route('/user', userRoutes);
app.route('/notes', noteRoutes);

// Global error handler: logs errors and returns a consistent JSON error response.
app.onError((err: Error | HTTPException, c: Context): Response => {
    // Optionally log the error (without sensitive details) for debugging.
    c.var.logger.error(err, "Unhandled error");
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    return c.json({error: "Internal Server Error"}, 500);
});

export default app;
