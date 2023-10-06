/* 绑定媒体流(视频音频流)设备 */
class HsMediaStream {
    // 麦克风流设备(如果值不为null,说明麦克风设备正常)
    microphoneStream = null

    // 定义音频捕获方式
    defaultAudioConfig = false

    // 定义视频捕获方式
    defaultVideoConfig = {
        mandatory: {
            chromeMediaSource: 'desktop'
        }
    }

    // 声音种类: none(没有声音), microphone(仅麦克风), loudspeaker(仅扬声器), all(同时麦克风和扬声器)
    selectedAudioSort = 'all'

    //设置默认声音捕获配置
    setDefaultAudioConfig() {
        switch (this.selectedAudioSort) {
            case 'none': //  none(没有声音)
                this.defaultAudioConfig = false
                break;
            case 'microphone':  //  microphone(麦克风)
                // 判断 麦克风是否 正常
                if(this.microphoneStream){
                    // 如果 麦克风 正常，关闭视频默认声道(扬声器声道)
                    this.defaultAudioConfig = false
                }else{
                    // 如果 麦克风 不存在，开启视频默认声道(扬声器声道)
                    this.defaultAudioConfig = {
                        mandatory: {
                            chromeMediaSource: 'desktop'
                        }
                    }
                }
                break;
            case 'loudspeaker':  //  loudspeaker(扬声器)
                this.defaultAudioConfig = { // 如果扬声器不存在不生效但不会报错
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                }
                break;
            case 'all':
                // 判断 麦克风是否 正常
                if(this.microphoneStream){
                    // 如果 麦克风 正常，关闭视频默认声道(扬声器声道)
                    this.defaultAudioConfig = false
                }else{
                    // 如果 麦克风 不存在，开启视频默认声道(扬声器声道)
                    this.defaultAudioConfig = {
                        mandatory: {
                            chromeMediaSource: 'desktop'
                        }
                    }
                }
        }

    }

    // 获取媒体流
    async getMediaStream(){
        //设置默认声音捕获配置
        this.setDefaultAudioConfig()

        // 获取视频流
        const MediaStream = await this.getVideoStream()

        // 如果选择了麦克风并且麦克风存在，添加到声音轨道
        if(this.microphoneStream){
            this.addAudioTracks(MediaStream)
        }

        return MediaStream
    }

    // 添加音频轨道
    addAudioTracks(stream){
        // 添加声道(同时捕获扬声器和麦克风声音)
        stream.addTrack(this.microphoneStream.getAudioTracks()[0]);
    }

    // 获取视频流
    getVideoStream(){
        // 实时捕获视频流
        return navigator.mediaDevices.getUserMedia({
            audio:this.defaultAudioConfig,
            video: this.defaultVideoConfig
        })
    }

    // 视频预览
    async previewVideoStream (videoSelector) {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false, // 禁用音频
            video: this.defaultVideoConfig
        })

        // 获取视频对象
        const video = document.querySelector(videoSelector)

        // 流资源赋值到
        video.srcObject = stream
        // 视频/音频（audio/video） 元数据加载完成触发事件
        video.onloadedmetadata = (e) => video.play()
    }

    // 检测麦克风是否正常工作
    async microphone_check(){
        try{
            this.microphoneStream = await navigator.mediaDevices.getUserMedia({
                audio: true,  // 获取麦克风设备
                video: false  // 禁用摄像头设备或屏幕捕获
            })
        }catch{
            this.microphoneStream = null
        }
    }

}

module.exports = HsMediaStream


