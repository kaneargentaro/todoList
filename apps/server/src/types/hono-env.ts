export interface AppEnv {
    Variables: {
        auth: {
            userId: string;
            email: string;
        },
        validatedBody?: any;
    };
}
