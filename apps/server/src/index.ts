import {startServer} from "./server.ts";

console.log('ENV VARIABLES:');
console.log('===========================');
console.log(`PORT: ${process.env.PORT}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_URL: ${process.env.DB_URL}`);
console.log('===========================');

startServer().then(message => console.log(message));
