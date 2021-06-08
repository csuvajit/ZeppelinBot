"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEvent = void 0;
const pluginUtils_1 = require("../../../pluginUtils");
const ActionError_1 = require("../ActionError");
const addRoleAction_1 = require("../actions/addRoleAction");
const createCaseAction_1 = require("../actions/createCaseAction");
const moveToVoiceChannelAction_1 = require("../actions/moveToVoiceChannelAction");
const messageAction_1 = require("../actions/messageAction");
const makeRoleMentionableAction_1 = require("../actions/makeRoleMentionableAction");
const makeRoleUnmentionableAction_1 = require("../actions/makeRoleUnmentionableAction");
const setChannelPermissionOverrides_1 = require("../actions/setChannelPermissionOverrides");
async function runEvent(pluginData, event, eventData, values) {
    try {
        for (const action of event.actions) {
            if (action.type === "add_role") {
                await addRoleAction_1.addRoleAction(pluginData, action, values, event, eventData);
            }
            else if (action.type === "create_case") {
                await createCaseAction_1.createCaseAction(pluginData, action, values, event, eventData);
            }
            else if (action.type === "move_to_vc") {
                await moveToVoiceChannelAction_1.moveToVoiceChannelAction(pluginData, action, values, event, eventData);
            }
            else if (action.type === "message") {
                await messageAction_1.messageAction(pluginData, action, values);
            }
            else if (action.type === "make_role_mentionable") {
                await makeRoleMentionableAction_1.makeRoleMentionableAction(pluginData, action, values, event, eventData);
            }
            else if (action.type === "make_role_unmentionable") {
                await makeRoleUnmentionableAction_1.makeRoleUnmentionableAction(pluginData, action, values, event, eventData);
            }
            else if (action.type === "set_channel_permission_overrides") {
                await setChannelPermissionOverrides_1.setChannelPermissionOverridesAction(pluginData, action, values, event, eventData);
            }
        }
    }
    catch (e) {
        if (e instanceof ActionError_1.ActionError) {
            if (event.trigger.type === "command") {
                pluginUtils_1.sendErrorMessage(pluginData, eventData.msg.channel, e.message);
            }
            else {
                // TODO: Where to log action errors from other kinds of triggers?
            }
            return;
        }
        throw e;
    }
}
exports.runEvent = runEvent;
