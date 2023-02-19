import { user } from "@lib/database";
import { logger } from "@lib/server";
import UserDB from "./user.db";

export default class User {
    private rawUser: user;
    constructor(user: user) {
        this.rawUser = user;
    }

    get id() {
        return this.rawUser.id;
    }

    async unload() {
        logger.warn(`[Not Implemented] Unloading self (id: ${this.id})`);
    }
}
