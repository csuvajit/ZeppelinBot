"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrReuseInvite = void 0;
async function createOrReuseInvite(vc) {
    const existingInvites = await vc.getInvites();
    if (existingInvites.length !== 0) {
        return existingInvites[0];
    }
    else {
        return vc.createInvite(undefined);
    }
}
exports.createOrReuseInvite = createOrReuseInvite;
