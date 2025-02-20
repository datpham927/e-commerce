'use strict'
class SuccessResponse {
    constructor({ message, statusCode, reasonStatusCode, metadata }) {
        this.message = message ? message : reasonStatusCode,
            this.status = statusCode,
            this.metadata = metadata
    }
    send(res, headers = {}) {
        // this =   this.status = statusCode,
        //          this.metadata = metadata
        return res.status(this.status).json(this);
    }
}



module.exports = { SuccessResponse }