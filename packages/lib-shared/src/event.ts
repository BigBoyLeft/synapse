import "reflect-metadata";
import { LimiterOptions, RateLimiter } from "./limiter";

type Event = {
    name: string | symbol;
    method: string | symbol;
    net: boolean;
    promise?: {
        rateLimiter?: RateLimiter;
        rateLimitOptions?: LimiterOptions;
    };
};

/**
 * Event decorator
 * @param net
 * @param event
 */
export function Event(net: boolean, event?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!Reflect.hasMetadata("Events", target.constructor)) {
            Reflect.defineMetadata("Events", [], target.constructor);
        }

        const events = Reflect.getMetadata("Events", target.constructor) as Event[];

        events.push({
            name: event ?? propertyKey,
            method: propertyKey,
            net,
        });

        Reflect.defineMetadata("Events", events, target.constructor);
    };
}

/**
 * Promise Event decorator
 * @param net
 * @param event
 * @param rateLimiter
 * @param rateLimitOptions
 * @returns
 */
export function PromiseEvent(net: boolean, event?: string, rateLimiter?: RateLimiter, rateLimitOptions?: LimiterOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (!Reflect.hasMetadata("Events", target.constructor)) {
            Reflect.defineMetadata("Events", [], target.constructor);
        }

        const events = Reflect.getMetadata("Events", target.constructor) as Event[];

        events.push({
            name: event ?? propertyKey,
            method: propertyKey,
            net,
            promise: {
                rateLimiter,
                rateLimitOptions,
            },
        });

        Reflect.defineMetadata("Events", events, target.constructor);
    };
}

/**
 * Event handler decorator
 */
export function EventHandler() {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
        const events = Reflect.getMetadata("Events", constructor) as Event[];

        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                if (events) {
                    for (const event of events) {
                        const method = (this as any)[event.method].bind(this);
                        const name = event.name.toString();
                        if (event.promise) {
                            const { rateLimiter, rateLimitOptions } = event.promise;
                            rateLimiter?.registerNewEvent(name, rateLimitOptions);

                            onNet(name, async (respEventName: string, ...data: unknown[]) => {
                                const startTime = process.hrtime.bigint();
                                const src = String(global.source);

                                const promiseResponse = (data: unknown) => {
                                    const endTime = process.hrtime.bigint();
                                    const diff = Number(endTime - startTime) / 1e6;

                                    emitNet(respEventName, src, data);
                                };

                                if (rateLimiter?.isPlayerRateLimited(name, src)) {
                                    promiseResponse({
                                        status: "error",
                                        errorMessage: "RATE_LIMITED",
                                    });
                                } else {
                                    rateLimiter?.rateLimitPlayer(name, src);
                                }

                                try {
                                    await (this as any)[event.method](src, data, promiseResponse);
                                } catch (e) {
                                    promiseResponse({
                                        status: "error",
                                        errorMessage: "UNKNOWN",
                                    });
                                }
                            });
                        } else {
                            (event.net ? onNet : on)(name, method);
                        }
                    }
                }
            }
        };
    };
}

/**
 * Event handler
 * Use the `@Event(net: boolean, event: string)` decorator to register an event instead of using this
 * @example
 * Event["event name"]((data: unknown) => {
 *    console.log(...args);
 * });
 */
export const EventProxy = new Proxy<{ [key: string]: Function }>(
    {},
    {
        get: (target, prop) => {
            const eventName = prop.toString();
            return (callback: (...args: any[]) => void, net: boolean = false) => {
                (net ? onNet : on)(eventName, callback);
            };
        },
    }
);
