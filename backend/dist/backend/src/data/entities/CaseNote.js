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
exports.CaseNote = void 0;
const typeorm_1 = require("typeorm");
const Case_1 = require("./Case");
let CaseNote = class CaseNote {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CaseNote.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CaseNote.prototype, "case_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CaseNote.prototype, "mod_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CaseNote.prototype, "mod_name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CaseNote.prototype, "body", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CaseNote.prototype, "created_at", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Case_1.Case, theCase => theCase.notes),
    typeorm_1.JoinColumn({ name: "case_id" }),
    __metadata("design:type", Case_1.Case)
], CaseNote.prototype, "case", void 0);
CaseNote = __decorate([
    typeorm_1.Entity("case_notes")
], CaseNote);
exports.CaseNote = CaseNote;
