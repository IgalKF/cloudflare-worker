export interface IAuditDispatcher {
    AuditRequest(request: Request<unknown, IncomingRequestCfProperties<unknown>>): Promise<void>;
}