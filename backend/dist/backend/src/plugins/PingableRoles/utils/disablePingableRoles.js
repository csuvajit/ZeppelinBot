"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disablePingableRoles = void 0;
function disablePingableRoles(pluginData, pingableRoles) {
    for (const pingableRole of pingableRoles) {
        const role = pluginData.guild.roles.get(pingableRole.role_id);
        if (!role)
            continue;
        role.edit({
            mentionable: false,
        }, "Disable pingable role");
    }
}
exports.disablePingableRoles = disablePingableRoles;
