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
exports.Case = void 0;
const typeorm_1 = require("typeorm");
const CaseNote_1 = require("./CaseNote");
let Case = class Case {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Case.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Case.prototype, "guild_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Case.prototype, "case_number", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Case.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Case.prototype, "user_name", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], Case.prototype, "mod_id", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], Case.prototype, "mod_name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Case.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], Case.prototype, "audit_log_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Case.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Case.prototype, "is_hidden", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], Case.prototype, "pp_id", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], Case.prototype, "pp_name", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], Case.prototype, "log_message_id", void 0);
__decorate([
    typeorm_1.OneToMany(type => CaseNote_1.CaseNote, note => note.case),
    __metadata("design:type", Array)
], Case.prototype, "notes", void 0);
Case = __decorate([
    typeorm_1.Entity("cases")
], Case);
exports.Case = Case;
