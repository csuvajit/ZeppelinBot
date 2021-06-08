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
exports.CounterTrigger = exports.isValidCounterComparisonOp = exports.buildCounterConditionString = exports.parseCounterConditionString = exports.getReverseCounterComparisonOp = exports.TRIGGER_COMPARISON_OPS = void 0;
const typeorm_1 = require("typeorm");
exports.TRIGGER_COMPARISON_OPS = ["=", "!=", ">", "<", ">=", "<="];
const REVERSE_OPS = {
    "=": "!=",
    "!=": "=",
    ">": "<=",
    "<": ">=",
    ">=": "<",
    "<=": ">",
};
function getReverseCounterComparisonOp(op) {
    return REVERSE_OPS[op];
}
exports.getReverseCounterComparisonOp = getReverseCounterComparisonOp;
const comparisonStringRegex = new RegExp(`^(${exports.TRIGGER_COMPARISON_OPS.join("|")})([1-9]\\d*)$`);
/**
 * @return Parsed comparison op and value, or null if the comparison string was invalid
 */
function parseCounterConditionString(str) {
    const matches = str.match(comparisonStringRegex);
    return matches ? [matches[1], parseInt(matches[2], 10)] : null;
}
exports.parseCounterConditionString = parseCounterConditionString;
function buildCounterConditionString(comparisonOp, comparisonValue) {
    return `${comparisonOp}${comparisonValue}`;
}
exports.buildCounterConditionString = buildCounterConditionString;
function isValidCounterComparisonOp(op) {
    return exports.TRIGGER_COMPARISON_OPS.includes(op);
}
exports.isValidCounterComparisonOp = isValidCounterComparisonOp;
let CounterTrigger = class CounterTrigger {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CounterTrigger.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CounterTrigger.prototype, "counter_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CounterTrigger.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar" }),
    __metadata("design:type", String)
], CounterTrigger.prototype, "comparison_op", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CounterTrigger.prototype, "comparison_value", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar" }),
    __metadata("design:type", String)
], CounterTrigger.prototype, "reverse_comparison_op", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CounterTrigger.prototype, "reverse_comparison_value", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], CounterTrigger.prototype, "delete_at", void 0);
CounterTrigger = __decorate([
    typeorm_1.Entity("counter_triggers")
], CounterTrigger);
exports.CounterTrigger = CounterTrigger;
