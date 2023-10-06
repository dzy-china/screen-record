// 引入第三方视频时长封装模块
const { webmFixDuration } = require("webm-fix-duration")

/* 录制媒体流(视频音频流)  */
class HsMediaRecorder {
    // 录制器对象
    recorder = null

    // 记录开始录制时间戳
    recorderStartTime = 0

    // 记录暂停录制开始时间戳
    pauseStartTime = 0

    // 记录暂停持续时间
    pauseDurationTime = 0

    // 录制的数据
    recordDataArray = []

    // 录制状态： inactive(录制未发生) recording(正在录制) paused(暂停)
    recordState = 'inactive'

    // 开始录制
    startRecorder(stream) {
        // 初始化数据
        this.recordDataArray = []
        this.pauseDurationTime = 0

        // 创建录制器对象
        this.recorder = new MediaRecorder(stream ,{
            mimeType:'video/webm' // 设置录制视频格式
        });

        // 开始录制，并设置时间间隔，到了设置时间会自动触发ondataavailable事件
        this.recordState = 'recording'
        this.recorder.start(1000) // 1秒

        // 记录视频录制的起始时间
        this.recorderStartTime = Date.now();

        // 触发数据可用事件
        this.recorder.ondataavailable = event => {
            this.recordDataArray.push(event.data)
        };
    }


    // 暂停 录制
    async pauseRecord() {
        if (this.recorder.state === "recording") { //如果是正在录制状态，暂停录制
            // 设置录制状态
            this.recordState = 'paused'

            // 记录暂停时间
            this.pauseStartTime = Date.now()

            // 暂停录制
            this.recorder.pause();
        }
    }

    // 恢复暂停 继续录制
    resumeRecord() {
        if(this.recorder.state === "paused"){ //如果是暂停状态，继续录制
            // 设置录制状态
            this.recordState = 'recording'

            // 记录暂停持续时间
            this.pauseDurationTime += Date.now() - this.pauseStartTime;
            this.pauseStartTime = 0 // 初始化暂停时间

            // 恢复以前媒体录制暂停
            this.recorder.resume();
        }
    }

    // 停止录制
    async stopRecord() {
         this.recorder.stop()
         this.recordState = 'inactive'

         // 记录录制持续时间
        if(this.pauseStartTime > 0 ){ // 如果暂停后，继续点击了停止录制
            this.pauseDurationTime += Date.now() - this.pauseStartTime;
        }
         const duration = Date.now() - this.recorderStartTime - this.pauseDurationTime;

         // 将记录的数据转化为 blob
         let blobObj = new Blob(this.recordDataArray, {
             type: 'video/webm',
         });

         // 将Blob对象封装持续时间
         return webmFixDuration(blobObj, duration);
    }

}


module.exports = HsMediaRecorder