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

    console.log(1 - momentIdleTime / momentTotalTime);
    

  }, 1000);
};

class CSystemInfo {
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
      percent: Number((1 - nodeOs.freemem() / nodeOs.totalmem()).toFixed(4))
    }
  };

  public constructor() {
    if (!isExistTimer) {
      queryTimer();
      isExistTimer = true;
    };
  };
};
