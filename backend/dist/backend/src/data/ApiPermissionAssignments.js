"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPermissionAssignments = exports.ApiPermissionTypes = void 0;
const typeorm_1 = require("typeorm");
const ApiPermissionAssignment_1 = require("./entities/ApiPermissionAssignment");
const BaseRepository_1 = require("./BaseRepository");
var ApiPermissionTypes;
(function (ApiPermissionTypes) {
    ApiPermissionTypes["User"] = "USER";
    ApiPermissionTypes["Role"] = "ROLE";
})(ApiPermissionTypes = exports.ApiPermissionTypes || (exports.ApiPermissionTypes = {}));
class ApiPermissionAssignments extends BaseRepository_1.BaseRepository {
    constructor() {
        super();
        this.apiPermissions = typeorm_1.getRepository(ApiPermissionAssignment_1.ApiPermissionAssignment);
    }
    getByGuildId(guildId) {
        return this.apiPermissions.find({
            where: {
                guild_id: guildId,
            },
        });
    }
    getByUserId(userId) {
        return this.apiPermissions.find({
            where: {
                type: ApiPermissionTypes.User,
                target_id: userId,
            },
        });
    }
    getByGuildAndUserId(guildId, userId) {
        return this.apiPermissions.findOne({
            where: {
                guild_id: guildId,
                type: ApiPermissionTypes.User,
                target_id: userId,
            },
        });
    }
    addUser(guildId, userId, permissions) {
        return this.apiPermissions.insert({
            guild_id: guildId,
            type: ApiPermissionTypes.User,
            target_id: userId,
            permissions,
        });
    }
    removeUser(guildId, userId) {
        return this.apiPermissions.delete({ guild_id: guildId, type: ApiPermissionTypes.User, target_id: userId });
    }
}
exports.ApiPermissionAssignments = ApiPermissionAssignments;
