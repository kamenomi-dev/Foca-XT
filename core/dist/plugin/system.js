"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorBackground = exports.isAdminRequest = void 0;
const canvas = __importStar(require("canvas"));
const icqq = __importStar(require("icqq"));
const text2img = __importStar(require("ultimate-text-to-image"));
const globalInit = __importStar(require("../globalInit"));
const textTable_1 = __importDefault(require("../util/textTable"));
const systemInfo_1 = __importDefault(require("../util/systemInfo"));
const byteUnitConverter_1 = __importDefault(require("../util/byteUnitConverter"));
const qqClient = globalInit.qqClient;
const globalProj = globalInit.globalProj;
const console = globalProj.logger;
const supportCommand = new Set;
supportCommand.add({ label: 'reload', alias: 'relo', command: 'reload', isGlobal: false });
supportCommand.add({ label: 'status', alias: 'state', command: 'status', isGlobal: true });
qqClient.on('message.group.normal', groupMsgEvent => {
    const rawMessage = groupMsgEvent.raw_message;
    const commandPrefix = globalProj.botConfig.command_prefix;
    if (groupMsgEvent.message[0].type != 'text')
        return;
    if (rawMessage[0] != commandPrefix)
        return;
    const messageBlock = rawMessage.slice(commandPrefix.length).split(' ');
    const command = messageBlock[0];
    // Todo: 修复大小写敏感
    const argument = messageBlock.slice(1).map(arg => arg.toLowerCase());
    if (command[0].replace('.', '') == '') // 无效命令
        return;
    console.info(`System: Recv request from ${groupMsgEvent.sender.user_id} in Group(${groupMsgEvent.group_id}):`, ...messageBlock);
    [...supportCommand.values()].forEach(async (val) => {
        if (command != val.command && command != val.alias)
            return;
        if (val.label == 'status')
            return command_status(groupMsgEvent, ...argument);
        if (val.label == 'reload')
            return command_reload(groupMsgEvent);
    });
});
function command_reload(groupMessageEvent) {
    if (!isAdminRequest(groupMessageEvent.sender.user_id))
        return;
    console.info(`System: Reload the config! `);
    global.globalReload();
}
;
async function command_status(groupMessageEvent, ...argument) {
    if (argument[0] == undefined || argument[0] == 'runner') {
        let systemInfo = new systemInfo_1.default;
        let textTable = new textTable_1.default({
            paddingWidth: 2,
            scrollStyle: 'THIN',
            withinBorder: false
        });
        const memoryUsage_gb = new byteUnitConverter_1.default(systemInfo.OS_DETAIL_MEM.usage, 'byte').get('gigabyte');
        const memoryTotal_gb = new byteUnitConverter_1.default(systemInfo.OS_DETAIL_MEM.total, 'byte').get('gigabyte');
        textTable
            .addItem(['platform: ', systemInfo.OS_PLATFORM, 'upTime: ', (systemInfo.OS_UP_TIME / 60 / 60).toFixed(2) + 'Hour'])
            .addItem(['CPU: ', systemInfo.OS_BASIC_CPU, 'Usage: ', (systemInfo.OS_DETAIL_CPU.usage * 100).toFixed(2) + '%'])
            .addItem(['MEM: ', `${memoryUsage_gb}/${memoryTotal_gb}gb`, 'Usage: ', (systemInfo.OS_DETAIL_MEM.percent * 100).toFixed(2) + '%']);
        let backgroundImage = await text2img.getCanvasImage({
            buffer: getColorBackground(1920, 1024)
        });
        let tableImageBuffer = new text2img.UltimateTextToImage(textTable.generate(), {
            images: [{
                    canvasImage: backgroundImage, repeat: 'center'
                }],
            margin: 12,
            fontSize: 32,
            fontColor: '#FFFFFF',
            // fontStyle: true,
            fontFamily: 'Fira Code, Microsoft YaHei',
        }).render().toBuffer();
        groupMessageEvent.reply(icqq.segment.image(tableImageBuffer, false));
    }
    ;
}
;
function isAdminRequest(user_id) {
    return !!globalProj.botConfig.admin.find(admin => admin == user_id);
}
exports.isAdminRequest = isAdminRequest;
;
function getColorBackground(width = 1920, height = 1080) {
    let canvas_ = new canvas.Canvas(width, height, 'image');
    let context = canvas_.getContext('2d');
    let gradient = context.createLinearGradient(0, 0, canvas_.width, canvas_.height);
    gradient.addColorStop(0, `rgb(${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)})`);
    gradient.addColorStop(1, `rgb(${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)}, ${(Math.random() * 255).toFixed(0)})`);
    context.beginPath();
    context.fillStyle = gradient;
    context.moveTo(0, 0);
    context.fillRect(0, 0, canvas_.width, canvas_.height);
    context.closePath();
    context.save();
    return canvas_.toBuffer('image/png');
}
exports.getColorBackground = getColorBackground;
