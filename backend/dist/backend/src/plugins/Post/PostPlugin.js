"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostPlugin = void 0;
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const types_1 = require("./types");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildScheduledPosts_1 = require("../../data/GuildScheduledPosts");
const GuildLogs_1 = require("../../data/GuildLogs");
const PostCmd_1 = require("./commands/PostCmd");
const PostEmbedCmd_1 = require("./commands/PostEmbedCmd");
const EditCmd_1 = require("./commands/EditCmd");
const EditEmbedCmd_1 = require("./commands/EditEmbedCmd");
const ScheduledPostsShowCmd_1 = require("./commands/ScheduledPostsShowCmd");
const ScheduledPostsListCmd_1 = require("./commands/ScheduledPostsListCmd");
const SchedluedPostsDeleteCmd_1 = require("./commands/SchedluedPostsDeleteCmd");
const scheduledPostLoop_1 = require("./util/scheduledPostLoop");
const TimeAndDatePlugin_1 = require("../TimeAndDate/TimeAndDatePlugin");
const defaultOptions = {
    config: {
        can_post: false,
    },
    overrides: [
        {
            level: ">=100",
            config: {
                can_post: true,
            },
        },
    ],
};
exports.PostPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "post",
    showInDocs: true,
    info: {
        prettyName: "Post",
    },
    dependencies: [TimeAndDatePlugin_1.TimeAndDatePlugin],
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    // prettier-ignore
    commands: [
        PostCmd_1.PostCmd,
        PostEmbedCmd_1.PostEmbedCmd,
        EditCmd_1.EditCmd,
        EditEmbedCmd_1.EditEmbedCmd,
        ScheduledPostsShowCmd_1.ScheduledPostsShowCmd,
        ScheduledPostsListCmd_1.ScheduledPostsListCmd,
        SchedluedPostsDeleteCmd_1.ScheduledPostsDeleteCmd,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.scheduledPosts = GuildScheduledPosts_1.GuildScheduledPosts.getGuildInstance(guild.id);
        state.logs = new GuildLogs_1.GuildLogs(guild.id);
    },
    afterLoad(pluginData) {
        scheduledPostLoop_1.scheduledPostLoop(pluginData);
    },
    beforeUnload(pluginData) {
        clearTimeout(pluginData.state.scheduledPostLoopTimeout);
    },
});
