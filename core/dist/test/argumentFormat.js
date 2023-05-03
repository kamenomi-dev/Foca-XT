"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseArgumentFormat(text) {
    const arr = text.match(/%[a-zA-Z]/);
    var result = text;
    arr?.forEach((val) => {
        const pos = result.indexOf(val);
        if (result[pos - 1] == '\\')
            return;
        result = result.slice(pos) + 'replaced' + result.slice(pos + 1, 0);
    });
    return result;
}
;
console.log(parseArgumentFormat('233%a,\\%a'));
