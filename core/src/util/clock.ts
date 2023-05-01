/**
 * 跨日检测，很鸡肋
 */

var callbackSet = new Set<Function>;
var latestDate = NaN;

setInterval(() => {
  if (latestDate == (new Date).getDate()) return;

  latestDate = (new Date).getDate();
  callbackSet.forEach(func => func.call(func));
}, 30 * 60 * 60 * 1000); // 30min

export default function addFunction(func: Function) {
  func.call(func);
  return callbackSet.add(func).size - 1;
};