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
exports.ApiUserInfo = void 0;
const typeorm_1 = require("typeorm");
const ApiLogin_1 = require("./ApiLogin");
const ApiPermissionAssignment_1 = require("./ApiPermissionAssignment");
let ApiUserInfo = class ApiUserInfo {
};
__decorate([
    typeorm_1.Column(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], ApiUserInfo.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("simple-json"),
    __metadata("design:type", Object)
], ApiUserInfo.prototype, "data", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ApiUserInfo.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.OneToMany(type => ApiLogin_1.ApiLogin, login => login.userInfo),
    __metadata("design:type", Array)
], ApiUserInfo.prototype, "logins", void 0);
__decorate([
    typeorm_1.OneToMany(type => ApiPermissionAssignment_1.ApiPermissionAssignment, p => p.userInfo),
    __metadata("design:type", Array)
], ApiUserInfo.prototype, "permissionAssignments", void 0);
ApiUserInfo = __decorate([
    typeorm_1.Entity("api_user_info")
], ApiUserInfo);
exports.ApiUserInfo = ApiUserInfo;
