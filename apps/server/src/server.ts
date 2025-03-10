import {serve} from "bun";
import fs from "fs";
import path from "path";
import type Route from "./types/route";

const port = process.env.PORT || 3000;

// Dynamically import all routes from the routes directory
async function loadRoutes(): Promise<Route[]> {
    const routesDir = path.join(process.cwd(), "src", "routes");
    const files = fs.readdirSync(routesDir).filter((file) => file.endsWith(".ts"));
    let allRoutes: Route[] = [];

    for (const file of files) {
        const modulePath = path.join(routesDir, file);
        const moduleRoutes: Route[] = (await import(modulePath)).default;
        allRoutes = allRoutes.concat(moduleRoutes);
    }

    return allRoutes;
}

// Export a function to start the Bun server
export async function startServer() {
    const routes = await loadRoutes();

    // Router function that iterates through the loaded routes to find a match
    async function router(req: Request): Promise<Response> {
        try {
            const url = new URL(req.url);
            const matchedRoute = routes.find(
                (route) => route.method === req.method && route.path === url.pathname
            );

            if (matchedRoute) {
                return await matchedRoute.handler(req);
            }

            return new Response(JSON.stringify({error: "Not Found"}), {
                status: 404,
                headers: {"Content-Type": "application/json"},
            });
        } catch (error: any) {
            console.error("Error processing request:", error);
            return new Response(JSON.stringify({error: error.message}), {
                status: 500,
                headers: {"Content-Type": "application/json"},
            });
        }
    }

    // Fetch is basically the catch-all for the https server
    // We are using it to import other route files dynamically
    // However, we could always use the route object to manually set them
    serve({
        port: port,
        fetch: router,
        error(error) {
            console.error(error);
            return new Response(
                JSON.stringify({message: error.message}),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }
    });
    return (`Starting server on port ${port}...`);
}
