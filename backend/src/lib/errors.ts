export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'An internal server error occurred') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict occurred') {
    super(message, 409, 'CONFLICT');
  }
}

export class OLTConnectionError extends AppError {
  constructor(message: string = 'Failed to connect to OLT') {
    super(message, 502, 'OLT_CONNECTION_FAILED');
  }
}

export class DeviceNotFoundError extends NotFoundError {
  constructor(serialNumber?: string) {
    super(`Device ${serialNumber || ''} not found`);
  }
}
