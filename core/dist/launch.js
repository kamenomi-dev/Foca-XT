"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.botConfig = exports.logger = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const welcome_1 = __importDefault(require("./welcome"));
const logger_1 = __importDefault(require("./native/logger"));
const logger = new logger_1.default;
exports.logger = logger;
try {
    (0, welcome_1.default)();
}
catch (err) {
    logger.warn(`Launch: Haven't any warning effect. Just tell you version is "Release" in this project now. `);
}
;
var botConfig;
function reload() {
    if (!node_fs_1.default.existsSync('./bot-config.json')) {
        logger.fatal('Launch: Missing config file! ');
        throw new Error('Project-Error: Missing config file! ');
    }
    ;
    try {
        exports.botConfig = botConfig = JSON.parse(node_fs_1.default.readFileSync('./bot-config.json').toString());
        logger.info('Launch: Read config file! ');
    }
    catch {
        logger.fatal('Launch: Unkown config file! ');
        throw new Error('Project-Error: Unknown config file! ');
    }
    ;
}
;
reload();
require("./login");
require("./util/clock");
require("./util/textTable");
require("./util/systemInfo");
require("./util/byteUnitConverter");
global.globalConfig = botConfig,
    global.globalLogger = logger,
    global.globalReload = reload.bind(reload);
