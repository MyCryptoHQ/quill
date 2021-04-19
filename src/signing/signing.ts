import { fork } from 'child_process';
import path from 'path';

const WORKER_PATH = path.resolve(__dirname, 'worker.js');

export const createSigningProcess = () => {
  const process = fork(WORKER_PATH);
  process.on('message', (message) => console.log(message));
  return process;
};
