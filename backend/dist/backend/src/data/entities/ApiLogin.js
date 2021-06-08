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
exports.ApiLogin = void 0;
const typeorm_1 = require("typeorm");
const ApiUserInfo_1 = require("./ApiUserInfo");
let ApiLogin = class ApiLogin {
};
__decorate([
    typeorm_1.Column(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], ApiLogin.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ApiLogin.prototype, "token", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ApiLogin.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ApiLogin.prototype, "logged_in_at", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ApiLogin.prototype, "expires_at", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ApiUserInfo_1.ApiUserInfo, userInfo => userInfo.logins),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", ApiUserInfo_1.ApiUserInfo)
], ApiLogin.prototype, "userInfo", void 0);
ApiLogin = __decorate([
    typeorm_1.Entity("api_logins")
], ApiLogin);
exports.ApiLogin = ApiLogin;
