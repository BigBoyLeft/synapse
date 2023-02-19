interface Limiter {
    limiters: Map<string, boolean>;
    options: LimiterOptions;
}

export interface LimiterOptions {
    rateLimit?: number;
}

export class RateLimiter {
    private rateLimits: Map<string, Limiter> = new Map();
    private timeBetweenRequests: number;

    constructor(timeBetweenReq: number = 250) {
        this.timeBetweenRequests = timeBetweenReq;
    }

    registerNewEvent(event: string, options: LimiterOptions = {}) {
        this.rateLimits.set(event, { limiters: new Map(), options });
    }

    isPlayerRateLimited(event: string, source: string) {
        return !!this.rateLimits?.get(event)?.limiters.get(source);
    }

    rateLimitPlayer(event: string, source: string) {
        let rateLimiter = this.rateLimits.get(event);
        rateLimiter?.limiters.set(source, true);

        setTimeout(() => {
            rateLimiter?.limiters.delete(source);
        }, rateLimiter?.options?.rateLimit || this.timeBetweenRequests);
    }
}
