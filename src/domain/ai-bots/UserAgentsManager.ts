export class UserAgentManager {
    private userAgents: Set<string>;

    private userAgentPatterns = [
        /gptbot/,
        /oai-searchbot/,
        /anthropic-ai|claudebot/,
        /bytespider/,
        /perplexitybot|perplexitycrawler/,
        /youbot/,
        /diffbot/,
        /ccbot/,
        /amazonbot/,
        /meta-?ai|facebookbot|facebookexternalhit/,
        /petalbot/,
        /ai2bot/,
        /cohere-?ai/,
        /google-extended/,
        /applebot-extended/,
    ];

    constructor() {
        this.userAgents = new Set();
    }

    public isAiUserAgent(userAgent: string): boolean {
        if (this.userAgents.has(userAgent)) {
            return true;
        }

        const isBot = this.userAgentPatterns.some((pattern) => {
            if (pattern.test(userAgent)) {
                console.log(`User-Agent ${userAgent} matches pattern: ${pattern}`);
                return true;
            }

            return false;
        });

        if (isBot) {
            this.addUserAgent(userAgent);
        }

        return isBot;
    }

    public async addUserAgent(userAgent: string): Promise<string> {
        return new Promise((resolve) => {
            if (!userAgent || this.userAgents.has(userAgent)) {
                resolve(userAgent);
                return;
            }

            this.userAgents.add(userAgent);
            resolve(userAgent);
        });
    }

    public getUserAgent(userAgent: string): string | undefined {
        if (!userAgent) {
            return undefined;
        }

        return this.userAgents.has(userAgent) ? userAgent : undefined;
    }
}
