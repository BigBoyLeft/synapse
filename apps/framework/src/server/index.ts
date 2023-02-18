import { PrismaClient } from "@lib/database";
import { logger, Config } from "@lib/server";

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
