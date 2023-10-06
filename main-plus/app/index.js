const path = require("path");

// 在安装/卸载 应用 时处理创建/删除快捷方式
require(path.join(__dirname, 'shortcut-icon.js'))

// ready 事件
require(path.join(__dirname, 'on-ready.js'))


// window-all-closed 事件
require(path.join(__dirname, 'on-window-all-closed.js'))

// activate 事件
require(path.join(__dirname, 'on-activate.js'))


