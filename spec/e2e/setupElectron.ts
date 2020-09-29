import path from 'path';
import { Application } from 'spectron';

let electronPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron');
const appPath = path.join(__dirname, '..', '..', 'dist', 'main.js');
const logPath = path.join(__dirname, 'logs');

console.log(logPath);
console.log(appPath);

if (process.platform === 'win32') electronPath += '.cmd';
console.log(electronPath);

const app = new Application({
  path: electronPath,
  args: [appPath],
  webdriverLogPath: logPath,
  chromeDriverArgs: ['–remote-debugging-port=12209']
});

export default app;
