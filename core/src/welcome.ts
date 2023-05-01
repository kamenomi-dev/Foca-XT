/**
 * // Welcome to OSU! // X
 * // Welcome to Code! // YES
 * 
 * // FUCK YOU! Nvidia!
 * // AMD YES!
 */

export default function welcome() {
  console.log(`
  ░░░░░░░  ░░░░░░   ░░░░░░  ░░░░░      ░░   ░░ ░░░░░░░░ 
  ▒▒      ▒▒    ▒▒ ▒▒      ▒▒   ▒▒      ▒▒ ▒▒     ▒▒    
  ▒▒▒▒▒   ▒▒    ▒▒ ▒▒      ▒▒▒▒▒▒▒       ▒▒▒      ▒▒    
  ▓▓      ▓▓    ▓▓ ▓▓      ▓▓   ▓▓      ▓▓ ▓▓     ▓▓    
  ██       ██████   ██████ ██   ██     ██   ██    ██    

  Author: Kamenomi (Kamenomi@tuta.io)
  Project: ${process.env.npm_package_name}
  Version: ${process.env.npm_package_version}
  License: Mozilla Public License - 2.0

   <-><<->><-><<->><-><<->><-><<->><-><<->><-><<->><->
  `);
};