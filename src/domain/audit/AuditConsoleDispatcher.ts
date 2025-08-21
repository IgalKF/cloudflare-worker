import { AuditRequest } from "./AuditRequest";
import { IAuditDispatcher } from "./IAuditDispatcher";

export class AuditConsoleDispatcher implements IAuditDispatcher {
    private logger: Console;

    constructor() {
        this.logger = console;
    }

    public AuditRequest(request: AuditRequest): Promise<void> {
        this.logger.log("Request received:", request);
        return Promise.resolve();
    }
}