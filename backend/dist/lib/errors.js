export class AppError extends Error {
    statusCode;
    code;
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 400, 'VALIDATION_ERROR');
    }
}
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED');
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden access') {
        super(message, 403, 'FORBIDDEN');
    }
}
export class InternalServerError extends AppError {
    constructor(message = 'An internal server error occurred') {
        super(message, 500, 'INTERNAL_SERVER_ERROR');
    }
}
export class OLTConnectionError extends AppError {
    constructor(message = 'Failed to connect to OLT') {
        super(message, 502, 'OLT_CONNECTION_FAILED');
    }
}
export class DeviceNotFoundError extends NotFoundError {
    constructor(serialNumber) {
        super(`Device ${serialNumber || ''} not found`);
    }
}
