"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUserInfo = void 0;
const typeorm_1 = require("typeorm");
const ApiUserInfo_1 = require("./entities/ApiUserInfo");
const BaseRepository_1 = require("./BaseRepository");
const db_1 = require("./db");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const utils_1 = require("../utils");
class ApiUserInfo extends BaseRepository_1.BaseRepository {
    constructor() {
        super();
        this.apiUserInfo = typeorm_1.getRepository(ApiUserInfo_1.ApiUserInfo);
    }
    get(id) {
        return this.apiUserInfo.findOne({
            where: {
                id,
            },
        });
    }
    update(id, data) {
        return db_1.connection.transaction(async (entityManager) => {
            const repo = entityManager.getRepository(ApiUserInfo_1.ApiUserInfo);
            const existingInfo = await repo.findOne({ where: { id } });
            const updatedAt = moment_timezone_1.default.utc().format(utils_1.DBDateFormat);
            if (existingInfo) {
                await repo.update({ id }, { data, updated_at: updatedAt });
            }
            else {
                await repo.insert({ id, data, updated_at: updatedAt });
            }
        });
    }
}
exports.ApiUserInfo = ApiUserInfo;
