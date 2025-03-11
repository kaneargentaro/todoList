import Ajv from "ajv";
import addFormats from "ajv-formats";
import type {JSONSchemaType} from "ajv";
import type {Context, MiddlewareHandler} from "hono";
import {createFactory} from "hono/factory";
import type {AppEnv} from "../types/hono-env.ts";

const factory = createFactory<AppEnv>();

export function validationMiddleware<T>(schema: JSONSchemaType<T>): MiddlewareHandler<AppEnv> {
    const ajv = new Ajv({strict: false, allErrors: true});
    addFormats(ajv);
    const validate = ajv.compile(schema);

    return factory.createMiddleware(async (c: Context<AppEnv>, next) => {
        let body: unknown;
        try {
            body = await c.req.json();
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
        
        // Attach the validated body so downstream handlers can access it
        c.set("validatedBody", body as T);
        return next();
    });
}
