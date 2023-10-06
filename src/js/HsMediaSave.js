const fs = require("fs");
const path = require("path");

/* 保存录制的媒体流(视频音频流)  */
class HsMediaSave {
    saveMedia(blob) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(blob)  //读取数据 blob 转化为 buffer

        // 读取完成事件
        reader.onload = () => {
            // Buffer
            let buffer = Buffer.from(reader.result);

            // 记录当前时间戳
            let cur_time = new Date().getTime()

            const dir = './backup';

            // 检测目录是否存在
            if (!fs.existsSync(dir)) {
                fs.mkdir(dir, { recursive: true }, (err) => {
                    if (err) throw err;
                });
            }

            // 数据写入文件
            fs.writeFile(path.join(dir,  `hs-${cur_time}.mp4`), buffer, (err, res) => {
                if (err) return console.error(err);
            })
        }
    }

}

module.exports = HsMediaSave