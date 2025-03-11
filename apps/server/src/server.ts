import {Hono, type Context} from "hono";
import {cors} from "hono/cors";
import loginRoutes from "./routes/login.route";
import userRoutes from './routes/user.route';
import noteRoutes from './routes/note.route';
import {authMiddleware} from "./middlewares/authentication";
import {HTTPException} from "hono/http-exception";
import type {AppEnv} from "./types/hono-env.ts";


const app = new Hono<AppEnv>();

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
    console.error("Unhandled error:", err);
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    return c.json({error: "Internal Server Error"}, 500);
});

export default app;
