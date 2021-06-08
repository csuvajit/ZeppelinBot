"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initArchives = void 0;
const GuildArchives_1 = require("../data/GuildArchives");
const responses_1 = require("./responses");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function initArchives(app) {
    const archives = new GuildArchives_1.GuildArchives(null);
    // Legacy redirect
    app.get("/spam-logs/:id", (req, res) => {
        res.redirect("/archives/" + req.params.id);
    });
    app.get("/archives/:id", async (req, res) => {
        const archive = await archives.find(req.params.id);
        if (!archive)
            return responses_1.notFound(res);
        let body = archive.body;
        // Add some metadata at the end of the log file (but only if it doesn't already have it directly in the body)
        // TODO: Use server timezone / date formats
        if (archive.body.indexOf("Log file generated on") === -1) {
            const createdAt = moment_timezone_1.default.utc(archive.created_at).format("YYYY-MM-DD [at] HH:mm:ss [(+00:00)]");
            body += `\n\nLog file generated on ${createdAt}`;
            if (archive.expires_at !== null) {
                const expiresAt = moment_timezone_1.default.utc(archive.expires_at).format("YYYY-MM-DD [at] HH:mm:ss [(+00:00)]");
                body += `\nExpires at ${expiresAt}`;
            }
        }
        res.setHeader("Content-Type", "text/plain; charset=UTF-8");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.end(body);
    });
}
exports.initArchives = initArchives;
