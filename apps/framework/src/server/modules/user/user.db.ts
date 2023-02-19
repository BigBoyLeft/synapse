import { getPlayerIdentifier, logger } from "@lib/server";
import { db } from "../..";
import { user } from "@lib/database";

export default class UserDB {
    static async createUser(src: string, name: string): Promise<boolean> {
        let identifier = getPlayerIdentifier(src);
        if (!identifier) {
            logger.error(
                `Failed to create user ${GetPlayerName(
                    src
                )} (${src}) - identifier not found`
            );
        }

        let user = null;
        try {
            user = await db.user.create({
                data: {
                    identifier: identifier!,
                    name: name,
                },
            });
        } catch (e: any) {
            logger.error(
                `Failed to create user ${GetPlayerName(src)} (${src}) - ${
                    e.message
                }`
            );
        }

        return user ? true : false;
    }

    static async checkUser(src: string): Promise<boolean> {
        const identifier = getPlayerIdentifier(src);
        if (!identifier) {
            logger.error(
                `Failed to check user ${GetPlayerName(
                    src
                )} (${src}) - identifier not found`
            );
        }

        logger.info(
            `Checking user ${GetPlayerName(src)} (${src}) - ${identifier}`
        );

        const user = await db.user.findUnique({
            where: {
                identifier: identifier!,
            },
        });

        return user ? true : false;
    }

    static async getUser(src: string): Promise<user | null> {
        const identifier = getPlayerIdentifier(src);
        if (!identifier) {
            logger.error(
                `Failed to get user ${GetPlayerName(
                    src
                )} (${src}) - identifier not found`
            );
        }

        logger.info(
            `Getting user ${GetPlayerName(src)} (${src}) - ${identifier}`
        );

        return await db.user.findUnique({
            where: {
                identifier: identifier!,
            },
        });
    }
}
