"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarboardPlugin = void 0;
const types_1 = require("./types");
const ZeppelinPluginBlueprint_1 = require("../ZeppelinPluginBlueprint");
const utils_1 = require("../../utils");
const GuildSavedMessages_1 = require("../../data/GuildSavedMessages");
const GuildStarboardMessages_1 = require("../../data/GuildStarboardMessages");
const GuildStarboardReactions_1 = require("../../data/GuildStarboardReactions");
const onMessageDelete_1 = require("./util/onMessageDelete");
const MigratePinsCmd_1 = require("./commands/MigratePinsCmd");
const StarboardReactionAddEvt_1 = require("./events/StarboardReactionAddEvt");
const StarboardReactionRemoveEvts_1 = require("./events/StarboardReactionRemoveEvts");
const defaultOptions = {
    config: {
        can_migrate: false,
        boards: {},
    },
    overrides: [
        {
            level: ">=100",
            config: {
                can_migrate: true,
            },
        },
    ],
};
exports.StarboardPlugin = ZeppelinPluginBlueprint_1.zeppelinGuildPlugin()({
    name: "starboard",
    showInDocs: true,
    configSchema: types_1.ConfigSchema,
    defaultOptions,
    info: {
        prettyName: "Starboard",
        description: utils_1.trimPluginDescription(`
      This plugin allows you to set up starboards on your server. Starboards are like user voted pins where messages with enough reactions get immortalized on a "starboard" channel.
    `),
        configurationGuide: utils_1.trimPluginDescription(`
      ### Note on emojis
      To specify emoji in the config, you need to use the emoji's "raw form".
      To obtain this, post the emoji with a backslash in front of it.
      
      - Example with a default emoji: "\:star:" => "⭐"
      - Example with a custom emoji: "\:mrvnSmile:" => "<:mrvnSmile:543000534102310933>"

      ### Basic starboard
      Any message on the server that gets 5 star reactions will be posted into the starboard channel (604342689038729226).
      
      ~~~yml
      starboard:
        config:
          boards:
            basic:
              channel_id: "604342689038729226"
              stars_required: 5
      ~~~
      
      ### Basic starboard with custom color
      Any message on the server that gets 5 star reactions will be posted into the starboard channel (604342689038729226), with the given color (0x87CEEB).
      
      ~~~yml
      starboard:
        config:
          boards:
            basic:
              channel_id: "604342689038729226"
              stars_required: 5
              color: 0x87CEEB
      ~~~
      
      ### Custom star emoji
      This is identical to the basic starboard above, but accepts two emoji: the regular star and a custom :mrvnSmile: emoji
      
      ~~~yml
      starboard:
        config:
          boards:
            basic:
              channel_id: "604342689038729226"
              star_emoji: ["⭐", "<:mrvnSmile:543000534102310933>"]
              stars_required: 5
      ~~~
      
      ### Limit starboard to a specific channel
      This is identical to the basic starboard above, but only works from a specific channel (473087035574321152).
      
      ~~~yml
      starboard:
        config:
          boards:
            basic:
              enabled: false # The starboard starts disabled and is then enabled in a channel override below
              channel_id: "604342689038729226"
              stars_required: 5
        overrides:
          - channel: "473087035574321152"
            config:
              boards:
                basic:
                  enabled: true
      ~~~

      ### Limit starboard to a specific level (and above)
      This is identical to the basic starboard above, but only works for a specific level (>=50).
      
      ~~~yml
      starboard:
        config:
          boards:
            levelonly:
              enabled: false # The starboard starts disabled and is then enabled in a level override below
              channel_id: "604342689038729226"
              stars_required: 1
        overrides:
          - level: ">=50"
            config:
              boards:
                levelonly:
                  enabled: true
      ~~~
    `),
    },
    configPreprocessor(options) {
        if (options.config?.boards) {
            for (const [name, opts] of Object.entries(options.config.boards)) {
                options.config.boards[name] = Object.assign({}, types_1.defaultStarboardOpts, options.config.boards[name]);
            }
        }
        return options;
    },
    // prettier-ignore
    commands: [
        MigratePinsCmd_1.MigratePinsCmd,
    ],
    // prettier-ignore
    events: [
        StarboardReactionAddEvt_1.StarboardReactionAddEvt,
        StarboardReactionRemoveEvts_1.StarboardReactionRemoveEvt,
        StarboardReactionRemoveEvts_1.StarboardReactionRemoveAllEvt,
    ],
    beforeLoad(pluginData) {
        const { state, guild } = pluginData;
        state.savedMessages = GuildSavedMessages_1.GuildSavedMessages.getGuildInstance(guild.id);
        state.starboardMessages = GuildStarboardMessages_1.GuildStarboardMessages.getGuildInstance(guild.id);
        state.starboardReactions = GuildStarboardReactions_1.GuildStarboardReactions.getGuildInstance(guild.id);
    },
    afterLoad(pluginData) {
        const { state } = pluginData;
        state.onMessageDeleteFn = msg => onMessageDelete_1.onMessageDelete(pluginData, msg);
        state.savedMessages.events.on("delete", state.onMessageDeleteFn);
    },
    beforeUnload(pluginData) {
        pluginData.state.savedMessages.events.off("delete", pluginData.state.onMessageDeleteFn);
    },
});
