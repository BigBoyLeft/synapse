import { user } from "@lib/database";
import UserDB from "./user.db";

export default class User {
    private rawUser: user;
    constructor(user: user) {
        this.rawUser = user;
    }
}
