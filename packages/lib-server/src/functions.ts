import { Config } from "./config";

export const getSource = () => String(globalThis.source);

export const getPlayerIdentifier = (player: string) => {
    const identifiers = getPlayerIdentifiers(player);
    const result = identifiers.find((id) =>
        id.startsWith(Config.framework.identifier)
    );
    return result;
};