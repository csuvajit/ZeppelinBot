"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiTokenAuthHandlers = exports.initAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_oauth2_1 = __importDefault(require("passport-oauth2"));
const passport_custom_1 = require("passport-custom");
const ApiLogins_1 = require("../data/ApiLogins");
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const https_1 = __importDefault(require("https"));
const ApiUserInfo_1 = require("../data/ApiUserInfo");
const ApiPermissionAssignments_1 = require("../data/ApiPermissionAssignments");
const responses_1 = require("./responses");
const DISCORD_API_URL = "https://discord.com/api";
function simpleDiscordAPIRequest(bearerToken, path) {
    return new Promise((resolve, reject) => {
        const request = https_1.default.get(`${DISCORD_API_URL}/${path}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        }, res => {
            if (res.statusCode !== 200) {
                reject(new Error(`Discord API error ${res.statusCode}`));
                return;
            }
            let rawData = "";
            res.on("data", data => (rawData += data));
            res.on("end", () => {
                resolve(JSON.parse(rawData));
            });
        });
        request.on("error", err => reject(err));
    });
}
function initAuth(app) {
    app.use(passport_1.default.initialize());
    if (!process.env.CLIENT_ID) {
        throw new Error("Auth: CLIENT ID missing");
    }
    if (!process.env.CLIENT_SECRET) {
        throw new Error("Auth: CLIENT SECRET missing");
    }
    if (!process.env.OAUTH_CALLBACK_URL) {
        throw new Error("Auth: OAUTH CALLBACK URL missing");
    }
    if (!process.env.DASHBOARD_URL) {
        throw new Error("DASHBOARD_URL missing!");
    }
    passport_1.default.serializeUser((user, done) => done(null, user));
    passport_1.default.deserializeUser((user, done) => done(null, user));
    const apiLogins = new ApiLogins_1.ApiLogins();
    const apiUserInfo = new ApiUserInfo_1.ApiUserInfo();
    const apiPermissionAssignments = new ApiPermissionAssignments_1.ApiPermissionAssignments();
    // Initialize API tokens
    passport_1.default.use("api-token", new passport_custom_1.Strategy(async (req, cb) => {
        const apiKey = req.header("X-Api-Key");
        if (!apiKey)
            return cb("API key missing");
        const userId = await apiLogins.getUserIdByApiKey(apiKey);
        if (userId) {
            void apiLogins.refreshApiKeyExpiryTime(apiKey); // Refresh expiry time in the background
            return cb(null, { apiKey, userId });
        }
        cb("API key not found");
    }));
    // Initialize OAuth2 for Discord login
    // When the user logs in through OAuth2, we create them a "login" (= api token) and update their user info in the DB
    passport_1.default.use(new passport_oauth2_1.default({
        authorizationURL: "https://discord.com/api/oauth2/authorize",
        tokenURL: "https://discord.com/api/oauth2/token",
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.OAUTH_CALLBACK_URL,
        scope: ["identify"],
    }, async (accessToken, refreshToken, profile, cb) => {
        const user = await simpleDiscordAPIRequest(accessToken, "users/@me");
        // Make sure the user is able to access at least 1 guild
        const permissions = await apiPermissionAssignments.getByUserId(user.id);
        if (permissions.length === 0) {
            cb(null, {});
            return;
        }
        // Generate API key
        const apiKey = await apiLogins.addLogin(user.id);
        const userData = lodash_pick_1.default(user, ["username", "discriminator", "avatar"]);
        await apiUserInfo.update(user.id, userData);
        // TODO: Revoke access token, we don't need it anymore
        cb(null, { apiKey });
    }));
    app.get("/auth/login", passport_1.default.authenticate("oauth2"));
    app.get("/auth/oauth-callback", passport_1.default.authenticate("oauth2", { failureRedirect: "/", session: false }), (req, res) => {
        if (req.user && req.user.apiKey) {
            res.redirect(`${process.env.DASHBOARD_URL}/login-callback/?apiKey=${req.user.apiKey}`);
        }
        else {
            res.redirect(`${process.env.DASHBOARD_URL}/login-callback/?error=noAccess`);
        }
    });
    app.post("/auth/validate-key", async (req, res) => {
        const key = req.body.key;
        if (!key) {
            return res.status(400).json({ error: "No key supplied" });
        }
        const userId = await apiLogins.getUserIdByApiKey(key);
        if (!userId) {
            return res.json({ valid: false });
        }
        res.json({ valid: true });
    });
    app.post("/auth/logout", ...apiTokenAuthHandlers(), async (req, res) => {
        await apiLogins.expireApiKey(req.user.apiKey);
        return responses_1.ok(res);
    });
    // API route to refresh the given API token's expiry time
    // The actual refreshing happens in the api-token passport strategy above, so we just return 200 OK here
    app.post("/auth/refresh", ...apiTokenAuthHandlers(), (req, res) => {
        return responses_1.ok(res);
    });
}
exports.initAuth = initAuth;
function apiTokenAuthHandlers() {
    return [
        passport_1.default.authenticate("api-token", { failWithError: true }),
        (err, req, res, next) => {
            return res.status(401).json({ error: err.message });
        },
    ];
}
exports.apiTokenAuthHandlers = apiTokenAuthHandlers;
