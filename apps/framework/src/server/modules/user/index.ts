import { Event, getSource, logger } from "@lib/server";

class UserController {
    constructor() {
        logger.info("UserController loaded");
        Event.playerConnecting(this.test, true);
    }

    test = (name: unknown, setKickReason: unknown, deferrals: unknown) => {
        let src = getSource();

        logger.info(`Player ${name} is connecting from ${src}!`);
    };
}

export default new UserController();
