// src/middleware/validation.ts
import Ajv from "ajv";
import addFormats from "ajv-formats";
import type {JSONSchemaType} from "ajv";
import type {Context} from "../types/context";
import type {Middleware} from "./compose.ts";

export function validationMiddleware<T>(schema: JSONSchemaType<T>): Middleware {
    const ajv = new Ajv({strict: false, allErrors: true});
    addFormats(ajv);
    const validate = ajv.compile(schema);

    return async (ctx, next) => {
        let body: unknown;
        try {
            body = await ctx.req.json();
        } catch (err) {
            return new Response(JSON.stringify({error: "Invalid JSON"}), {
                status: 400,
                headers: {"Content-Type": "application/json"},
            });
        }
        if (!validate(body)) {
            return new Response(JSON.stringify({error: "Validation failed", details: validate.errors}), {
                status: 400,
                headers: {"Content-Type": "application/json"},
            });
        }
        ctx.locals.validatedBody = body as T;
        return next();
    };
}
