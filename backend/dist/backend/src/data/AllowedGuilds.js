"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedGuilds = void 0;
const AllowedGuild_1 = require("./entities/AllowedGuild");
const typeorm_1 = require("typeorm");
const BaseRepository_1 = require("./BaseRepository");
const ApiPermissionAssignments_1 = require("./ApiPermissionAssignments");
class AllowedGuilds extends BaseRepository_1.BaseRepository {
    constructor() {
        super();
        this.allowedGuilds = typeorm_1.getRepository(AllowedGuild_1.AllowedGuild);
    }
    async isAllowed(guildId) {
        const count = await this.allowedGuilds.count({
            where: {
                id: guildId,
            },
        });
        return count !== 0;
    }
    find(guildId) {
        return this.allowedGuilds.findOne(guildId);
    }
    getForApiUser(userId) {
        return this.allowedGuilds
            .createQueryBuilder("allowed_guilds")
            .innerJoin("api_permissions", "api_permissions", "api_permissions.guild_id = allowed_guilds.id AND api_permissions.type = :type AND api_permissions.target_id = :userId", { type: ApiPermissionAssignments_1.ApiPermissionTypes.User, userId })
            .getMany();
    }
    updateInfo(id, name, icon, ownerId) {
        return this.allowedGuilds.update({ id }, { name, icon, owner_id: ownerId });
    }
    add(id, data = {}) {
        return this.allowedGuilds.insert({
            name: "Server",
            icon: null,
            owner_id: "0",
            ...data,
            id,
        });
    }
    remove(id) {
        return this.allowedGuilds.delete({ id });
    }
}
exports.AllowedGuilds = AllowedGuilds;
