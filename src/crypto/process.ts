import { fork } from 'child_process';
import path from 'path';

const WORKER_PATH = path.resolve(__dirname, 'worker.js');

export const createCryptoProcess = () => {
  return fork(WORKER_PATH);
};
