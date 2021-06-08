"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleHelpCmd = void 0;
const types_1 = require("../types");
const utils_1 = require("../../../utils");
const getApplyingEntries_1 = require("../util/getApplyingEntries");
exports.RoleHelpCmd = types_1.selfGrantableRolesCmd({
    trigger: ["role help", "role"],
    permission: null,
    async run({ message: msg, pluginData }) {
        const applyingEntries = await getApplyingEntries_1.getApplyingEntries(pluginData, msg);
        if (applyingEntries.length === 0)
            return;
        const allPrimaryAliases = [];
        for (const entry of applyingEntries) {
            for (const aliases of Object.values(entry.roles)) {
                if (aliases[0]) {
                    allPrimaryAliases.push(aliases[0]);
                }
            }
        }
        const prefix = pluginData.fullConfig.prefix;
        const [firstRole, secondRole] = allPrimaryAliases;
        const help1 = utils_1.asSingleLine(`
      To give yourself a role, type e.g. \`${prefix}role ${firstRole}\` where **${firstRole}** is the role you want.
      ${secondRole ? `You can also add multiple roles at once, e.g. \`${prefix}role ${firstRole} ${secondRole}\`` : ""}
    `);
        const help2 = utils_1.asSingleLine(`
      To remove a role, type \`${prefix}role remove ${firstRole}\`,
      again replacing **${firstRole}** with the role you want to remove.
    `);
        const helpMessage = utils_1.trimLines(`
      ${help1}

      ${help2}

      **Roles available to you:**
      ${allPrimaryAliases.join(", ")}
    `);
        const helpEmbed = {
            title: "How to get roles",
            description: helpMessage,
            color: parseInt("42bff4", 16),
        };
        msg.channel.createMessage({ embed: helpEmbed });
    },
});
