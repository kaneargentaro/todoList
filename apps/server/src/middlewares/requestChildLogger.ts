import {pino} from "pino";
import type {Context} from "hono";

// Reusable middleware that creates a child logger from the main logger using the requestId
export function attachChildLoggerMiddleware(logger: pino.Logger) {
    return async (c: Context, next: () => Promise<void>) => {
        const reqId = c.var.requestId;
        const childLogger = logger.child({requestId: reqId});
        // Attach the child logger to Hono's context so it can be accessed in routes as c.var.logger
        c.set("logger", childLogger);
        return next();
    };
}
