import { IAuditDispatcher } from "./IAuditDispatcher";

export class AuditWebhookDispatcher implements IAuditDispatcher {
    private retryCount = 0;
    private retryCountLimit = 5;

    public async AuditRequest(request: Request): Promise<void> {
        this.retryCount = 0;
        if (!process.env.WEBHOOK_URL) {
            console.error('WEBHOOK_URL is not set as an environment variable. Skipping webhook dispatch.');
            return Promise.resolve();
        }

        console.log(`Dispatching audit webhook to ${process.env.WEBHOOK_URL}`);

        const response = await this.dispatchWebhook(request);

        if (!response.ok) {
            console.error('Failed to dispatch audit webhook:', response.statusText);
        }

        return Promise.resolve();
    }

    private async dispatchWebhook(request: Request): Promise<Response> {
        if (!process.env.WEBHOOK_URL) {
            return Promise.resolve(new Response('WEBHOOK_URL is not set', { status: 500 }));
        }

        console.log(`Attempting to dispatch audit webhook (retry count - ${this.retryCount})`);

        const response = await fetch(process.env.WEBHOOK_URL, {
            method: "POST",
            body: JSON.stringify({ request }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(`Failed to dispatch audit webhook (retry count - ${this.retryCount}):`, response.statusText);
            this.retryCount++;
            if (this.retryCount < this.retryCountLimit) {
                console.log(`Retrying... (attempt ${this.retryCount})`);
                return this.dispatchWebhook(request);
            }
        }

        return Promise.resolve(response);
    }
}