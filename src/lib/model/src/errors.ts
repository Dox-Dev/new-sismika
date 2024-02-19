export class DatabaseConnectionError extends Error {
    constructor(message: string) {
        super(message);
        this.name="DatabaseConnectionError"
    }
}
export class ParseValidationError extends Error {
    constructor(message:string) {
        super(message);
        this.name="ParseValidationError"
    }
}