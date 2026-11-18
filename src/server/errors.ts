// A service-layer error that carries the HTTP status and a stable code a thin
// route handler maps to a response. Internal detail stays in `cause` and the
// logs, never in `message`.
export class ServiceError extends Error {
	readonly status: number;
	readonly code: string;

	constructor(code: string, message: string, status: number, options?: ErrorOptions) {
		super(message, options);
		this.name = "ServiceError";
		this.code = code;
		this.status = status;
	}
}

// The request names a record the caller may not reach, or that does not exist. A
// route maps this to 404 so a guessed id and a real-but-forbidden id look the
// same to the caller.
export class NotFoundError extends ServiceError {
	constructor(message = "Not found.") {
		super("not_found", message, 404);
	}
}

// The guest token is missing, malformed, expired, or revoked. A route maps this
// to 401.
export class InvalidTokenError extends ServiceError {
	constructor(message = "This link is no longer valid.") {
		super("invalid_token", message, 401);
	}
}

// The requested transition is not allowed from the record's current state (for
// example, cancelling an already-cancelled booking). A route maps this to 409.
export class ConflictError extends ServiceError {
	constructor(message = "That change cannot be applied.") {
		super("conflict", message, 409);
	}
}
