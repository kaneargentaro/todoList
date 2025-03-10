export default interface Route {
    method: string; // e.g., "GET", "POST", etc.
    path: string;   // e.g., "/todos", "/users/:id", etc.
    handler: (req: Request) => Response | Promise<Response>;
}