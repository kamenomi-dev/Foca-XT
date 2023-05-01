"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFunction = exports.qqClient = exports.globalProj = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const clock_1 = __importDefault(require("./util/clock"));
exports.addFunction = clock_1.default;
const login_1 = require("./login");
Object.defineProperty(exports, "globalProj", { enumerable: true, get: function () { return login_1.globalProj; } });
Object.defineProperty(exports, "qqClient", { enumerable: true, get: function () { return login_1.qqClient; } });
const console = login_1.globalProj.logger;
const botConfig = login_1.globalProj.botConfig;
login_1.qqClient.on('system.online', () => {
    console.info('GlobalInit: Initing and setting something. ');
    if (botConfig.nickname != undefined) {
        let lastNickname = login_1.qqClient.nickname;
        login_1.qqClient.setNickname(botConfig.nickname).then(val => {
            if (val)
                console.info(`GlobalInit: Success set bot\'s nickname! ${lastNickname} -√> ${botConfig.nickname}`);
            else
                console.error(`GlobalInit: Fail set bot\'s nickname! ${lastNickname} -×> ${botConfig.nickname}`);
        });
    }
    ;
    function clockGroupNameRule() {
        botConfig.group_rule?.forEach(async (groupRule) => {
            const group_id = groupRule.group_id;
            const lastGroupName = (await login_1.qqClient.getGroupInfo(group_id, true)).group_name;
            let latestGroupName = lastGroupName;
            try {
                latestGroupName = eval(groupRule.name);
            }
            catch { }
            ;
            if (lastGroupName == latestGroupName) {
                console.info(`GlobalInit: Same Group(${group_id}) name! ${lastGroupName} <=> ${latestGroupName}`);
                return;
            }
            ;
            if (await login_1.qqClient.setGroupName(group_id, latestGroupName))
                console.info(`GlobalInit: Success set Group(${group_id}) name! ${lastGroupName} -√> ${latestGroupName}`);
            else
                console.error(`GlobalInit: Fail set Group(${group_id}) name! ${lastGroupName} -×> ${latestGroupName}`);
        });
    }
    ;
    (0, clock_1.default)(clockGroupNameRule);
    ;
    (function loadPlugin() {
        node_fs_1.default.readdir(`${process.cwd()}/core/src/plugin/`, { encoding: 'utf-8', withFileTypes: true }, (err, resultArray) => {
            if (err) {
                login_1.globalProj.logger.error('GlobalInit: Fail load plugin! ');
                login_1.globalProj.logger.error(`More: ${JSON.stringify(err)}`);
                return;
            }
            ;
            resultArray.forEach(dir => {
                if (dir.isFile() && dir.name.slice(-3) == '.ts') {
                    import(`./plugin/${dir.name.slice(0, -3)}.js`).then(() => {
                        login_1.globalProj.logger.info(`GlobalInit: Success load plugin ${dir.name} ! `);
                    }).catch(err => {
                        login_1.globalProj.logger.error(`GlobalInit: Fail load plugin ${dir.name} ! `);
                        login_1.globalProj.logger.error(`More: ${JSON.stringify(err)}`);
                    });
                }
                else
                    return;
            });
        });
    })();
});
