import { PrismaClient } from "@lib/database";
import { logger } from "@lib/server";

const client = new PrismaClient();

class Server {
  constructor() {
    this.start();
  }

  async start() {
    try {
      await client.$connect();
      logger.log("Database connected");
    } catch (error) {
      logger.error("Database connection failed");
    }
  }
}

export default new Server();
