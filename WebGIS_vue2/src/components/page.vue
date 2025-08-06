<template>
    <div class="page">
        <input type="text" placeholder="起点经度" v-model="lng"><p style="display: none">{{ lng_z }}</p>
        <input type="text" placeholder="起点纬度" v-model="lat"><p style="display: none">{{ lat_z }}</p>
        <input type="text" placeholder="起点高度" v-model="height"><p style="display: none">{{ height_z }}</p>
        <input type="text" placeholder="终点经度" v-model="lng2"><p style="display: none">{{ lng_z2 }}</p>
        <input type="text" placeholder="终点纬度" v-model="lat2"><p style="display: none">{{ lat_z2 }}</p>
        <input type="text" placeholder="终点高度" v-model="height2"><p style="display: none">{{ height_z2 }}</p>
        <input type="file" accept="video/*" @change="handleVideoUpload" class="fileinput">
        <div class="same">
            <!-- <video ref="videoPlayer1" muted crossorigin controls id="daolu1" class="video">
                <source src="@/assets/4.mp4">
            </video> -->
            <video muted crossorigin controls v-if="uploadedVideo" ref="videoPlayer1" id="daolu1" class="video">
                <source :src="uploadedVideo" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
        <input type="checkbox" v-model="custom_btn" class="check">自定义位置
        <input type="checkbox" v-model="custom_btn2" class="check2">动态
        <button @click="load" class="identify">加载</button>
        <button @click="identify" class="identify">识别</button>
        <div class="same">
            <video ref="videoPlayer2" muted crossorigin controls id="daolu2" :style="identifyvideo" class="video">
                <source src="@/assets/4_identify2.mp4">
            </video>
        </div>
    </div>
</template>

