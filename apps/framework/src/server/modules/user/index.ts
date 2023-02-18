import { Event, getSource, logger } from "@lib/server";
import User from "./user.class";
import UserDB from "./user.db";

class UserController {
    clients: { [key: string]: User } = {};

    constructor() {
        logger.info("UserController loaded");
        Event["playerConnecting"](this.playerConnecting, true);
    }

    /**
     * Called when a player is connecting to the server
     * handles the creation of the users account if needed
     * @param name
     * @param setKickReason
     * @param deferrals
     */
    async playerConnecting(
        name: string,
        setKickReason: Function,
        deferrals: any
    ) {
        let src = getSource();
        deferrals.defer();

        let user = await UserDB.getUser(src);
        if (!user) {
            user = await UserDB.createUser(src, name);
        }

        if (!user) {
            setKickReason("Failed to associate you with an account");
            deferrals.done();
            return;
        }

        deferrals.update(`Welcome ${user.id} - ${user.name}`);
    }
}

export default new UserController();
