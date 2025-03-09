const server = Bun.serve({
    port: 3000,
    fetch(req) {
        return new Response("Bun!");
    },
});

console.log('ENV VARIABLES:');
console.log('===========================');
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
console.log(`DB_URL: ${process.env.DB_URL}`);
console.log('===========================');
console.log();
console.log(`Listening on http://localhost:${server.port} ...`);

