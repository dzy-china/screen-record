module.exports = {
  packagerConfig: {
    name: 'hhluping',
    executableName: '卉卉录屏',
    // 不用加后缀，但是需要准备3个文件，win: *.ico, mac: *.icns, linux: *.png 打包时自动识别，linux 在BrowserWindow构造参数中设置
    icon: "src/images/logo",
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
