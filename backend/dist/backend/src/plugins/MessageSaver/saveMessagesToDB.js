"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessagesToDB = void 0;
async function saveMessagesToDB(pluginData, channel, ids) {
    const failed = [];
    for (const id of ids) {
        const savedMessage = await pluginData.state.savedMessages.find(id);
        if (savedMessage)
            continue;
        let thisMsg;
        try {
            thisMsg = await channel.getMessage(id);
            if (!thisMsg) {
                failed.push(id);
                continue;
            }
            await pluginData.state.savedMessages.createFromMsg(thisMsg, { is_permanent: true });
        }
        catch {
            failed.push(id);
        }
    }
    return {
        savedCount: ids.length - failed.length,
        failed,
    };
}
exports.saveMessagesToDB = saveMessagesToDB;
