const { Menu} = require('electron');

const main_menu = Menu.buildFromTemplate([
    {
        label:'主页',
        submenu:[
            {
                label:'主页-01',
            },
            {
                label:'主页-02',
            }
        ]
    },
    {
        label:'动作',
        submenu:[
            {
                label:'显示隐藏开发者工具',
                // 采用系统提供的菜单功能
                role:'toggleDevTools',
            },
            {
                label:'全屏',
                // 采用系统提供的菜单功能
                role:'togglefullscreen',
            },
            {
                // 菜单标题
                label:'自定义动作',
                // 菜单点击事件
                click:()=>{
                    console.log('my click')
                },
                // 自定义快捷键
                accelerator:'Alt+Shift+G'
            }
        ]
    }
])

// 导出
module.exports = main_menu
