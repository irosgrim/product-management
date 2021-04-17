export class RequestStatus {
    constructor() {}
    get badRequest(): number {
        return 400;
    }
    get notFound(): number {
        return 404;
    }

    get ok(): number {
        return 200;
    }
}

export const requestType = new RequestStatus;