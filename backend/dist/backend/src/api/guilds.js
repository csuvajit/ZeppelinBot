"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGuildsAPI = void 0;
const express_1 = __importDefault(require("express"));
const AllowedGuilds_1 = require("../data/AllowedGuilds");
const responses_1 = require("./responses");
const Configs_1 = require("../data/Configs");
const configValidator_1 = require("../configValidator");
const js_yaml_1 = __importStar(require("js-yaml"));
const auth_1 = require("./auth");
const apiPermissions_1 = require("@shared/apiPermissions");
const permissions_1 = require("./permissions");
const ApiPermissionAssignments_1 = require("../data/ApiPermissionAssignments");
const apiPermissionAssignments = new ApiPermissionAssignments_1.ApiPermissionAssignments();
function initGuildsAPI(app) {
    const allowedGuilds = new AllowedGuilds_1.AllowedGuilds();
    const configs = new Configs_1.Configs();
    const guildRouter = express_1.default.Router();
    guildRouter.use(...auth_1.apiTokenAuthHandlers());
    guildRouter.get("/available", async (req, res) => {
        const guilds = await allowedGuilds.getForApiUser(req.user.userId);
        res.json(guilds);
    });
    guildRouter.get("/:guildId", async (req, res) => {
        if (!(await permissions_1.hasGuildPermission(req.user.userId, req.params.guildId, apiPermissions_1.ApiPermissions.ViewGuild))) {
            return responses_1.unauthorized(res);
        }
        const guild = await allowedGuilds.find(req.params.guildId);
        res.json(guild);
    });
    guildRouter.post("/:guildId/check-permission", async (req, res) => {
        const permission = req.body.permission;
        const hasPermission = await permissions_1.hasGuildPermission(req.user.userId, req.params.guildId, permission);
        res.json({ result: hasPermission });
    });
    guildRouter.get("/:guildId/config", permissions_1.requireGuildPermission(apiPermissions_1.ApiPermissions.ReadConfig), async (req, res) => {
        const config = await configs.getActiveByKey(`guild-${req.params.guildId}`);
        res.json({ config: config ? config.config : "" });
    });
    guildRouter.post("/:guildId/config", permissions_1.requireGuildPermission(apiPermissions_1.ApiPermissions.EditConfig), async (req, res) => {
        let config = req.body.config;
        if (config == null)
            return responses_1.clientError(res, "No config supplied");
        config = config.trim() + "\n"; // Normalize start/end whitespace in the config
        const currentConfig = await configs.getActiveByKey(`guild-${req.params.guildId}`);
        if (currentConfig && config === currentConfig.config) {
            return responses_1.ok(res);
        }
        // Validate config
        let parsedConfig;
        try {
            parsedConfig = js_yaml_1.default.safeLoad(config);
        }
        catch (e) {
            if (e instanceof js_yaml_1.YAMLException) {
                return res.status(400).json({ errors: [e.message] });
            }
            // tslint:disable-next-line:no-console
            console.error("Error when loading YAML: " + e.message);
            return responses_1.serverError(res, "Server error");
        }
        if (parsedConfig == null) {
            parsedConfig = {};
        }
        const error = await configValidator_1.validateGuildConfig(parsedConfig);
        if (error) {
            return res.status(422).json({ errors: [error] });
        }
        await configs.saveNewRevision(`guild-${req.params.guildId}`, config, req.user.userId);
        responses_1.ok(res);
    });
    guildRouter.get("/:guildId/permissions", permissions_1.requireGuildPermission(apiPermissions_1.ApiPermissions.ManageAccess), async (req, res) => {
        const permissions = await apiPermissionAssignments.getByGuildId(req.params.guildId);
        res.json(permissions);
    });
    app.use("/guilds", guildRouter);
}
exports.initGuildsAPI = initGuildsAPI;
