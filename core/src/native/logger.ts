/**
 * 与 Log4js 没有任何关联，纯属方便记录非 ICQQ 库中日志消息的日志。
 */

import nodeFs from 'node:fs';

const filePath
  = `./log/log-${(new Date).toISOString()}.log`
    .replaceAll(':', '.');

    if (!nodeFs.existsSync('./log')) nodeFs.mkdirSync('./log');
if (!nodeFs.existsSync(filePath)) nodeFs.writeFileSync(filePath, 'CLogger loaded. \n');
const hFile = nodeFs.openSync(filePath, 'a');

const rawlogFunc = console.log.bind(console);

export default class CLogger {
  public constructor() { };

  private log(
    level: 'info' | 'warn' | 'error' | 'fatal' | 'debug',
    ...log: any
  ) {
    var logString: string = '';
    [...log].forEach(logAny => {
      switch (typeof logAny) {
        case "object": {
          logString += JSON.stringify(logAny);
          break;
        };
        case "function": {
          logString += `function(${logAny.name})`;
          break;
        };
        default: {
          logString += String(logAny);
          break;
        };
      };
      logString += ' ';
    });

    const preTime = new Date().toISOString();
    const rawLog = `${preTime} - %c${level.padEnd(5).toUpperCase()}%c  ${logString}`;

    enum EColorLevel {
      info = 'white',
      warn = 'yellow',
      error = 'red',
      fatal = 'darkred',
      debug = 'blue'
    };

    nodeFs.write(hFile, (rawLog + '\n').replaceAll('%c', ''), err => {
      if (err) {
        throw new Error('CLogger: Cannot write log file! ');
      };
    });
    rawlogFunc(rawLog,
      `color: ${EColorLevel[level]}`,
      `color: none`
    );
  };

  public info(...log: any) {
    return this.log('info', ...log);
  };
  public warn(...log: any) {
    return this.log('warn', ...log);
  };
  public error(...log: any) {
    return this.log('error', ...log);
  };
  public fatal(...log: any) {
    this.log('fatal', ...log);
    this.log('info', 'CLogger was unload. ');
    nodeFs.closeSync(hFile);
    // throw new Error(`CLogger: this.fatal be called! cause: ${log}`);
  };
  public debug(...log: any) {
    return this.log('debug', ...log);
  };
};