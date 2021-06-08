"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncMap = exports.asyncFilter = exports.asyncReduce = void 0;
async function asyncReduce(arr, callback, initialValue) {
    let accumulator;
    let arrayToIterate;
    if (initialValue !== undefined) {
        accumulator = initialValue;
        arrayToIterate = arr;
    }
    else {
        accumulator = arr[0];
        arrayToIterate = arr.slice(1);
    }
    for (const [i, currentValue] of arr.entries()) {
        accumulator = await callback(accumulator, currentValue, i, arr);
    }
    return accumulator;
}
exports.asyncReduce = asyncReduce;
function asyncFilter(arr, callback) {
    return asyncReduce(arr, async (newArray, element, i, _arr) => {
        if (await callback(element, i, _arr)) {
            newArray.push(element);
        }
        return newArray;
    }, []);
}
exports.asyncFilter = asyncFilter;
function asyncMap(arr, callback) {
    return asyncReduce(arr, async (newArray, element, i, _arr) => {
        newArray.push(await callback(element, i, _arr));
        return newArray;
    }, []);
}
exports.asyncMap = asyncMap;
