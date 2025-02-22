
const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}
const ResponseStatusCode = {
    FORBIDDEN: "Bad request error",
    CONFLICT: "Conflict error"
}
class ErrorResponse extends Error {
    constructor(message = ResponseStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message)
        this.status = status
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message = ResponseStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message)
        this.status = status
    }
}
class BadRequestError extends ErrorResponse {
    constructor(message = ResponseStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message)
        this.status = status
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ResponseStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message)
        this.status = status
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(message = ResponseStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message)
        this.status = status
    }
}

module.exports = {
    NotFoundError,
    ForbiddenError,
    ConflictRequestError, BadRequestError, ErrorResponse
}