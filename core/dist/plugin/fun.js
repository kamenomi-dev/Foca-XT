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
Object.defineProperty(exports, "__esModule", { value: true });
const icqq_1 = require("icqq");
const globalInit = __importStar(require("../globalInit"));
const system_1 = require("./system");
const console = globalInit.globalProj.logger;
const qqClient = globalInit.qqClient;
const globalProj = globalInit.globalProj;
const supportCommand = new Set;
supportCommand.add({ label: 'color_pic', alias: '色图', command: '涩图', isGlobal: false });
qqClient.on('message.group.normal', groupMsgEvent => {
    const rawMessage = groupMsgEvent.raw_message;
    const commandPrefix = globalProj.botConfig.command_prefix;
    if (groupMsgEvent.message[0].type != 'text')
        return;
    if (rawMessage[0] != commandPrefix)
        return;
    const messageBlock = rawMessage.slice(commandPrefix.length).split(' ');
    const command = messageBlock[0];
    [...supportCommand.values()].forEach(val => {
        if (command != val.command && command != val.alias)
            return;
        if (val.label == 'color_pic') {
            groupMsgEvent.reply([
                '1092px * 1080px',
                icqq_1.segment.image((0, system_1.getColorBackground)())
            ]);
        }
        ;
    });
});
