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
exports.VCAlert = void 0;
const typeorm_1 = require("typeorm");
let VCAlert = class VCAlert {
};
__decorate([
    typeorm_1.Column(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], VCAlert.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VCAlert.prototype, "guild_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VCAlert.prototype, "requestor_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VCAlert.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VCAlert.prototype, "channel_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VCAlert.prototype, "expires_at", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VCAlert.prototype, "body", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], VCAlert.prototype, "active", void 0);
VCAlert = __decorate([
    typeorm_1.Entity("vc_alerts")
], VCAlert);
exports.VCAlert = VCAlert;
