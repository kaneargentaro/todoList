import type {HttpBindings} from '@hono/node-server';

export interface AppEnv {
    Variables: {
        auth: {
            userId: string;
            email: string;
        },
        validatedBody?: any;
    },
    Bindings: HttpBindings
}
