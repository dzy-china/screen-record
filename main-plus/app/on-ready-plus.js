
const {
    ipcMain ,
} = require('electron')

//监听渲染进程"main-desktopCapturer"事件
ipcMain.on("main-desktopCapturer", (event)=>{
    //向渲染进程触发"renderer-reply"事件，并发送信息
    event.reply("renderer-desktopCapturer"); // sources[0]为'整个屏幕'对象
});