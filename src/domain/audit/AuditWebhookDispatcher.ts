import { AuditRequest } from "./AuditRequest";
import { IAuditDispatcher } from "./IAuditDispatcher";

export class AuditWebhookDispatcher implements IAuditDispatcher {
    private retryCount = 0;
    private retryCountLimit = 5;
    public env?: Env;

    public async AuditRequest(request: AuditRequest): Promise<void> {
        this.retryCount = 0;
        if (!this.env?.WEBHOOK_URL) {
            console.error('WEBHOOK_URL is not set as an environment variable. Skipping webhook dispatch.');
            return Promise.resolve();
        }

        console.log(`Dispatching audit webhook to ${this.env.WEBHOOK_URL}`);

        const response = await this.dispatchWebhook(request);

        if (!response.ok) {
            console.error('Failed to dispatch audit webhook:', response.statusText);
        }

        return Promise.resolve();
    }

    private async dispatchWebhook(request: AuditRequest): Promise<Response> {
        if (!this.env?.WEBHOOK_URL) {
            return Promise.resolve(new Response('WEBHOOK_URL is not set', { status: 500 }));
        }

        console.log(`Attempting to dispatch audit webhook (retry count - ${this.retryCount})`);

        const response = await fetch(this.env.WEBHOOK_URL, {
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