import type Route from '../types/route';

const postRoutes: Route[] = [
    {
        method: "GET",
        path: "/post",
        handler: (req: Request): Response => {
            return new Response(
                JSON.stringify({message: "Hello from Post"}),
                {headers: {"Content-Type": "application/json"}}
            );
        },
    },
    // {
    //     method: "POST",
    //     path: "/user",
    //
    //     handler: async (req: Request): Promise<Response> => {
    //         const body = await req.json();
    //         return new Response(
    //             JSON.stringify({message: "Posted to User", body}),
    //             {headers: {"Content-Type": "application/json"}}
    //         );
    //     },
    // },
];

export default postRoutes;