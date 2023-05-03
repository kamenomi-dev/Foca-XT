"use strict";
/**
 * 跨日检测，很鸡肋
 */
Object.defineProperty(exports, "__esModule", { value: true });
var callbackSet = new Set;
var latestDate = NaN;
setInterval(() => {
    if (latestDate == (new Date).getDate())
        return;
    latestDate = (new Date).getDate();
    callbackSet.forEach(func => func.call(func));
}, 1000 * 60 * 30); // 30min
function addFunction(func) {
    func.call(func);
    return callbackSet.add(func).size - 1;
}
exports.default = addFunction;
;
