"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStaff = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const staff_1 = require("../staff");
function initStaff(app) {
    const staffRouter = express_1.default.Router();
    staffRouter.use(...auth_1.apiTokenAuthHandlers());
    staffRouter.get("/status", (req, res) => {
        const userIsStaff = staff_1.isStaff(req.user.userId);
        res.json({ isStaff: userIsStaff });
    });
    app.use("/staff", staffRouter);
}
exports.initStaff = initStaff;
