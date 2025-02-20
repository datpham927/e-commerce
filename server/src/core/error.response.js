
const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}
const ResponseStatusCode = {
    FORBIDDEN: "Bad request error",
}
class ErrorResponse extends Error {
    constructor(message = ResponseStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message)
        this.status = status
    }
}

class BadRequestRequestError extends ErrorResponse {
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

module.exports = {
    NotFoundError,
    BadRequestRequestError, ErrorResponse
}