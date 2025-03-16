import {Hono, type Context} from "hono";
import {cors} from "hono/cors";
import loginRoutes from "./routes/login.route";
import userRoutes from './routes/user.route';
import noteRoutes from './routes/note.route';
import {authMiddleware} from "./middlewares/authentication";
import {HTTPException} from "hono/http-exception";
import type {AppEnv} from "./types/hono-env.ts";
import {requestId} from 'hono/request-id';
import logger from "./utils/logger.ts";
import {attachChildLoggerMiddleware} from "./middlewares/requestChildLogger.ts";

// Extend Hono's context to include our logger
declare module 'hono' {
    interface ContextVariableMap {
        logger: typeof logger;
    }
}

const app = new Hono<AppEnv>();

app.use(requestId());

app.use(attachChildLoggerMiddleware(logger));

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
