import * as globalInit from '../globalInit';

const console = globalInit.globalProj.logger;
const qqClient = globalInit.qqClient;
const globalProj = globalInit.globalProj;

const supportCommand = new Set<TCommandProto>;
supportCommand.add({ label: 'reload', alias: 'relo', command: 'reload', isGlobal: false });
supportCommand.add({ label: 'status', alias: 'state', command: 'status', isGlobal: true });

qqClient.on('message.group.normal', groupMsgEvent => {
  const rawMessage = groupMsgEvent.raw_message;
  const requestSender = groupMsgEvent.sender;
  const commandPrefix = globalProj.botConfig.command_prefix;

  if (groupMsgEvent.message[0].type != 'text') return;
  if (rawMessage[0] != commandPrefix) return;

  const messageBlock = rawMessage.slice(commandPrefix.length).split(' ');
  const command = messageBlock[0];
  const argument = messageBlock.slice(1);

  console.info(`System: Recv request from ${requestSender.user_id} in Group(${groupMsgEvent.group_id}):`, ...messageBlock);

  [...supportCommand.values()].forEach(val => {
    if (command != val.command && command != val.alias) return;

    if (val.label == 'status') {
      groupMsgEvent.reply('状态ing');
      return;
    };

    if (val.label == 'reload') {
      if (!isAdminRequest(requestSender.user_id)) return;
      console.info(`System: Reload the config! `);
     
      (process.env.globalReload as unknown as Function)();
      return;
    };
  });
});

export type TCommandProto = {
  label: string, // it is a tag about command.
  alias: string,
  command: string,
  isGlobal: boolean,
  privateGroups?: number[]
};

export function isAdminRequest(user_id: number) {
  return !!globalProj.botConfig.admin.find(admin => admin == user_id);
};