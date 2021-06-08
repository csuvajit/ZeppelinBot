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
exports.CounterTriggerState = void 0;
const typeorm_1 = require("typeorm");
let CounterTriggerState = class CounterTriggerState {
};
__decorate([
    typeorm_1.Column({ type: "bigint", generated: "increment" }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], CounterTriggerState.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CounterTriggerState.prototype, "trigger_id", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint" }),
    __metadata("design:type", String)
], CounterTriggerState.prototype, "channel_id", void 0);
__decorate([
    typeorm_1.Column({ type: "bigint" }),
    __metadata("design:type", String)
], CounterTriggerState.prototype, "user_id", void 0);
CounterTriggerState = __decorate([
    typeorm_1.Entity("counter_trigger_states")
], CounterTriggerState);
exports.CounterTriggerState = CounterTriggerState;
