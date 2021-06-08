"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedMessage = void 0;
const typeorm_1 = require("typeorm");
const encryptedJsonTransformer_1 = require("../encryptedJsonTransformer");
let SavedMessage = class SavedMessage {
};
__decorate([
    typeorm_1.Column(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], SavedMessage.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SavedMessage.prototype, "guild_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SavedMessage.prototype, "channel_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SavedMessage.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], SavedMessage.prototype, "is_bot", void 0);
__decorate([
    typeorm_1.Column({
        type: "mediumtext",
        transformer: encryptedJsonTransformer_1.createEncryptedJsonTransformer(),
    }),
    __metadata("design:type", Object)
], SavedMessage.prototype, "data", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SavedMessage.prototype, "posted_at", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SavedMessage.prototype, "deleted_at", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], SavedMessage.prototype, "is_permanent", void 0);
SavedMessage = __decorate([
    typeorm_1.Entity("messages")
], SavedMessage);
exports.SavedMessage = SavedMessage;
