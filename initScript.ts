import {PrismaClient} from '@prisma/client'

import prisma from "./src/utils/prisma";

async function main() {
    const user = await prisma.user.create({
        data: {
            // name: "kane",
            email: "kane_argentaro@hotmail.com",
            password: "123123"
        }
    });
    console.log(user);
}

main().catch(console.error).finally(async () => {
    await prisma.$disconnect()
})