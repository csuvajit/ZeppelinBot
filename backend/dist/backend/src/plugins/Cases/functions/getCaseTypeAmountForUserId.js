"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseTypeAmountForUserId = void 0;
async function getCaseTypeAmountForUserId(pluginData, userID, type) {
    const cases = (await pluginData.state.cases.getByUserId(userID)).filter(c => !c.is_hidden);
    let typeAmount = 0;
    if (cases.length > 0) {
        cases.forEach(singleCase => {
            if (singleCase.type === type.valueOf()) {
                typeAmount++;
            }
        });
    }
    return typeAmount;
}
exports.getCaseTypeAmountForUserId = getCaseTypeAmountForUserId;
