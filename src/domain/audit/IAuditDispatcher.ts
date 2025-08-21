import { AuditRequest } from "./AuditRequest";

export interface IAuditDispatcher {
    AuditRequest(request: AuditRequest): Promise<void>;
    env?: Env;
}