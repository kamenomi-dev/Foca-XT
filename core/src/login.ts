import * as icqq from 'icqq';
import * as pngjs from 'pngjs';
import * as globalProj from './launch';

const qqClient = icqq.createClient({
  platform: icqq.Platform.iPad,
  cache_group_member: true,
  log_level: 'warn',
  resend: true,
  data_dir: './account'
});

process.on('uncaughtException', (error, origin) => {
  globalProj.logger.fatal(`Project: Catch exception: ${error.name}, message: ${error.message}`);
  globalProj.logger.fatal(`Project: Cause: ${error.cause}, More: \n${error.stack}`);

  globalProj.logger.fatal(`Default: ${origin}`);

  process.exit(1);
}).on('unhandledRejection', reason => {
  globalProj.logger.fatal(`Project: Catch promise-reject: \n${reason}`);

  process.exit(1);
});

qqClient.on('system.login.slider', slider => {
  globalProj.logger.info('Login: Recv slider! ');
  console.log('Surf and Input slider');
  console.log(slider.url);

  process.stdin.on('data', sliderBuffer => {
    qqClient.submitSlider(sliderBuffer.toString().trim())
  });
}).on('system.login.qrcode', qrcode => {
  globalProj.logger.info('Login: Recv qr-code data! ');
  console.log('Scan and press enter. ');
  ; (function logQR() {
    const png = pngjs.PNG.sync.read(qrcode.image);
    const color_reset = '\x1b[0m';
    const color_fg_blk = '\x1b[30m';
    const color_bg_blk = '\x1b[40m';
    const color_fg_wht = '\x1b[37m';
    const color_bg_wht = '\x1b[47m';
    for (var i = 36; i < png.height * 4 - 36; i += 24) {
      var line = '';
      for (let j = 36; j < png.width * 4 - 36; j += 12) {
        var r0 = png.data[i * png.width + j];
        var r1 = png.data[i * png.width + j + (png.width * 4 * 3)];

        var bgcolor = (r0 == 255) ? color_bg_wht : color_bg_blk;
        var fgcolor = (r1 == 255) ? color_fg_wht : color_fg_blk;
        line += `${fgcolor + bgcolor}\u2584`;
      }
      console.log(line + color_reset);
    }
    console.log(`${color_fg_blk + color_bg_wht}${' '.repeat(39)}${color_reset}`);
  })();

  process.stdin.on('data', buffer => {
    qqClient.login();
  });
}).on('system.login.device', device => {
  globalProj.logger.info('Login: Recv device-verify! ')
  console.log('You have choice: 1. SMS-Code Verify (press 1), 2. QR-Code Scan (press any)');

  process.stdin.once('data', choiceIdx => {
    globalProj.logger.info(`Login: User select ${Number(choiceIdx) === 1 ? 'SMS-Code' : 'QR-Code'}`);

    if (choiceIdx.toString().trim() === '1') {
      qqClient.sendSmsCode();
      console.log('Please, input the SMS-Code here. ');

      process.stdin.once('data', smsCode => {
        qqClient.submitSmsCode(smsCode.toString().trim());
      });
    } else {
      console.log('Scan the QR-Code and press enter. ');
      console.log(device.url);

      process.stdin.once('data', buffer => {
        qqClient.login();
      });
    };
  });
}).on('system.login.error', globalProj.logger.error);

qqClient.on('system.online', () => {
  globalProj.logger.info('Login: Success login! ');
}).on('system.offline', reason => {
  globalProj.logger.warn(`Login: bot offline! reason: ${reason.message}`);
});

qqClient.login(
  globalProj.botConfig.bot_qid,
  globalProj.botConfig.password
);

export { globalProj, qqClient };
import './globalInit';

Object.assign(process.env, {
  globalClient: qqClient
});