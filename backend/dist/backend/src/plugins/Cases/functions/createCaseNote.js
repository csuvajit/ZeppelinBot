"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCaseNote = void 0;
const RecoverablePluginError_1 = require("../../../RecoverablePluginError");
const resolveCaseId_1 = require("./resolveCaseId");
const postToCaseLogChannel_1 = require("./postToCaseLogChannel");
const utils_1 = require("../../../utils");
async function createCaseNote(pluginData, args) {
    const theCase = await pluginData.state.cases.find(resolveCaseId_1.resolveCaseId(args.caseId));
    if (!theCase) {
        throw new RecoverablePluginError_1.RecoverablePluginError(RecoverablePluginError_1.ERRORS.UNKNOWN_NOTE_CASE);
    }
    const mod = await utils_1.resolveUser(pluginData.client, args.modId);
    if (mod instanceof utils_1.UnknownUser) {
        throw new RecoverablePluginError_1.RecoverablePluginError(RecoverablePluginError_1.ERRORS.INVALID_USER);
    }
    const modName = `${mod.username}#${mod.discriminator}`;
    let body = args.body;
    // Add note details to the beginning of the note
    if (args.noteDetails && args.noteDetails.length) {
        body = args.noteDetails.map(d => `__[${d}]__`).join(" ") + " " + body;
    }
    await pluginData.state.cases.createNote(theCase.id, {
        mod_id: mod.id,
        mod_name: modName,
        body: body || "",
    });
    if (theCase.mod_id == null) {
        // If the case has no moderator information, assume the first one to add a note to it did the action
        await pluginData.state.cases.update(theCase.id, {
            mod_id: mod.id,
            mod_name: modName,
        });
    }
    const archiveLinkMatch = body && body.match(/(?<=\/archives\/)[a-zA-Z0-9\-]+/g);
    if (archiveLinkMatch) {
        for (const archiveId of archiveLinkMatch) {
            pluginData.state.archives.makePermanent(archiveId);
        }
    }
    const modConfig = await pluginData.config.getForUser(mod);
    if (args.postInCaseLogOverride === true ||
        ((!args.automatic || modConfig.log_automatic_actions) && args.postInCaseLogOverride !== false)) {
        await postToCaseLogChannel_1.postCaseToCaseLogChannel(pluginData, theCase.id);
    }
}
exports.createCaseNote = createCaseNote;
