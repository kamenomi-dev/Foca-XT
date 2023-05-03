import nodeFs from 'node:fs';
import welcome from './welcome';
import CLogger from './native/logger';

const logger = new CLogger;

try {
  welcome();
} catch (err) {
  logger.warn (`Launch: Haven't any warning effect. Just tell you version is "Release" in this project now. `)
};

var botConfig!: TBotConfig;
function reload() { // Todo: Support reload.
  if (!nodeFs.existsSync('./bot-config.json')) {
    logger.fatal('Launch: Missing config file! ');
    throw new Error('Project-Error: Missing config file! ');
  };

  try {
    botConfig = JSON.parse(
      nodeFs.readFileSync('./bot-config.json').toString()
    );

    logger.info('Launch: Read config file! ');
  } catch {
    logger.fatal('Launch: Unkown config file! ');
    throw new Error('Project-Error: Unknown config file! ');
  };
}; reload();

export { logger, botConfig };
import './login';
import './util/clock';
import './util/textTable';
import './util/systemInfo';
import './util/byteUnitConverter';

export type TBotConfig = {
  nickname?: string,
  admin: number[],
  bot_qid: number,
  password?: string,
  command_prefix: string
  group_rule?: {
    group_id: number,
    name: string,
    command?: string[]
  }[]
};

global.globalConfig = botConfig,
global.globalLogger = logger,
global.globalReload = reload.bind(reload)
