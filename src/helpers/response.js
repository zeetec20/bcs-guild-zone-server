/**
 * @param  {{code, name}} status
 * @param  {{[name: string]: any}} data
 */
module.exports = (status, data) => ({
    code: status.code,
    status: status.name,
    data
})

module.exports.status = {
    OK: {
        name: 'OK',
        code: 200
    },
    BAD_REQUEST: {
        name: 'BAD_REQUEST',
        code : 400
    },
    UNAUTHORIZED: {
        name: 'UNAUTHORIZED',
        code: 401
    },
    FORBIDDEN: {
        name: 'FORBIDDEN',
        code: 403
    },
    NOT_FOUND: {
        name: 'NOT_FOUND',
        code: 404
    },
    CONFLICT: {
        name: 'CONFLICT',
        code: 409
    },
    SERVER_ERROR: {
        name: 'SERVER_ERROR',
        code: 500
    },
}