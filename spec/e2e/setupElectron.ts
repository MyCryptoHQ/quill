import path from 'path';
import { Application } from 'spectron';

const app = new Application({
  // @todo
  path: path.join(__dirname, '../../out/signer-linux-x64/signer')
});

export default app;
