import { APPLICATION_NAME } from '@signer/common';
import { writeFile } from 'fs/promises';
import ipc from 'node-ipc';
import { homedir, platform } from 'os';
import { resolve } from 'path';

ipc.config.id = 'signer';
ipc.config.silent = true;

const LINUX_PATHS = [
  resolve(homedir(), '.config/google-chrome/NativeMessagingHosts'),
  resolve(homedir(), '.config/chromium/NativeMessagingHosts')
];

const MACOS_PATHS = [
  resolve(homedir(), 'Library/Application Support/Google/Chrome/NativeMessagingHosts'),
  resolve(homedir(), 'Library/Application Support/Chromium/NativeMessagingHosts')
];

export interface Manifest {
  name: string;
  description: string;
  path: string;
  type: 'stdio';
  allowed_origins: string[];
}

export const createManifest = (extensionId: string): Manifest => {
  const path = resolve(__dirname, '../lib/signer.js');
  return {
    name: APPLICATION_NAME,
    description: 'MyCrypto Signer application',
    path,
    type: 'stdio',
    allowed_origins: [`chrome-extension://${extensionId}/`]
  };
};

export const registerManifestByPath = async (
  paths: string[],
  manifest: Manifest
): Promise<void> => {
  const fileName = `${manifest.name}.json`;
  const data = JSON.stringify(manifest);

  await Promise.all(
    paths.map(async (path) => {
      const fullPath = resolve(path, fileName);
      await writeFile(fullPath, data);
    })
  );
};

/**
 * Registers a manifest file. Currently supports macOS and Linux, since Windows requires adding keys to the registry.
 */
export const registerManifest = (manifest: Manifest): Promise<void> => {
  const os = platform();
  switch (os) {
    case 'linux':
      return registerManifestByPath(LINUX_PATHS, manifest);
    case 'darwin':
      return registerManifestByPath(MACOS_PATHS, manifest);
    // @todo: Windows support
    default:
      throw new Error('Platform not supported');
  }
};

export type Server = typeof ipc.server;

/**
 * Runs a local IPC server, which the browser extension bridge can connect to.
 */
export const serve = async (handleMessage: () => void): Promise<Server> => {
  ipc.server.start();
  ipc.serve(handleMessage);

  return ipc.server;
};
