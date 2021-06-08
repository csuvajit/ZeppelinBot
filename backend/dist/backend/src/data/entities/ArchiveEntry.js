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
exports.ArchiveEntry = void 0;
const typeorm_1 = require("typeorm");
const encryptedTextTransformer_1 = require("../encryptedTextTransformer");
let ArchiveEntry = class ArchiveEntry {
};
__decorate([
    typeorm_1.Column(),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], ArchiveEntry.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ArchiveEntry.prototype, "guild_id", void 0);
__decorate([
    typeorm_1.Column({
        type: "mediumtext",
        transformer: encryptedTextTransformer_1.createEncryptedTextTransformer(),
    }),
    __metadata("design:type", String)
], ArchiveEntry.prototype, "body", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ArchiveEntry.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], ArchiveEntry.prototype, "expires_at", void 0);
ArchiveEntry = __decorate([
    typeorm_1.Entity("archives")
], ArchiveEntry);
exports.ArchiveEntry = ArchiveEntry;
