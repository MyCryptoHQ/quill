module.exports = {
  packagerConfig: {
    ...(process.env.SHOULD_SIGN
      ? {
          osxSign: {
            identity: 'Developer ID Application: MyCrypto Inc (43RN6VJTB7)',
            'hardened-runtime': true,
            'gatekeeper-assess': false,
            entitlements: 'entitlements.plist',
            'entitlements-inherit': 'entitlements.plist',
            'signature-flags': 'library'
          },
          osxNotarize: {
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASSWORD
          },
          packageManager: 'yarn'
        }
      : {}),
    icon: 'src/app/assets/images/icon'
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'quill',
        certificateFile: process.env.WINDOWS_PFX_FILE,
        certificatePassword: process.env.WINDOWS_PFX_PASSWORD
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        bin: 'quill'
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        bin: 'quill'
      }
    }
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        port: 3001,
        mainConfig: './webpack/main.js',
        renderer: {
          config: './webpack/renderer.js',
          entryPoints: [
            {
              html: './src/app/index.html',
              js: './src/app/index.tsx',
              name: 'main_window',
              preload: {
                js: './src/preload.ts'
              }
            }
          ]
        }
      }
    ]
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'MyCryptoHQ',
          name: 'quill'
        },
        prerelease: true
      }
    }
  ],
  electronRebuildConfig: {
    onlyModules: ['keytar', 'keccak', 'usb']
  }
};
