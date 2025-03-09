import Ajv from "ajv";
import addFormats from "ajv-formats";

export function withValidation<T>(
    schema: object,
    handler: (payload: T, req: Request) => Promise<Response> | Response
) {
    const ajv = new Ajv({strict: false, allErrors: true});
    addFormats(ajv); // This registers the built-in formats, including "email"
    const validate = ajv.compile(schema);

    return async (req: Request): Promise<Response> => {
        let body: unknown;
        try {
            body = await req.json();
        } catch (err) {
            return new Response(
                JSON.stringify({error: "Invalid JSON"}),
                {status: 400, headers: {"Content-Type": "application/json"}}
            );
        }

        if (!validate(body)) {
            return new Response(
                JSON.stringify({error: "Validation failed", details: validate.errors}),
                {status: 400, headers: {"Content-Type": "application/json"}}
            );
        }

        return handler(body as T, req);
    };
}
