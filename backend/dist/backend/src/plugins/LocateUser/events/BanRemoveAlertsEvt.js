"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildBanRemoveAlertsEvt = void 0;
const types_1 = require("../types");
exports.GuildBanRemoveAlertsEvt = types_1.locateUserEvt({
    event: "guildBanAdd",
    async listener(meta) {
        const alerts = await meta.pluginData.state.alerts.getAlertsByUserId(meta.args.user.id);
        alerts.forEach(alert => {
            meta.pluginData.state.alerts.delete(alert.id);
        });
    },
});
