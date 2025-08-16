const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './public/icons/icon',
    executableName: 'ConfEasy',
    extraResource: [
      './dist',
      './dist-electron'
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // Windows configuration
        name: 'ConfEasy',
        exe: 'ConfEasy.exe'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          // Debian package configuration
          maintainer: 'Yidoon',
          homepage: 'https://github.com/Yidoon/ConfEasy',
          name: 'confeasy',  // Debian package name (must be lowercase)
          productName: 'ConfEasy',
          bin: 'ConfEasy',  // Executable file name
          executableName: 'ConfEasy'  // Ensure correct executable name is used
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          // RPM package configuration
          name: 'confeasy',  // RPM package name (typically lowercase)
          productName: 'ConfEasy',
          bin: 'ConfEasy',  // Executable file name
          executableName: 'ConfEasy'  // Ensure correct executable name is used
        }
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
