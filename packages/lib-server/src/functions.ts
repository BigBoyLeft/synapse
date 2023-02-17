export const getSource = () => String(globalThis.source);

export const getPlayerIdentifier = (player: string, identifier: string) => {
    const identifiers = getPlayerIdentifiers(player);
    const result = identifiers.find((id) => id.startsWith(identifier));
    return result;
};

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

// Example:
// Event.playerConnecting((player: string) => {
//     console.log(player);
// });
