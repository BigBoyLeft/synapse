export * from "./event";
export * from "./limiter";

export const Delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
