"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enablePingableRoles = void 0;
function enablePingableRoles(pluginData, pingableRoles) {
    for (const pingableRole of pingableRoles) {
        const role = pluginData.guild.roles.get(pingableRole.role_id);
        if (!role)
            continue;
        role.edit({
            mentionable: true,
        }, "Enable pingable role");
    }
}
exports.enablePingableRoles = enablePingableRoles;
