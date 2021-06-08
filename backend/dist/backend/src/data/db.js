"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.connection = void 0;
const SimpleError_1 = require("../SimpleError");
const typeorm_1 = require("typeorm");
let connectionPromise;
function connect() {
    if (!connectionPromise) {
        connectionPromise = typeorm_1.createConnection().then(newConnection => {
            // Verify the DB timezone is set to UTC
            return newConnection.query("SELECT TIMEDIFF(NOW(), UTC_TIMESTAMP) AS tz").then(r => {
                if (r[0].tz !== "00:00:00") {
                    throw new SimpleError_1.SimpleError(`Database timezone must be UTC (detected ${r[0].tz})`);
                }
                exports.connection = newConnection;
                return newConnection;
            });
        });
    }
    return connectionPromise;
}
exports.connect = connect;
