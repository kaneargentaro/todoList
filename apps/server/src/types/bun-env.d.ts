declare module "bun" {
    interface Env {
        PORT: number;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_HOST: string;
        DB_PORT: number,
        DB_URL: string;
    }
}
