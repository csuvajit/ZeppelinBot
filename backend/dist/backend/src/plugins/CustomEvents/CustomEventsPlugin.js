"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEventsPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const knub_1 = require("knub");
const commandTypes_1 = require("../../commandTypes");
const utils_1 = require("../../utils");
const runEvent_1 = require("./functions/runEvent");
const defaultOptions = {
    config: {
        events: {},
    },
};
exports.CustomEventsPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "custom_events",
    showInDocs: false,
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    afterLoad(pluginData) {
        const config = pluginData.config.get();
        for (const [key, event] of Object.entries(config.events)) {
            if (event.trigger.type === "command") {
                const signature = event.trigger.params ? knub_1.parseSignature(event.trigger.params, commandTypes_1.commandTypes) : {};
                const eventCommand = knub_1.typedGuildCommand({
                    trigger: event.trigger.name,
                    permission: `events.${key}.trigger.can_use`,
                    signature,
                    run({ message, args }) {
                        const strippedMsg = utils_1.stripObjectToScalars(message, ["channel", "author"]);
                        runEvent_1.runEvent(pluginData, event, { msg: message, args }, { args, msg: strippedMsg });
                    },
                });
                pluginData.commands.add(eventCommand);
            }
        }
    },
    beforeUnload() {
        // TODO: Run clearTriggers() once we actually have something there
    },
});
