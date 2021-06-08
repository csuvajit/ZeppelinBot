"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGuildRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class BaseGuildRepository extends BaseRepository_1.BaseRepository {
    constructor(guildId) {
        super();
        this.guildId = guildId;
    }
    /**
     * Returns a cached instance of the inheriting class for the specified guildId,
     * or creates a new instance if one doesn't exist yet
     */
    static getGuildInstance(guildId) {
        if (!this.guildInstances) {
            this.guildInstances = new Map();
        }
        if (!this.guildInstances.has(guildId)) {
            this.guildInstances.set(guildId, new this(guildId));
        }
        return this.guildInstances.get(guildId);
    }
}
exports.BaseGuildRepository = BaseGuildRepository;
