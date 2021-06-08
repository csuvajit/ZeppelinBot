"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedMessage = void 0;
const utils_1 = require("../utils");
const defaultOpts = {
    timeout: 5 * utils_1.MINUTES,
    limitToUserId: null,
};
async function createPaginatedMessage(client, channel, totalPages, loadPageFn, opts = {}) {
    const fullOpts = { ...defaultOpts, ...opts };
    const firstPageContent = await loadPageFn(1);
    const message = await channel.createMessage(firstPageContent);
    let page = 1;
    let pageLoadId = 0; // Used to avoid race conditions when rapidly switching pages
    const reactionListener = async (reactionMessage, emoji, reactor) => {
        if (reactionMessage.id !== message.id) {
            return;
        }
        if (fullOpts.limitToUserId && reactor.id !== fullOpts.limitToUserId) {
            return;
        }
        if (reactor.id === client.user.id) {
            return;
        }
        let pageDelta = 0;
        if (emoji.name === "⬅️") {
            pageDelta = -1;
        }
        else if (emoji.name === "➡️") {
            pageDelta = 1;
        }
        if (!pageDelta) {
            return;
        }
        const newPage = Math.max(Math.min(page + pageDelta, totalPages), 1);
        if (newPage === page) {
            return;
        }
        page = newPage;
        const thisPageLoadId = ++pageLoadId;
        const newPageContent = await loadPageFn(page);
        if (thisPageLoadId !== pageLoadId) {
            return;
        }
        message.edit(newPageContent).catch(utils_1.noop);
        message.removeReaction(emoji.name, reactor.id);
        refreshTimeout();
    };
    client.on("messageReactionAdd", reactionListener);
    // The timeout after which reactions are removed and the pagination stops working
    // is refreshed each time the page is changed
    let timeout;
    const refreshTimeout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            message.removeReactions().catch(utils_1.noop);
            client.off("messageReactionAdd", reactionListener);
        }, fullOpts.timeout);
    };
    refreshTimeout();
    // Add reactions
    message.addReaction("⬅️").catch(utils_1.noop);
    message.addReaction("➡️").catch(utils_1.noop);
    return message;
}
exports.createPaginatedMessage = createPaginatedMessage;
