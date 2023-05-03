"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simple System Infomation (我说的)
 */
const node_os_1 = __importDefault(require("node:os"));
var isExistTimer = false;
var momentIdleTime = 0, momentTotalTime = 0;
function queryTimer() {
    let lastTime = { IDLE: 0, TOTAL: 0 };
    setInterval(() => {
        function queryCPU() {
            var totalTime = 0, idleTime = 0;
            const cpus = node_os_1.default.cpus();
            for (let cpu in cpus) {
                let times = cpus[cpu].times;
                idleTime += times.idle;
                totalTime = totalTime + times.user + times.sys + times.nice + times.irq + times.idle;
            }
            ;
            return { IDLE: idleTime, TOTAL: totalTime };
        }
        ;
        const currentTimes = queryCPU();
        momentIdleTime = currentTimes.IDLE - lastTime.IDLE;
        momentTotalTime = currentTimes.TOTAL - lastTime.TOTAL;
        lastTime = currentTimes;
    }, 1000);
}
;
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
    get byte() {
        if (this.DATA_NUIT == 'byte')
            return this.DATA_LENGTH;
        let step = Math.abs(Math.pow(1024, EByteUnit['byte'] - EByteUnit[this.DATA_NUIT]));
        return this.DATA_LENGTH * (step * Math.pow(step, EByteUnit[this.DATA_NUIT] < EByteUnit['byte'] ? 1 : -1));
    }
    ;
}
;
class CSystemInfo {
    OS_PLATFORM = `${node_os_1.default.version()} ${node_os_1.default.machine()}`;
    OS_BASIC_CPU = node_os_1.default.cpus()[0].model; // 除了服务器，谁家多个cpu?
    OS_BASIC_TOTAL_MEM = node_os_1.default.totalmem();
    get OS_DETAIL_CPU() {
        return {
            name: this.OS_BASIC_CPU,
            usage: Number((1 - (momentIdleTime / momentTotalTime)).toFixed(4))
        };
    }
    ;
    get OS_DETAIL_MEM() {
        return {
            free: node_os_1.default.freemem(),
            usage: node_os_1.default.totalmem() - node_os_1.default.freemem(),
            total: node_os_1.default.totalmem(),
            percent: Number(((node_os_1.default.totalmem() - node_os_1.default.freemem()) / node_os_1.default.totalmem()).toFixed(4))
        };
    }
    ;
    get OS_UP_TIME() {
        return node_os_1.default.uptime();
    }
    constructor() {
        if (!isExistTimer) {
            queryTimer();
            isExistTimer = true;
        }
        ;
    }
    ;
}
exports.default = CSystemInfo;
;
