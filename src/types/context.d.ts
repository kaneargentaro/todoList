export interface Context {
    req: Request;
    locals: Record<string, any>;
}
