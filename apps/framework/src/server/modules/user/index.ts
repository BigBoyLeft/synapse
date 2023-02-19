import { getSource, logger } from "@lib/server";
import { Delay, Event, EventHandler, EventProxy } from "@lib/shared";
import User from "./user.class";
import UserDB from "./user.db";

@EventHandler()
class UserService {
    clients: { [key: string]: User };

    constructor() {
        this.clients = {};
        onNet("playerJoining", () => this.loadPlayer(getSource()));

        // just in case we restart the framework, we need to loop throught he players and load each one like they just joined
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            let src = GetPlayerFromIndex(i);
            this.loadPlayer(src);
        }
    }

    /**
     * Called when a player has joined the server
     * handles the loading of the users account
     * @param src
     * @returns
     */
    async loadPlayer(src: string) {
        let user = await UserDB.getUser(src);
        if (!user) return DropPlayer(src, "Failed you load your user account | Error Code: 0x00002");
        logger.info(`Loading user ${src} - ${user.id} - ${user.name}`);

        this.clients[src] = new User(user);
    }

    /**
     * Called when a player is connecting to the server
     * handles the creation of the users account if needed
     * @param name
     * @param setKickReason
     * @param deferrals
     */
    @Event(true, "playerConnecting")
    async checkPlayer(name: string, setKickReason: Function, deferrals: any) {
        let src = getSource();
        deferrals.defer();
        deferrals.update("Running a few Test 🧪");

        let user = await UserDB.checkUser(src);
        if (!user) {
            user = await UserDB.createUser(src, name);
        }

        if (!user) {
            setKickReason("Failed you load your user account | Error Code: 0x00001");
            deferrals.done("Failed you load your user account | Error Code: 0x00001");
            return;
        }

        deferrals.done();
    }

    /**
     * Unloads a client from the server
     * @param reason
     */
    @Event(true, "playerDropped")
    async unloadPlayer(reason: string) {
        let src = getSource();
        if (!this.clients[src]) return;

        logger.info(`Unloading user (id: ${this.clients[src].id})`);

        await this.clients[src].unload();

        delete this.clients[src];
    }
}

export default new UserService();