<script>
import {videoFrustum} from '@/static/videoFrustum1'
export default {
    props: [
        'viewer',
        'lists',
        'lists2',
    ],
    data() {
        return {
            videoFrustumUtil: null,
            lng: '',
            lat: '',
            height: '',
            lng2: '',
            lat2: '',
            height2: '',
            startposition: [],
            endposition: [],
            currentposition: '',
            isidentifyvideo: false,
            videoid: '',
            custom_btn: false,
            custom_btn2: false,
            uploadedVideo: '',
        }
    },
    methods: {
        async loadvideo(msg) {
            let videoElement = document.getElementById(msg)
            this.videoFrustumUtil = new videoFrustum({
                viewer: this.viewer,
                fov: 33,
                near: 0.1,
                far: 40,
                aspectRatio: 1980 / 1080,
                material: videoElement,
                // isClampToGround: 'false',
                hpr: {
                    heading: 179,
                    pitch: 180,
                    roll: 0
                },
                // farPlanePoints:[0,100,100,0]
            })
            //startposition
            if (!this.lng || !this.lat || !this.height) {
                this.startposition = [104.06621979958834, 30.563705319826873, 500]
            } else if (this.custom_btn == false) {
                this.startposition = [104.06621979958834, 30.563705319826873, 500]
            } else (
                this.startposition = [this.lng, this.lat, this.height + 40]
            )
            //enfposition
            if (!this.lng2 || !this.lat2 || !this.height2) {
                this.endposition = [104.06630883390996, 30.56041273159397, 500]
            } else if (this.custom_btn == false) {
                this.endposition = [104.06630883390996, 30.56041273159397, 500]
            } else (
                this.endposition = [this.lng2, this.lat2, this.height2 + 40]
            )
            if (this.custom_btn2 == false) {
                this.videoFrustumUtil.createByPosition(this.startposition).then(() => {
                    // this.videoFrustumUtil.createByPosition([this.lng, this.lat, this.height]).then(() => {
                    console.log('测试完成');
                    // videoElement.play();
                    if (videoElement.paused) {
                        videoElement.play()
                            .then(() => {
                                // 视频成功开始播放
                            })
                            .catch((error) => {
                                // 播放视频出错
                                console.error(error);
                            });
                    } else {
                        // 视频已经在播放中
                    }
                })
            } else {
                let startPosition = new Cesium.Cartesian3.fromDegrees(this.startposition[0], this.startposition[1], this.startposition[2]);
                let endPosition = new Cesium.Cartesian3.fromDegrees(this.endposition[0], this.endposition[1], this.endposition[2]);
                this.videoFrustumUtil.createByPosition(this.startposition).then(() => {
                    // this.videoFrustumUtil.createByPosition([this.lng, this.lat, this.height]).then(() => {
                    console.log('测试完成');
                    // videoElement.play();
                    if (videoElement.paused) {
                        videoElement.play()
                            .then(() => {
                                // 视频成功开始播放
                            })
                            .catch((error) => {
                                // 播放视频出错
                                console.error(error);
                            });
                    } else {
                        // 视频已经在播放中
                    }
                })
                for (let t = 0; t <= 175; t ++) {
                    let currentposition = Cesium.Cartesian3.lerp(startPosition, endPosition, t/175, new Cesium.Cartesian3());

                    // 将Cartesian3坐标转换为Cartographic地理坐标
                    let cartographic = Cesium.Cartographic.fromCartesian(currentposition);

                    // 获取经纬度信息
                    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    let height = cartographic.height;
                    // if (t % 250 == 0) {
                        this.videoFrustumUtil.update({
                            viewer: this.viewer,
                            fov: 33,
                            near: 0.1,
                            far: 40,
                            aspectRatio: 1980 / 1080,
                            longitude: longitude,
                            latitude: latitude,
                            // isClampToGround: 'false',
                            hpr: {
                                heading: 179,
                                pitch: 180,
                                roll: 0
                            },
                        })
                    // }
                    // console.log(longitude)
                    this.viewer.trackedEntity = this.videoFrustumUtil;
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }
        },
        updatevideo(msg) {
            let videoElement = document.getElementById(msg)
            this.videoFrustumUtil.update({
                viewer: this.viewer,
                fov: 33,
                near: 0.1,
                far: 40,
                aspectRatio: 1980 / 1080,
                material: videoElement,
                longitude: this.endposition[0],
                latitude: this.endposition[1],
                // isClampToGround: 'false',
                hpr: {
                    heading: 179,
                    pitch: 180,
                    roll: 0
                },
            })
            videoElement.play()

        },

        load(){
            this.videoid = 'daolu1'
            if(this.videoFrustumUtil){
                this.updatevideo(this.videoid)
            }else{
                this.loadvideo(this.videoid)
            }
        },

        identify() {
            this.videoid = 'daolu2'
            if (this.videoFrustumUtil) {
                // setTimeout(() => {
                if (this.isidentifyvideo == false) {
                    this.isidentifyvideo = true
                }
                if(this.endposition){
                    this.onVideo1Play()
                    this.updatevideo(this.videoid)
                    console.log('1')
                }else{
                    this.updatevideo(this.videoid)
                    console.log('2')
                }
                // else{
                //     this.isidentifyvideo = false
                // }

                // }, 5000)
            } else {
                console.log('未加载视频')
            }


        },

        onVideo1Play() {
            const currentTime = this.$refs.videoPlayer1.currentTime;
            this.$refs.videoPlayer2.currentTime = currentTime;
            this.$refs.videoPlayer2.play();
        },

        handleVideoUpload(event) {
            this.state = false
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedVideo = e.target.result;
                };
                reader.readAsDataURL(file); 
            }
        },

    },
    computed:{
        lng_z(){
            return this.lng = this.lists[0]
        },
        lat_z(){
            return this.lat = this.lists[1]
        },
        height_z(){
            return this.height = this.lists[2]
        },
        lng_z2(){
            return this.lng2 = this.lists2[0]
        },
        lat_z2(){
            return this.lat2 = this.lists2[1]
        },
        height_z2(){
            return this.height2 = this.lists2[2]
        },
        identifyvideo(){
            return {
                display: this.isidentifyvideo ? 'block' : 'none'
            }
        }
    },
}
</script>

<style scoped>
.page {
    width: 430px;
    height: 540px;
    background-color: white;
    position: fixed;
    z-index: 100;
    top: 8%;
    left: 2%;
    /* display: none; */
}
.same{
    width: 410px;
    height: 200px;
    background-color: rgb(174, 175, 175);
    margin: 10px 10px;
}
.identify{
    margin: 0 20px;
    width: 50px;
}
.video{
    width: 410px;
    height: 200px;
}
input{
    width: 135px;
    margin-left: 6px;
}
.check{
    margin-left: 33px;
    width: 20px;
}
.check2{
    margin-left: 10px;
    width: 20px;
}
.fileinput{
    margin-top: 10px;
    margin-left: 11px;
    width: auto;
}
</style>