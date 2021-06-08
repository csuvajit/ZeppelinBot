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
exports.Config = void 0;
const typeorm_1 = require("typeorm");
const ApiUserInfo_1 = require("./ApiUserInfo");
let Config = class Config {
};
__decorate([
    typeorm_1.Column(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Config.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Config.prototype, "key", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Config.prototype, "config", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Config.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Config.prototype, "edited_by", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Config.prototype, "edited_at", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ApiUserInfo_1.ApiUserInfo),
    typeorm_1.JoinColumn({ name: "edited_by" }),
    __metadata("design:type", ApiUserInfo_1.ApiUserInfo)
], Config.prototype, "userInfo", void 0);
Config = __decorate([
    typeorm_1.Entity("configs")
], Config);
exports.Config = Config;
