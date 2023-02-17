import { PrismaClient } from "@lib/database";
import { logger } from "@lib/server";
import { Config } from "@lib/shared";

export const db = new PrismaClient({
    datasources: { db: { url: Config.database } },
});

class Server {
    constructor() {
        this.start();
    }

    async start() {
        try {
            await db.$connect();
            logger.log("Database connected");

            await import("./boot");
        } catch (error) {
            logger.error("Database connection failed");
        }
    }
}

export default new Server();
