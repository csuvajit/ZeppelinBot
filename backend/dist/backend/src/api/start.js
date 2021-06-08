"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = require("./responses");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./auth");
const guilds_1 = require("./guilds");
const archives_1 = require("./archives");
const docs_1 = require("./docs");
const passport_oauth2_1 = require("passport-oauth2");
const app = express_1.default();
app.use(cors_1.default({
    origin: process.env.DASHBOARD_URL,
}));
app.use(express_1.default.json());
auth_1.initAuth(app);
guilds_1.initGuildsAPI(app);
archives_1.initArchives(app);
docs_1.initDocs(app);
// Default route
app.get("/", (req, res) => {
    res.json({ status: "cookies", with: "milk" });
});
// Error response
app.use((err, req, res, next) => {
    if (err instanceof passport_oauth2_1.TokenError) {
        responses_1.clientError(res, "Invalid code");
    }
    else {
        console.error(err); // tslint:disable-line
        responses_1.error(res, "Server error", err.status || 500);
    }
});
// 404 response
app.use((req, res, next) => {
    return responses_1.notFound(res);
});
const port = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;
app.listen(port, "0.0.0.0", () => console.log(`API server listening on port ${port}`)); // tslint:disable-line
