"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiLogins = void 0;
const typeorm_1 = require("typeorm");
const ApiLogin_1 = require("./entities/ApiLogin");
const BaseRepository_1 = require("./BaseRepository");
const crypto_1 = __importDefault(require("crypto"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// tslint:disable-next-line:no-submodule-imports
const v4_1 = __importDefault(require("uuid/v4"));
const utils_1 = require("../utils");
const LOGIN_EXPIRY_TIME = 1 * utils_1.DAYS;
class ApiLogins extends BaseRepository_1.BaseRepository {
    constructor() {
        super();
        this.apiLogins = typeorm_1.getRepository(ApiLogin_1.ApiLogin);
    }
    async getUserIdByApiKey(apiKey) {
        const [loginId, token] = apiKey.split(".");
        if (!loginId || !token) {
            return null;
        }
        const login = await this.apiLogins
            .createQueryBuilder()
            .where("id = :id", { id: loginId })
            .andWhere("expires_at > NOW()")
            .getOne();
        if (!login) {
            return null;
        }
        const hash = crypto_1.default.createHash("sha256");
        hash.update(loginId + token); // Remember to use loginId as the salt
        const hashedToken = hash.digest("hex");
        if (hashedToken !== login.token) {
            return null;
        }
        return login.user_id;
    }
    async addLogin(userId) {
        // Generate random login id
        let loginId;
        while (true) {
            loginId = v4_1.default();
            const existing = await this.apiLogins.findOne({
                where: {
                    id: loginId,
                },
            });
            if (!existing)
                break;
        }
        // Generate token
        const token = v4_1.default();
        const hash = crypto_1.default.createHash("sha256");
        hash.update(loginId + token); // Use loginId as a salt
        const hashedToken = hash.digest("hex");
        // Save this to the DB
        await this.apiLogins.insert({
            id: loginId,
            token: hashedToken,
            user_id: userId,
            logged_in_at: moment_timezone_1.default.utc().format(utils_1.DBDateFormat),
            expires_at: moment_timezone_1.default
                .utc()
                .add(LOGIN_EXPIRY_TIME, "ms")
                .format(utils_1.DBDateFormat),
        });
        return `${loginId}.${token}`;
    }
    expireApiKey(apiKey) {
        const [loginId, token] = apiKey.split(".");
        if (!loginId || !token)
            return;
        return this.apiLogins.update({ id: loginId }, {
            expires_at: moment_timezone_1.default.utc().format(utils_1.DBDateFormat),
        });
    }
    async refreshApiKeyExpiryTime(apiKey) {
        const [loginId, token] = apiKey.split(".");
        if (!loginId || !token)
            return;
        await this.apiLogins.update({ id: loginId }, {
            expires_at: moment_timezone_1.default()
                .utc()
                .add(LOGIN_EXPIRY_TIME, "ms")
                .format(utils_1.DBDateFormat),
        });
    }
}
exports.ApiLogins = ApiLogins;
