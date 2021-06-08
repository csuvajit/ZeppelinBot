"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supporters = void 0;
const BaseRepository_1 = require("./BaseRepository");
const typeorm_1 = require("typeorm");
const Supporter_1 = require("./entities/Supporter");
class Supporters extends BaseRepository_1.BaseRepository {
    constructor() {
        super();
        this.supporters = typeorm_1.getRepository(Supporter_1.Supporter);
    }
    getAll() {
        return this.supporters.find();
    }
}
exports.Supporters = Supporters;
