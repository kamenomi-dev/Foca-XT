"use strict";
/**
 * 与 Log4js 没有任何关联，纯属方便记录非 ICQQ 库中日志消息的日志。
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const filePath = `./log/log-${(new Date).toISOString()}.log`
    .replaceAll(':', '.');
if (!node_fs_1.default.existsSync('./log'))
    node_fs_1.default.mkdirSync('./log');
if (!node_fs_1.default.existsSync(filePath))
    node_fs_1.default.writeFileSync(filePath, 'CLogger loaded. \n');
const hFile = node_fs_1.default.openSync(filePath, 'a');
const rawlogFunc = console.log.bind(console);
class CLogger {
    constructor() { }
    ;
    log(level, ...log) {
        var logString = '';
        [...log].forEach(logAny => {
            switch (typeof logAny) {
                case "object":
                    {
                        logString += JSON.stringify(logAny);
                        break;
                    }
                    ;
                case "function":
                    {
                        logString += `function(${logAny.name})`;
                        break;
                    }
                    ;
                default:
                    {
                        logString += String(logAny);
                        break;
                    }
                    ;
            }
            ;
            logString += ' ';
        });
        const preTime = new Date().toISOString();
        const rawLog = `${preTime} - %c${level.padEnd(5)}%c  ${logString}`;
        let EColorLevel;
        (function (EColorLevel) {
            EColorLevel["info"] = "white";
            EColorLevel["warn"] = "yellow";
            EColorLevel["error"] = "red";
            EColorLevel["fatal"] = "darkred";
            EColorLevel["debug"] = "blue";
        })(EColorLevel || (EColorLevel = {}));
        ;
        node_fs_1.default.write(hFile, (rawLog + '\n').replaceAll('%c', ''), err => {
            if (err) {
                throw new Error('CLogger: Cannot write log file! ');
            }
            ;
        });
        rawlogFunc(rawLog, `color: ${EColorLevel[level]}`, `color: none`);
    }
    ;
    info(...log) {
        return this.log('info', ...log);
    }
    ;
    warn(...log) {
        return this.log('warn', ...log);
    }
    ;
    error(...log) {
        return this.log('error', ...log);
    }
    ;
    fatal(...log) {
        this.log('fatal', ...log);
        this.log('info', 'CLogger was unload. ');
        node_fs_1.default.closeSync(hFile);
        // throw new Error(`CLogger: this.fatal be called! cause: ${log}`);
    }
    ;
    debug(...log) {
        return this.log('debug', ...log);
    }
    ;
}
exports.default = CLogger;
;
