/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { UserAgentManager } from "./domain/ai-bots/UserAgentsManager";
import { AuditWebhookDispatcher } from "./domain/audit/AuditWebhookDispatcher";
import { IAuditDispatcher } from "./domain/audit/IAuditDispatcher";
import { HtmlParser } from "./domain/html-parser/HtmlParser";

const uam = new UserAgentManager();
const auditDispatcher: IAuditDispatcher = new AuditWebhookDispatcher();

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (!auditDispatcher.env) {
			auditDispatcher.env = env;
		}

		const ua = (request.headers.get("user-agent") || "").toLowerCase();

		console.log(`Request received from User-Agent: ${ua}`);

		await auditDispatcher.AuditRequest({ ua: request.headers.get("user-agent") });

		if (uam.isUserAgent(ua)) {
			console.log(`User-Agent ${ua} is an AI model.`);

			try {
				const fetchResponse = await fetch(request);
				const responseHtml = await fetchResponse.text();
				const plainText = new HtmlParser(responseHtml).stripDocumentToPlainText();
				return new Response(plainText);
			} catch (error) {
				console.error("Error processing AI User-Agent request:", error);
				return new Response("Internal Server Error", { status: 500 });
			}
		}

		return fetch(request);
	},
} satisfies ExportedHandler<Env>;
