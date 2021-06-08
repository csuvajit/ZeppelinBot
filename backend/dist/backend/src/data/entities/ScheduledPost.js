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
exports.ScheduledPost = void 0;
const typeorm_1 = require("typeorm");
let ScheduledPost = class ScheduledPost {
};
__decorate([
    typeorm_1.Column(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], ScheduledPost.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ScheduledPost.prototype, "guild_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ScheduledPost.prototype, "author_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ScheduledPost.prototype, "author_name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ScheduledPost.prototype, "channel_id", void 0);
__decorate([
    typeorm_1.Column("simple-json"),
    __metadata("design:type", Object)
], ScheduledPost.prototype, "content", void 0);
__decorate([
    typeorm_1.Column("simple-json"),
    __metadata("design:type", Array)
], ScheduledPost.prototype, "attachments", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], ScheduledPost.prototype, "post_at", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], ScheduledPost.prototype, "repeat_interval", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], ScheduledPost.prototype, "repeat_until", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: true }),
    __metadata("design:type", Object)
], ScheduledPost.prototype, "repeat_times", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], ScheduledPost.prototype, "enable_mentions", void 0);
ScheduledPost = __decorate([
    typeorm_1.Entity("scheduled_posts")
], ScheduledPost);
exports.ScheduledPost = ScheduledPost;
