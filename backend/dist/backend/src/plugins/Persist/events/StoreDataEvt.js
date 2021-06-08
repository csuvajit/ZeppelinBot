"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreDataEvt = void 0;
const types_1 = require("../types");
const lodash_intersection_1 = __importDefault(require("lodash.intersection"));
exports.StoreDataEvt = types_1.persistEvt({
    event: "guildMemberRemove",
    async listener(meta) {
        const member = meta.args.member;
        const pluginData = meta.pluginData;
        let persist = false;
        const persistData = {};
        const config = await pluginData.config.getForUser(member.user);
        const persistedRoles = config.persisted_roles;
        if (persistedRoles.length && member.roles) {
            const rolesToPersist = lodash_intersection_1.default(persistedRoles, member.roles);
            if (rolesToPersist.length) {
                persist = true;
                persistData.roles = rolesToPersist;
            }
        }
        if (config.persist_nicknames && member.nick) {
            persist = true;
            persistData.nickname = member.nick;
        }
        if (persist) {
            pluginData.state.persistedData.set(member.id, persistData);
        }
    },
});
