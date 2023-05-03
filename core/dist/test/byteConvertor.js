"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EByteUnit;
(function (EByteUnit) {
    EByteUnit[EByteUnit["byte"] = 0] = "byte";
    EByteUnit[EByteUnit["kilobyte"] = 1] = "kilobyte";
    EByteUnit[EByteUnit["megabyte"] = 2] = "megabyte";
    EByteUnit[EByteUnit["gigabyte"] = 3] = "gigabyte";
    EByteUnit[EByteUnit["terabyte"] = 4] = "terabyte";
    EByteUnit[EByteUnit["petabyte"] = 5] = "petabyte";
})(EByteUnit || (EByteUnit = {}));
;
class CByteConvertor {
    DATA_LENGTH = NaN;
    DATA_NUIT = 'byte';
    constructor(dataLength, unit) {
        this.DATA_LENGTH = dataLength;
        this.DATA_NUIT = unit;
    }
    ;
    get(unit) {
        if (this.DATA_NUIT == 'byte')
            return this.DATA_LENGTH;
        let step = Math.pow(1024, Math.abs(EByteUnit[unit] - EByteUnit[this.DATA_NUIT]));
        return this.DATA_LENGTH * Math.pow(step, EByteUnit[this.DATA_NUIT] > EByteUnit[unit] ? 1 : -1);
    }
    ;
}
;
console.log((new CByteConvertor(1024, 'kilobyte').get('megabyte')));
