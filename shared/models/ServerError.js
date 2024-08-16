
export class ServerError {
    constructor(summary, message) {
      this.summary = summary;
      this.message = message;
    }
}

export class GetError extends ServerError {
    constructor(message) {
        super('Could not get', message);
    }
}
export class PostError extends ServerError {
    constructor(message) {
        super('Could not create', message);
    }
}
export class PutError extends ServerError {
    constructor(message) {
        super('Could not put', message);
    }
}
export class PatchError extends ServerError {
    constructor(message) {
        super('Could not patch', message);
    }
}
