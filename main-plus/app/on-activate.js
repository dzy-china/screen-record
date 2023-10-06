// macOS系统专用事件
// 针对mac系统，用户点击dock图标(退出软件后的后台软件标识)，可再次激活软件
const {app, BrowserWindow} = require('electron')
const path = require("path");

const appReadyCallback = require(path.join(__dirname, 'on-ready'))


app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
       await appReadyCallback();
    }
});

