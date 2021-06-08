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
exports.Counter = void 0;
const typeorm_1 = require("typeorm");
let Counter = class Counter {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Counter.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Counter.prototype, "guild_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Counter.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Counter.prototype, "per_channel", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Counter.prototype, "per_user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Counter.prototype, "last_decay_at", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], Counter.prototype, "delete_at", void 0);
Counter = __decorate([
    typeorm_1.Entity("counters")
], Counter);
exports.Counter = Counter;
