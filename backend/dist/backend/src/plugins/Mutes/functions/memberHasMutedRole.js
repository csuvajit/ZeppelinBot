"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberHasMutedRole = void 0;
function memberHasMutedRole(pluginData, member) {
    const muteRole = pluginData.config.get().mute_role;
    return muteRole ? member.roles.includes(muteRole) : false;
}
exports.memberHasMutedRole = memberHasMutedRole;
