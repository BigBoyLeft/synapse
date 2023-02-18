import { Config } from "./config";

export const getSource = () => String(globalThis.source);

export const getPlayerIdentifier = (player: string) => {
    const identifiers = getPlayerIdentifiers(player);
    const result = identifiers.find((id) =>
        id.startsWith(Config.framework.identifier)
    );
    return result;
};

/**
 * Event handler
 * @example
 * Event["event name"]((data: unknown) => {
 *    console.log(...args);
 * });
 */
export const Event = new Proxy<{ [key: string]: Function }>(
    {},
    {
        get: (target, prop) => {
            const eventName = prop.toString();
            return (
                callback: (...args: any[]) => void,
                net: boolean = false
            ) => {
                (net ? onNet : on)(eventName, callback);
            };
        },
    }
);
