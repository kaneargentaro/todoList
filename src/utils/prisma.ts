import {PrismaClient} from "@prisma/client";

declare global {
    // Prevent multiple instances during hot-reloads in development
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient(
    {
        log: ["query"]
    }
);

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

export default prisma;
