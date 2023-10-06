/*
渲染进程可获取的全部对象(7个)：
    1. contextBridge
    2. crashReporter
    3. ipcRenderer
    4. webFrame
    5. clipboard
    6. nativeImage
    7. shell
	*/

// 模块导入
const {ipcRenderer}=require("electron")
const path = require("path")
const HsMediaStream = require(path.join(__dirname,  'js', 'HsMediaStream'))
const HsMediaRecorder = require(path.join(__dirname,  'js', 'HsMediaRecorder'))
const HsMediaSave = require(path.join(__dirname,  'js', 'HsMediaSave'))

class Index{
    // 录屏依赖类
    hsMediaStream = null
    hsMediaRecorder = null
    hsMediaSave = null

    // 定时器id
    interval_timer_id = null;

    // 定时起始秒数
    cur_second_number = 0;

    // 提示音对象
    reminder_audio_obj = 0;

    // 启动
    async start() {
        this.hsMediaStream =  new HsMediaStream()
        // 检测麦克风
       await this.hsMediaStream.microphone_check()

        this.hsMediaRecorder =  new HsMediaRecorder()
        this.hsMediaSave =  new HsMediaSave()

        this.microphone_check()
        this.preview()
        this.start_dom_event()
        this.start_record_event()
        this.create_reminder_audio()
    }

    // 检测麦克风是否正常工作
    microphone_check(){
        if(!this.hsMediaStream.microphoneStream){
            const audio_select_option_all = document.querySelector("#audio_select>option[value='all']")
            audio_select_option_all.disabled = true
            audio_select_option_all.selected = false
            document.querySelector("#audio_select>option[value='microphone']").disabled = true
            document.querySelector("#audio_select>option[value='loudspeaker']").selected = true
        }
    }

    // 启动视频预览
    preview(){
        this.hsMediaStream.previewVideoStream("#video")
    }

    // 页面绑定录制事件
    start_record_event(){
        // 1.向主进程请示开始录制
        document.querySelector("#start_record").addEventListener("click",(e)=>{
            e.target.disabled = true // 禁用开始按钮
            document.querySelector("#audio_select").disabled = true // 禁用声音来源选择

            //触发主进程事件，并发送信息
            ipcRenderer.send("main-desktopCapturer");
        });

        // 2.主程序响应并同意开始录制
        ipcRenderer.on("renderer-desktopCapturer",async (event) => {
            // 初始化数据
            this.cur_second_number = 0
            document.querySelector('#record_time').innerHTML = this.cur_second_number;

            document.querySelector("#pause_record").disabled = false  // 激活"暂停/继续"按钮
            document.querySelector("#stop_record").disabled = false  // 激活停止按钮

            // 启动定时器
            this.record_time()

            // 播放 提示音
            await this.reminder_audio_obj.play()
            // 监听提示音播放完毕事件
            this.reminder_audio_obj.addEventListener('ended', async() => {
                // 获取媒体流
                const mediaStream =  await this.hsMediaStream.getMediaStream()
                // 开始录制媒体流
                this.hsMediaRecorder.startRecorder(mediaStream)
            }, {
                once: true
            });

        });

        // 3. "暂停/继续" 录制
        document.querySelector("#pause_record").addEventListener("click", async(e)=>{
            if (this.hsMediaRecorder.recordState === "recording") { //如果是正在录制状态，暂停录制

                // 暂停录制
                await this.hsMediaRecorder.pauseRecord()

                // 取消定时器
                clearInterval(this.interval_timer_id)

                e.target.innerHTML = '继续录制';

                // 播放 提示音
                await this.reminder_audio_obj.play()
            }else if(this.hsMediaRecorder.recordState === "paused"){ //如果是暂停状态，继续录制

                // 启动定时器
                this.record_time()

                // 播放 提示音
                await this.reminder_audio_obj.play()
                // 监听提示音播放完毕事件
                this.reminder_audio_obj.addEventListener('ended', () => {
                    // 继续录制
                    this.hsMediaRecorder.resumeRecord()

                    e.target.innerHTML = '暂停录制';

                }, {
                    once: true
                });

            }
        })

        // 4.停止录制
        document.querySelector("#stop_record").addEventListener("click", async (e)=>{

            // 初始化 全部媒体控制按钮
            document.querySelector("#pause_record").innerHTML = '暂停录制';
            document.querySelector("#start_record").disabled = false
            document.querySelector("#audio_select").disabled = false
            document.querySelector("#pause_record").disabled = true
            document.querySelector("#stop_record").disabled = true

            // 停止录制
            let durationBlob = await this.hsMediaRecorder.stopRecord()

            // 保存录制内容
            this.hsMediaSave.saveMedia(durationBlob)

            // 取消定时器
            clearInterval(this.interval_timer_id)

            // 播放 提示音
            await this.reminder_audio_obj.play()
            alert('录制完成')

        })

    }

    // 页面dom元素事件
    start_dom_event(){
        // 声音选择
        document.querySelector("#audio_select").addEventListener("change", (e)=>{
            // 获取选中值
            this.hsMediaStream.selectedAudioSort = e.target.options[e.target.selectedIndex].value
        })
    }

    // 创建音频提示音
    create_reminder_audio(){
        this.reminder_audio_obj = new Audio(path.join(__dirname,  'audio', 'reminder.mp3'))
    }

    // 定时器
    record_time(){
        this.interval_timer_id = setInterval(()=>{
            this.cur_second_number += 1;
            document.querySelector('#record_time').innerHTML = this.cur_second_number;
        }, 1000)
    }
}

new Index().start()








