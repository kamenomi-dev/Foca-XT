import { Canvas } from 'canvas';
import { segment } from 'icqq';
import * as globalInit from '../globalInit';
import { getColorBackground } from './system';

const console = globalInit.globalProj.logger;
const qqClient = globalInit.qqClient;
const globalProj = globalInit.globalProj;

const supportCommand = new Set<TCommandProto>;
supportCommand.add({ label: 'color_pic', alias: '色图', command: '涩图', isGlobal: false });

qqClient.on('message.group.normal', groupMsgEvent => {
  const rawMessage = groupMsgEvent.raw_message;
  const commandPrefix = globalProj.botConfig.command_prefix;

  if (groupMsgEvent.message[0].type != 'text') return;
  if (rawMessage[0] != commandPrefix) return;

  const messageBlock = rawMessage.slice(commandPrefix.length).split(' ');
  const command = messageBlock[0];

  [...supportCommand.values()].forEach(val => {
    if (command != val.command && command != val.alias) return;

    if (val.label == 'color_pic') {
      groupMsgEvent.reply([ 
        '1092px * 1080px',
        segment.image(getColorBackground())
      ]);
    };
  });
});

type TCommandProto = {
  label: string, // it is a tag about command.
  alias: string,
  command: string,
  isGlobal: boolean,
  privateGroups?: number[]
};