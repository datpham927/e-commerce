const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    BAD_REQUEST: 400,  // Thêm mã trạng thái cho BadRequest
    NOT_FOUND: 404     // Thêm mã trạng thái cho NotFound
}

const ResponseStatusCode = {
    FORBIDDEN: "Forbidden request error",
    CONFLICT: "Conflict error",
    BAD_REQUEST: "Bad request error",  // Sửa thông điệp cho BadRequest
    NOT_FOUND: "Not found error"      // Sửa thông điệp cho NotFound
}

// Lớp lỗi cơ bản
class ErrorResponse extends Error {
    constructor(message = ResponseStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message);
        this.status = status;
    }
}

// Lỗi 400 - Bad Request
class BadRequestError extends ErrorResponse {
    constructor(message = ResponseStatusCode.BAD_REQUEST, status = StatusCode.BAD_REQUEST) {
        super(message, status);  // Sửa lỗi này để truyền cả message và status đúng cách
    }
}

// Lỗi 404 - Not Found
class NotFoundError extends ErrorResponse {
    constructor(message = ResponseStatusCode.NOT_FOUND, status = StatusCode.NOT_FOUND) {
        super(message, status);  // Truyền đúng message và status
    }
}

// Lỗi 403 - Forbidden
class ForbiddenError extends ErrorResponse {
    constructor(message = ResponseStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message, status);
    }
}

// Lỗi 409 - Conflict
class ConflictRequestError extends ErrorResponse {
    constructor(message = ResponseStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message, status);
    }
}

module.exports = {
    NotFoundError,
    ForbiddenError,
    ConflictRequestError,
    BadRequestError,
    ErrorResponse
}
