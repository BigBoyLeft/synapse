import { getPlayerIdentifier, logger } from "@lib/server";
import { db } from "../..";
import { user } from "@lib/database";

export default class UserDB {
    static async createUser(src: string, name: string): Promise<user | null> {
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
        } catch (e) {
            logger.error(
                `Failed to create user ${GetPlayerName(src)} (${src}) - ${e}`
            );
        }

        logger.info(
            `Created user ${GetPlayerName(src)} (${src}) - ${user?.id}`
        );

        return user;
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
