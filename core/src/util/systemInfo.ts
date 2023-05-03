/**
 * Simple System Infomation (我说的)
 */
import nodeOs from 'node:os';

var isExistTimer: boolean = false;
var momentIdleTime: number = 0, momentTotalTime: number = 0;

function queryTimer() {
  let lastTime = { IDLE: 0, TOTAL: 0 };
  setInterval(() => {
    function queryCPU () {
      var totalTime: number = 0, idleTime: number = 0;
      const cpus = nodeOs.cpus();
      for (let cpu in cpus) {
        let times = cpus[cpu].times;
        idleTime += times.idle;
        totalTime = totalTime + times.user + times.sys + times.nice + times.irq + times.idle;
      };

      return { IDLE: idleTime, TOTAL: totalTime };
    };

    const currentTimes = queryCPU();
    momentIdleTime = currentTimes.IDLE - lastTime.IDLE;
    momentTotalTime = currentTimes.TOTAL - lastTime.TOTAL;
    lastTime = currentTimes;
  }, 1000);
}; queryTimer();

enum EByteUnit {
  byte,
  kilobyte,
  megabyte,
  gigabyte,
  terabyte,
  petabyte
};
type TByteUnit = keyof typeof EByteUnit;

class CByteConvertor {
  private DATA_LENGTH: number = NaN;
  private DATA_NUIT: TByteUnit = 'byte';

  constructor(dataLength: number, unit: TByteUnit) {
    this.DATA_LENGTH = dataLength;
    this.DATA_NUIT = unit;
  };

  get byte() {
    if (this.DATA_NUIT == 'byte') return this.DATA_LENGTH;
    let step = Math.abs(Math.pow(1024, EByteUnit['byte'] - EByteUnit[this.DATA_NUIT]));

    return this.DATA_LENGTH * (step * Math.pow(step, EByteUnit[this.DATA_NUIT] < EByteUnit['byte'] ? 1 : -1))
  };
};

export default class CSystemInfo {
  public readonly OS_PLATFORM = `${nodeOs.version()} ${nodeOs.machine()}`;
  public readonly OS_BASIC_CPU = nodeOs.cpus()[0].model // 除了服务器，谁家多个cpu?
  public readonly OS_BASIC_TOTAL_MEM = nodeOs.totalmem();

  public get OS_DETAIL_CPU() {
    return {
      name: this.OS_BASIC_CPU,
      usage: Number((1 - (momentIdleTime / momentTotalTime)).toFixed(4))
    };
  };
  
  public get OS_DETAIL_MEM() {
    return {
      free: nodeOs.freemem(),
      usage: nodeOs.totalmem() - nodeOs.freemem(),
      total: nodeOs.totalmem(),
      percent: Number(((nodeOs.totalmem() - nodeOs.freemem()) / nodeOs.totalmem()).toFixed(4))
    }
  };

  public get OS_UP_TIME() {
    return nodeOs.uptime();
  }

  public constructor() {};
};
