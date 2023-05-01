import nodeFs from 'node:fs';

import addFunction from "./util/clock";
import { globalProj, qqClient } from "./login";

const console = globalProj.logger;
const botConfig = globalProj.botConfig;

qqClient.on('system.online', () => {
  console.info('GlobalInit: Initing and setting something. ');
  if (botConfig.nickname != undefined) {
    let lastNickname = qqClient.nickname;
    qqClient.setNickname(botConfig.nickname).then(val => {
      if (val)
        console.info(`GlobalInit: Success set bot\'s nickname! ${lastNickname} -√> ${botConfig.nickname}`);
      else
        console.error(`GlobalInit: Fail set bot\'s nickname! ${lastNickname} -×> ${botConfig.nickname}`);
    });
  };

  function clockGroupNameRule() {
    botConfig.group_rule?.forEach(async groupRule => {
      const group_id = groupRule.group_id;
      const lastGroupName = (await qqClient.getGroupInfo(group_id, true)).group_name;

      let latestGroupName: string = lastGroupName;
      try {
        latestGroupName = eval(groupRule.name);
      } catch { };

      if (lastGroupName == latestGroupName) {
        console.info(`GlobalInit: Same Group(${group_id}) name! ${lastGroupName} <=> ${latestGroupName}`);
        return;
      };
      if (await qqClient.setGroupName(group_id, latestGroupName))
        console.info(`GlobalInit: Success set Group(${group_id}) name! ${lastGroupName} -√> ${latestGroupName}`);
      else
        console.error(`GlobalInit: Fail set Group(${group_id}) name! ${lastGroupName} -×> ${latestGroupName}`);
    });
  }; addFunction(clockGroupNameRule);

  ; (function loadPlugin() {
    nodeFs.readdir(`${process.cwd()}/core/src/plugin/`, { encoding: 'utf-8', withFileTypes: true }, (err, resultArray) => {
      if (err) {
        globalProj.logger.error('GlobalInit: Fail load plugin! ');
        globalProj.logger.error(`More: ${JSON.stringify(err)}`);
        return;
      };

      resultArray.forEach(dir => {
        if (dir.isFile() && dir.name.slice(-3) == '.ts') {
          import (`./plugin/${dir.name.slice(0, -3)}.js`).then(() => {
            globalProj.logger.info(`GlobalInit: Success load plugin ${dir.name} ! `);
          }).catch(err => {
            globalProj.logger.error(`GlobalInit: Fail load plugin ${dir.name} ! `);
            globalProj.logger.error(`More: ${JSON.stringify(err)}`);
          });
        } else return;
      });
    });
  })();
});

export { globalProj, qqClient, addFunction };