const {
    app,
    BrowserWindow,
    Menu,
    screen,
} = require('electron')
const path = require("path");

const appReadyCallback = async () => {

    // 创建窗口对象
    const {width, height} = screen.getPrimaryDisplay().size // 获取系统屏幕宽高
    const mainWindow = new BrowserWindow({
        show: false, // 设置窗口不显示
        width: width / 2,
        height: height / 2,
        icon: path.join(__dirname, '..', '..', 'src', 'images', 'logo.png'), // 应用图标
        webPreferences: {
            webSecurity: false,
            // 渲染进程环境预加载文件： preload.js
            // preload: __dirname + '/preload.js',
            nodeIntegration: true, // 开启在渲染进程中融入node
            contextIsolation:false, // 关闭上下文隔离
            enableRemoteModule:true  // 开启可在渲染进程中直接引入node模块
        },
    });


    // // 监听页面资源加载完成事件
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // 主菜单
    const main_menu = require(path.join(__dirname, '..', '..', 'config', 'main_menu.js'));
    Menu.setApplicationMenu(main_menu)

    // 加载html页面作为视图层
    await mainWindow.loadFile(path.join(__dirname, '..', '..', 'src', 'index.html'));

    // 打开开发者工具
    // mainWindow.openDevTools();

    // 消除electron控制台警告
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'


    // 引入 on-ready-plus.js
    require(path.join(__dirname, 'on-ready-plus.js'));

};

// electron准备就绪事件
app.on('ready', appReadyCallback);

module.exports = appReadyCallback