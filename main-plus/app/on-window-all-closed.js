
const { app }  = require('electron')

// 监听所有窗口关闭事件
app.on('window-all-closed', () => {
    // win系统下软件特点：所有窗口关闭，程序会退出
    // mac系统下软件特点：所有窗口关闭，程序并未退出，点击dock图标，窗口会再次打开
    if (process.platform !== 'darwin') {  // "darwin" 代表mac系统
        app.quit();
    }
});