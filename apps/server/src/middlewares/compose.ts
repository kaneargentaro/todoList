import type {Context} from "../types/context";

export type Middleware = (ctx: Context, next: () => Promise<Response>) => Promise<Response>;

export function compose(middlewares: Middleware[], finalHandler: (ctx: Context) => Promise<Response>): (req: Request) => Promise<Response> {
    return async (req: Request): Promise<Response> => {
        const ctx: Context = {req, locals: {}};
        let index = -1;

        async function dispatch(i: number): Promise<Response> {
            if (i <= index) {
                throw new Error("next() called multiple times");
            }
            index = i;
            const fn: Middleware | ((ctx: Context) => Promise<Response>) = i < middlewares.length ? middlewares[i] : finalHandler;
            return fn(ctx, () => dispatch(i + 1));
        }

        return dispatch(0);
    };
}
