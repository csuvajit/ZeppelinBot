"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.notFound = exports.clientError = exports.serverError = exports.error = exports.unauthorized = void 0;
function unauthorized(res) {
    res.status(403).json({ error: "Unauthorized" });
}
exports.unauthorized = unauthorized;
function error(res, message, statusCode = 500) {
    res.status(statusCode).json({ error: message });
}
exports.error = error;
function serverError(res, message = "Server error") {
    error(res, message, 500);
}
exports.serverError = serverError;
function clientError(res, message) {
    error(res, message, 400);
}
exports.clientError = clientError;
function notFound(res) {
    res.status(404).json({ error: "Not found" });
}
exports.notFound = notFound;
function ok(res) {
    res.json({ result: "ok" });
}
exports.ok = ok;
