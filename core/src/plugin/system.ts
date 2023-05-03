import * as canvas from 'canvas';
import * as icqq from 'icqq';
import * as text2img from 'ultimate-text-to-image';
import * as globalInit from '../globalInit';
import CTextTable from '../util/textTable';
import CSystemInfo from '../util/systemInfo';
import CByteUnitConvertor from '../util/byteUnitConverter';

const qqClient = globalInit.qqClient;
const globalProj = globalInit.globalProj;
const console = globalProj.logger;

const supportCommand = new Set<TCommandProto>;
supportCommand.add({ label: 'reload', alias: 'relo', command: 'reload', isGlobal: false });
supportCommand.add({ label: 'status', alias: 'state', command: 'status', isGlobal: true });

qqClient.on('message.group.normal', groupMsgEvent => {
  const rawMessage = groupMsgEvent.raw_message;
  const commandPrefix = globalProj.botConfig.command_prefix;

  if (groupMsgEvent.message[0].type != 'text') return;
  if (rawMessage[0] != commandPrefix) return;

  const messageBlock = rawMessage.slice(commandPrefix.length).split(' ');
  const command = messageBlock[0];
  // Todo: 修复大小写敏感
  const argument = messageBlock.slice(1).map(arg => arg.toLowerCase());

  if (command[0].replace('.', '') == '') // 无效命令
    return;

  console.info(`System: Recv request from ${groupMsgEvent.sender.user_id} in Group(${groupMsgEvent.group_id}):`, ...messageBlock);

  [...supportCommand.values()].forEach(async val => {
    if (command != val.command && command != val.alias)
      return;

    if (val.label == 'status')
      return command_status(groupMsgEvent, ...argument);

    if (val.label == 'reload')
      return command_reload(groupMsgEvent);
  });
});

function command_reload(groupMessageEvent: icqq.GroupMessageEvent) {
  if (!isAdminRequest(groupMessageEvent.sender.user_id)) return;
  console.info(`System: Reload the config! `);

  (global.globalReload as any as Function)();
};

async function command_status(groupMessageEvent: icqq.GroupMessageEvent, ...argument: string[]) {
  if (argument[0] == undefined || argument[0] == 'runner') {
    let systemInfo = new CSystemInfo;
    let textTable = new CTextTable({
      paddingWidth: 2,
      scrollStyle: 'THIN',
      withinBorder: false
    });

    const memoryUsage_gb = new CByteUnitConvertor(systemInfo.OS_DETAIL_MEM.usage, 'byte').get('gigabyte');
    const memoryTotal_gb = new CByteUnitConvertor(systemInfo.OS_DETAIL_MEM.total, 'byte').get('gigabyte');
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
  };
};

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

export function getColorBackground(width: number = 1920, height: number = 1080) {
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