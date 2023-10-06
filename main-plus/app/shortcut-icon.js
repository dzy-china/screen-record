const { app } = require('electron')

// 在安装/卸载 应用 时处理创建/删除快捷方式
if (require('electron-squirrel-startup')) {
    app.quit();
}